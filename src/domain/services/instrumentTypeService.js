const InstrumentTypeRepository = require("../repositories/instrumentTypeRepository");
const ActivityLogService = require("../services/activityLogService");
const csv = require("csv-parser");
const stream = require("stream");
const XLSX = require("xlsx");

const instrumentTypeRepository = new InstrumentTypeRepository();

class InstrumentTypeService {
  static async importInstrumentTypesFromFile(user, fileBuffer, fileType) {
    const instrumentTypes = [];

    // Check the file type (MIME type)
    if (fileType === "text/csv") {
      await new Promise((resolve, reject) => {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);

        bufferStream
          .pipe(csv())
          .on("data", (row) => instrumentTypes.push(row))
          .on("end", resolve)
          .on("error", reject);
      });
    } else if (
      fileType === "application/vnd.ms-excel" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // Use the first sheet
      const sheet = workbook.Sheets[sheetName];
      instrumentTypes.push(...XLSX.utils.sheet_to_json(sheet));
    } else {
      throw new Error(
        "Unsupported file type. Only CSV and Excel files are allowed."
      );
    }

    // Transform and save/update each instrumentType
    const savedInstrumentTypes = [];
    for (const instrumentType of instrumentTypes) {
      try {
        const transformedInstrumentType = this.transformInstrumentTypeData(
          user,
          instrumentType
        );

        // Check if instrument type already exists by name
        const existingInstrumentType =
          await instrumentTypeRepository.findByName(
            transformedInstrumentType.name
          );

        let savedInstrumentType;
        if (existingInstrumentType) {
          // Update existing instrument type
          savedInstrumentType = await instrumentTypeRepository.update(
            existingInstrumentType._id,
            transformedInstrumentType
          );
        } else {
          // Create new instrument type
          savedInstrumentType = await instrumentTypeRepository.create(
            transformedInstrumentType
          );
        }

        savedInstrumentTypes.push(savedInstrumentType);
      } catch (error) {
        console.error(
          `Error processing instrumentType: ${instrumentType.Name}`,
          error
        );
      }
    }

    return savedInstrumentTypes;
  }

  // Helper function to transform instrumentType data
  static transformInstrumentTypeData(user, instrumentType) {
    return {
      name: instrumentType["Name"]?.trim(),
      order: instrumentType["Order"],
      status: Boolean(instrumentType["Active"]?.toLowerCase()),
      user,
    };
  }

  static async addInstrumentType(instrumentTypeData, userId) {
    const instrumentType = await instrumentTypeRepository.add(
      instrumentTypeData
    );

    // Log the activity
    await ActivityLogService.logActivity({
      user: userId,
      action: "CREATE",
      entityType: "InstrumentType",
      entityId: instrumentType._id,
      entityName: instrumentType.name,
    });

    return instrumentType;
  }

  static async getAllInstrumentType(queryStr) {
    return await instrumentTypeRepository.findAll(queryStr);
  }

  static async getInstrumentTypeById(instrumentTypeId) {
    return await instrumentTypeRepository.findById(instrumentTypeId);
  }

  static async updateInstrumentType(instrumentTypeId, updateData, userId) {
    // Fetch the existing instrument type
    const existingInstrumentType = await instrumentTypeRepository.findById(
      instrumentTypeId
    );

    // Track changes
    const changes = Object.keys(updateData).map((key) => ({
      field: key,
      oldValue: existingInstrumentType[key],
      newValue: updateData[key],
    }));

    // Update the instrument type
    const updatedInstrumentType = await instrumentTypeRepository.update(
      instrumentTypeId,
      updateData
    );

    // Log the activity
    await ActivityLogService.logActivity({
      user: userId,
      action: "UPDATE",
      entityType: "InstrumentType",
      entityId: updatedInstrumentType._id,
      entityName: updatedInstrumentType.name,
      changes,
    });

    return updatedInstrumentType;
  }
  static async deleteInstrumentType(instrumentTypeId, userId) {
    const instrumentType = await instrumentTypeRepository.delete(
      instrumentTypeId
    );

    // Log the activity
    await ActivityLogService.logActivity({
      user: userId,
      action: "DELETE",
      entityType: "InstrumentType",
      entityId: instrumentType._id,
      entityName: instrumentType.name,
    });
  }
}

module.exports = InstrumentTypeService;
