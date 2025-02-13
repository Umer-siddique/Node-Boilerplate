const InstrumentRepository = require("../repositories/instrumentRepository");

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
  static async addInstrument(instrumentData) {
    return await instrumentRepository.add(instrumentData);
  }

  static async getAllInstrument(queryStr) {
    return await instrumentRepository.findAll(queryStr);
  }

  static async getInstrumentById(instrumentId) {
    return await instrumentRepository.findById(instrumentId);
  }
  static async updateInstrument(instrumentId, updateData) {
    return await instrumentRepository.update(instrumentId, updateData);
  }
  static async deleteInstrument(instrumentId) {
    return await instrumentRepository.delete(instrumentId);
  }
}

module.exports = InstrumentService;
