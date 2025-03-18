const ActivityLogService = require("./activityLogService");
const XLSX = require("xlsx");
const csv = require("csv-parser");
const stream = require("stream");
const { ObjectId } = require("mongodb");
const { generateUUID } = require("../../core/utils/helpers");
const InstrumentRepository = require("../repositories/instrumentRepository");
const InstrumentTypeRepository = require("../repositories/instrumentTypeRepository");
const CategoryRepository = require("../repositories/categoryRepository");
const GroupRepository = require("../repositories/groupRepository");
const CountryRepository = require("../repositories/countryRepository");
const { excelSerialToDate } = require("../../core/utils/helpers");
const { BadRequestError } = require("../../core/exceptions");
const {
  calculateRatifiedInstruments,
  calculateCountryScore,
  calculateWorldAvgScore,
  calculateCountryRank,
  calculateStrength,
} = require("../../core/utils/calculations");

const instrumentRepository = new InstrumentRepository();
const instrumentTypeRepository = new InstrumentTypeRepository();
const categoryRepository = new CategoryRepository();
const groupRepository = new GroupRepository();
const countryRepository = new CountryRepository();

class InstrumentService {
  static async getRatificationsCountByYear(instrumentId) {
    return await instrumentRepository.getRatificationsCountByYearForInstrument(
      instrumentId
    );
  }
  static async getCountryData(countryId) {
    const { instruments } = await instrumentRepository.findAll({});
    const { countries } = await countryRepository.findAll({});

    // Group by category and subcategory
    const categoryMap = new Map();

    instruments.forEach((instrument) => {
      const { category, subCategory } = instrument;

      if (!categoryMap.has(category)) {
        categoryMap.set(category, new Map());
      }

      const subCategoryMap = categoryMap.get(category);

      if (!subCategoryMap.has(subCategory)) {
        subCategoryMap.set(subCategory, []);
      }

      subCategoryMap.get(subCategory).push(instrument);
    });

    // Prepare the result
    const result = [];

    for (const [category, subCategoryMap] of categoryMap) {
      // Prepare the category data object

      const categoryData = {
        category,
        subCategories: [],
      };

      for (const [subCategory, instruments] of subCategoryMap) {
        // Calculate countryScore and worldAvgScore before using them
        const countryScore = calculateCountryScore(instruments, countryId);
        const worldAvgScore = calculateWorldAvgScore(
          countries,
          instruments,
          subCategory
        );

        // Extract instrument details for the subcategory
        const instrumentDetails = instruments.map((instrument) => {
          // Find the ratification date for the specific country
          const ratification = instrument.countryRatifications.find((rat) =>
            rat.countryName.equals(new ObjectId(countryId))
          );

          return {
            name: instrument.name,
            signedDate: instrument.signedDate,
            signedPlace: instrument.signedPlace,
            relevance: instrument.relevance,
            ratificationDate: ratification
              ? ratification.ratifications[
                  ratification.ratifications.length - 1
                ].ratificationDate
              : null, // Use the last ratification date
          };
        });

        const subCategoryData = {
          subCategory,
          instrumentsRatified: calculateRatifiedInstruments(
            instruments,
            countryId
          ),
          countryScore: countryScore, // Use the pre-calculated value
          worldAvgScore: worldAvgScore, // Use the pre-calculated value
          countryRankInWorld: calculateCountryRank(
            countries,
            instruments,
            subCategory,
            countryId
          ),
          strength: calculateStrength(countryScore, worldAvgScore), // Use the pre-calculated values
          instruments: instrumentDetails, // Include instrument details
        };

        categoryData.subCategories.push(subCategoryData);
      }

      result.push(categoryData);
    }

    return result;
  }
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

    // Transform and save/update each instrument
    const savedInstruments = [];
    for (const instrument of instruments) {
      // console.log("ExcelInstrument", instrument);
      try {
        // console.log(
        //   "InstrumentIDS",
        //   instrument["Old ID"],
        //   instrument["New ID"]
        // );

        // Check if the instrument has an Old ID and New ID
        if (instrument["Old ID"] && instrument["New ID"]) {
          const transformedInstrument = await this.transformInstrumentData(
            user,
            instrument
          );
          // console.log("TransformedInstrument", transformedInstrument);
          // Perform update operation
          const updatedInstrument = await instrumentRepository.update(
            instrument["New ID"],
            transformedInstrument
          );
          savedInstruments.push(updatedInstrument);
        } else {
          // Perform create operation
          const { instrumentId, ...cleanInstrument } =
            await this.transformInstrumentData(user, instrument);

          // console.log("TransformedInstrument", cleanInstrument);

          const _savedInstrument = await instrumentRepository.create({
            ...cleanInstrument,
            instrumentUUID: generateUUID(),
          });
          // console.log("CreatedInstrument", _savedInstrument);
          savedInstruments.push(_savedInstrument);
        }
      } catch (error) {
        console.error("Error processing instrument:", error);
        throw new BadRequestError(
          `Error processing instrument: ${instrument.Name}`,
          error
        );
      }
    }

