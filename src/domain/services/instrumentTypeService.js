const InstrumentTypeRepository = require("../repositories/instrumentTypeRepository");
const ActivityLogService = require("../services/activityLogService");
const csv = require("csv-parser");
const fs = require("fs");
const XLSX = require("xlsx");

const instrumentTypeRepository = new InstrumentTypeRepository();

class InstrumentTypeService {
  static async importInstrumentTypeFromFile(filePath) {
    const instrumentTypes = [];

    // Check the file extension
    const fileExtension = filePath.split(".").pop().toLowerCase();

    if (fileExtension === "csv") {
      // Parse CSV file
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (row) => instrumentTypes.push(row))
          .on("end", resolve)
          .on("error", reject);
      });
    } else if (fileExtension === "xlsx") {
      // Parse Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Use the first sheet
      const sheet = workbook.Sheets[sheetName];
      instrumentTypes.push(...XLSX.utils.sheet_to_json(sheet));
    } else {
      throw new Error(
        "Unsupported file type. Only CSV and Excel files are allowed."
      );
    }

    // Transform and save each instrumentType
    const savedInstrumentTypes = [];
    for (const instrumentType of instrumentTypes) {
      try {
        const transformedInstrumentType =
          this.transformInstrumentTypeData(instrumentType);

        // Save the instrumentType
        const savedInstrumentType = await instrumentTypeRepository.create(
          transformedInstrumentType
        );
        savedInstrumentTypes.push(savedInstrumentType);
      } catch (error) {
        console.error(
          `Error processing instrumentType: ${instrumentType.name}`,
          error
        );
      }
    }

    return savedInstrumentTypes;
  }

  // Helper function to transform instrumentType data
  static transformInstrumentTypeData(instrumentType) {
    // console.log("InstrumentTypes", instrumentType);
    return {
      name: instrumentType["Name"],
      order: instrumentType["Order"],
      status: instrumentType["Active"] === "Yes",
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
