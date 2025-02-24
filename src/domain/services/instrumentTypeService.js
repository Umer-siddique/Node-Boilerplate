const InstrumentTypeRepository = require("../repositories/instrumentTypeRepository");
const ActivityLogService = require("../services/activityLogService");

const instrumentTypeRepository = new InstrumentTypeRepository();

class InstrumentTypeService {
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