    return savedInstruments;
  }

  // Helper function to transform and resolve references
  static async transformInstrumentData(user, instrument) {
    // console.log("Instrument", instrument);

    const parseCountryRatifications = async (countryRatifications) => {
      if (
        !countryRatifications ||
        !countryRatifications["Country"] ||
        !countryRatifications["Ratified"] ||
        !countryRatifications["Ratification Date"]
      ) {
        return [];
      }

      const countries = countryRatifications["Country"]
        .split(",")
        .map((c) => c.trim());

      // Use regex to correctly extract bracketed arrays for Ratified and Ratification Date
      const extractBracketedArrays = (input) => {
        const regex = /\[.*?\]/g; // Matches content inside square brackets
        return (input.match(regex) || []).map((item) =>
          item
            .replace(/^\[|\]$/g, "") // Remove outer brackets
            .split(",")
            .map((value) => value.trim())
        );
      };

      const ratifiedArray = extractBracketedArrays(
        countryRatifications["Ratified"]
      );
      const ratificationDatesArray = extractBracketedArrays(
        countryRatifications["Ratification Date"]
      );

      if (
        countries.length !== ratifiedArray.length ||
        countries.length !== ratificationDatesArray.length
      ) {
        throw new Error(
          "Mismatch between countries, ratified, and ratification date counts"
        );
      }

      const countryRatificationsArray = await Promise.all(
        countries.map(async (country, index) => {
          const countryDoc = await countryRepository.findByName(country.trim());
          if (!countryDoc) return null; // Skip if country not found

          const ratifiedValues = ratifiedArray[index].map(
            (value) => value.toLowerCase() === "true"
          );

          const ratificationDates = ratificationDatesArray[index].map(
            (dateStr) => {
              const parsedDate = new Date(dateStr);
              return isNaN(parsedDate) ? null : parsedDate;
            }
          );

          if (ratifiedValues.length !== ratificationDates.length) {
            throw new Error(
              `Mismatched ratified and date count for country ${country.trim()}`
            );
          }

          const ratifications = ratifiedValues.map((ratified, i) => ({
            ratified,
            ratificationDate: ratificationDates[i],
            statusChangeDate: new Date(), // Current date
          }));

          return {
            countryName: countryDoc._id,
            ratifications,
          };
        })
      );

      return countryRatificationsArray.filter(Boolean); // Remove nulls for missing countries
    };

    // Resolve object references
    const instrumentType = instrument["Instrument Type"]
      ? await instrumentTypeRepository.findByName(instrument["Instrument Type"])
      : null;
    const category = instrument["Category"]
      ? await categoryRepository.findByName(instrument["Category"])
      : null;
    const subCategory = instrument["Sub Category"]
      ? await categoryRepository.findByName(instrument["Sub Category"])
      : null;

    // Resolve related treaties
    const relatedTreaties = instrument["Related Treaties"]
      ? await Promise.all(
          instrument["Related Treaties"].split(",").map(async (name) => {
            const treaty = await instrumentRepository.findByName(name.trim());
            return treaty ? treaty._id : null;
          })
        )
      : [];

    // Resolve groups
    const groups = instrument["Groups"]
      ? await Promise.all(
          instrument["Groups"].split(",").map(async (name) => {
            const group = await groupRepository.findByName(name.trim());
            return group ? group._id : null;
          })
        )
      : [];

    // Parse updated countryRatifications structure
    const countryRatifications = await parseCountryRatifications({
      Country: instrument["Country"],
      Ratified: instrument["Ratified"],
      "Ratification Date": instrument["Ratification Date"],
    });

    // Final transformed object
    return {
      name: instrument["Name"]?.trim(),
      entryDate: instrument["Entry Into Force"]
        ? excelSerialToDate(instrument["Entry Into Force"])
        : null,
      depositary: instrument["Depositary"]?.trim(),
      signedDate: instrument["Signed Date"]
        ? excelSerialToDate(instrument["Signed Date"])
        : null,

      instrumentUUID: instrument["UUID"]?.trim(),
      signedPlace: instrument["Signed Place"]?.trim(),
      relevance: instrument["Relevance"],
      ratification: instrument["Ratification"],
      aboutInfo: instrument["About Info"]?.trim(),
      relevantInfo: instrument["Relevant Info"]?.trim(),
      additionalInfo: instrument["Additional Info"]?.trim(),
      instrumentType: instrumentType ? instrumentType._id : null,
      category: category ? category._id : null,
      subCategory: subCategory ? subCategory._id : null,
      relatedTreaties: relatedTreaties.filter((id) => id !== null),
      groups: groups.filter((id) => id !== null),
      countryRatifications, // Updated structure
      user,
      instrumentId: instrument["Old ID"],
    };
  }

  static async addInstrument(instrumentData, userId) {
    const instrument = await instrumentRepository.add({
      ...instrumentData,
      instrumentUUID: generateUUID(),
    });

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
