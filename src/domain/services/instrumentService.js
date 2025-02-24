const InstrumentRepository = require("../repositories/instrumentRepository");
const ActivityLogService = require("./activityLogService");

const instrumentRepository = new InstrumentRepository();

class InstrumentService {
  // static async addRelatedTreaty(instrumentData) {
  //   return await instrumentRepository.addTreaty(instrumentData);
  // }
  // static async addGroups(instrumentData) {
  //   return await instrumentRepository.addRelatedGroups(instrumentData);
  // }
  // static async getInstrumentsDetails() {
  //   return await instrumentRepository.findAllInstrumentsDetails();
  // }
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
