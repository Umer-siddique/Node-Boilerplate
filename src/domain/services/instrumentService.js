const ActivityLogService = require("./activityLogService");
const XLSX = require("xlsx");
const csv = require("csv-parser");
const stream = require("stream");
const InstrumentRepository = require("../repositories/instrumentRepository");
const InstrumentTypeRepository = require("../repositories/instrumentTypeRepository");
const CategoryRepository = require("../repositories/categoryRepository");
const GroupRepository = require("../repositories/groupRepository");
const CountryRepository = require("../repositories/countryRepository");
const { excelSerialToDate } = require("../../core/utils/helpers");
const { BadRequestError } = require("../../core/exceptions");

const instrumentRepository = new InstrumentRepository();
const instrumentTypeRepository = new InstrumentTypeRepository();
const categoryRepository = new CategoryRepository();
const groupRepository = new GroupRepository();
const countryRepository = new CountryRepository();

class InstrumentService {
  static async importInstrumentsFromFile(user, fileBuffer, fileType) {
    const instruments = [];

    // Check the file type (MIME type)
    if (fileType === "text/csv") {
      // Parse CSV file from buffer
      await new Promise((resolve, reject) => {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);

        bufferStream
          .pipe(csv())
          .on("data", (row) => instruments.push(row))
          .on("end", resolve)
          .on("error", reject);
      });
    } else if (
      fileType === "application/vnd.ms-excel" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      // Parse Excel file from buffer
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // Use the first sheet
      const sheet = workbook.Sheets[sheetName];
      instruments.push(...XLSX.utils.sheet_to_json(sheet));
    } else {
      throw new BadRequestError(
        "Unsupported file type. Only CSV and Excel files are allowed."
      );
    }

    // Transform and save each instrument
    const savedInstruments = [];
    for (const instrument of instruments) {
      try {
        const transformedInstrument = await this.transformInstrumentData(
          user,
          instrument
        );

        // Check if required fields are valid
        if (
          transformedInstrument.name &&
          transformedInstrument.signedDate &&
          transformedInstrument.instrumentType &&
          transformedInstrument.category &&
          transformedInstrument.subCategory
        ) {
          const savedInstrument = await instrumentRepository.create(
            transformedInstrument
          );
          savedInstruments.push(savedInstrument);
        } else {
          console.warn(
            `Skipping invalid instrument: ${transformedInstrument.name}`
          );
        }
      } catch (error) {
        console.error(`Error processing instrument: ${instrument.name}`, error);
      }
    }

    return savedInstruments;
  }

  // Helper function to transform and resolve references
  static async transformInstrumentData(user, instrument) {
    // Helper function to parse countryRatifications
    const parseCountryRatifications = async (countryRatifications) => {
      if (!countryRatifications) return [];

      // Split the comma-separated values into arrays
      const countries = countryRatifications["Country"].split(",");
      const ratifiedValues = countryRatifications["Ratified"].split(",");
      const ratificationDates =
        countryRatifications["Ratification Date"].split(",");

      // Create an array of countryRatification objects
      const countryRatificationsArray = await Promise.all(
        countries.map(async (country, index) => {
          // Find the country by name and get its ObjectId
          const countryDoc = await countryRepository.findByName(country.trim());
          if (!countryDoc) return null;

          // Convert Ratified to boolean
          const ratified =
            ratifiedValues[index].trim().toLowerCase() === "true";

          // Convert Ratification Date to a valid date
          const ratificationDate = excelSerialToDate(
            ratificationDates[index].trim()
          );

          return {
            countryName: countryDoc._id, // Resolved ObjectId
            ratified,
            ratificationDate,
            statusChangeDate: new Date(), // Set to current date or another logic
          };
        })
      );

      // Filter out null values (invalid countries)
      return countryRatificationsArray.filter((item) => item !== null);
    };

    // Resolve ObjectId references (return null if not found)
    const instrumentType = await instrumentTypeRepository.findByName(
      instrument["Instrument Type"]
    );
    const category = await categoryRepository.findByName(
      instrument["Category"]
    );
    const subCategory = await categoryRepository.findByName(
      instrument["Sub Category"]
    );

    // Resolve Related Treaties and Groups (comma-separated names)
    const relatedTreaties = await Promise.all(
      instrument["Related Treaties"].split(",").map(async (name) => {
        const treaty = await instrumentRepository.findByName(name.trim());
        return treaty ? treaty._id : null; // Return null if not found
      })
    );

    const groups = await Promise.all(
      instrument["Groups"].split(",").map(async (name) => {
        const group = await groupRepository.findByName(name.trim());
        return group ? group._id : null; // Return null if not found
      })
    );

    // Parse countryRatifications
    const countryRatifications = await parseCountryRatifications({
      Country: instrument["Country"],
      Ratified: instrument["Ratified"],
      "Ratification Date": instrument["Ratification Date"],
    });

    // Transform the instrument data
    return {
      name: instrument["Name"],
      entryDate: excelSerialToDate(instrument["Entry Date"]), // Convert Excel serial to date
      depositary: instrument["Depositary"],
      signedDate: excelSerialToDate(instrument["Signed Date"]), // Convert Excel serial to date
      signedPlace: instrument["SignedPlace"],
      aboutInfo: instrument["About Info"],
      relevantInfo: instrument["Relevant Info"],
      additionalInfo: instrument["Additional Info"],
      instrumentType: instrumentType ? instrumentType._id : null, // Allow null
      category: category ? category._id : null, // Allow null
      subCategory: subCategory ? subCategory._id : null, // Allow null
      relatedTreaties: relatedTreaties.filter((id) => id !== null), // Filter out null values
      groups: groups.filter((id) => id !== null), // Filter out null values
      countryRatifications,
      user,
    };
  }

  static async addInstrument(instrumentData, userId) {
    const instrument = await instrumentRepository.add(instrumentData);

    // Log the activity
    await ActivityLogService.logActivity({
      user: userId,
      action: "CREATE",
      entityType: "Instrument",
      entityId: instrument._id,
      entityName: instrument.name,
    });

    return instrument;
  }

  static async getAllInstrument(queryStr) {
    return await instrumentRepository.findAll(queryStr);
  }
  static async getInstrumentsTotalRatificaitons(queryStr) {
    return await instrumentRepository.getTotalRatifications();
  }

  static async getInstrumentById(instrumentId) {
    return await instrumentRepository.findById(instrumentId);
  }
  static async updateInstrument(instrumentId, updateData, userId) {
    // Fetch the existing instrument type
    const existingInstrument = await instrumentRepository.findById(
      instrumentId
    );

    // Track changes
    const changes = Object.keys(updateData).map((key) => ({
      field: key,
      oldValue: existingInstrument[key],
      newValue: updateData[key],
    }));

    // Update the instrument type
    const updatedInstrument = await instrumentRepository.update(
      instrumentId,
      updateData
    );

    // Log the activity
    await ActivityLogService.logActivity({
      user: userId,
      action: "UPDATE",
      entityType: "Instrument",
      entityId: updatedInstrument._id,
      entityName: updatedInstrument.name,
      changes,
    });

    return updatedInstrument;
  }
  static async deleteInstrument(instrumentId, userId) {
    const instrument = await instrumentRepository.delete(instrumentId);

    // Log the activity
    await ActivityLogService.logActivity({
      user: userId,
      action: "DELETE",
      entityType: "Instrument",
      entityId: instrument._id,
      entityName: instrument.name,
    });
  }
}

module.exports = InstrumentService;
