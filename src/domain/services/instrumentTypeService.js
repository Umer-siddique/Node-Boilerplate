const InstrumentTypeRepository = require("../repositories/instrumentTypeRepository");

const instrumentTypeRepository = new InstrumentTypeRepository();

class InstrumentTypeService {
  static async addInstrumentType(instrumentTypeData) {
    return await instrumentTypeRepository.add(instrumentTypeData);
  }

  static async getAllInstrumentType(queryStr) {
    return await instrumentTypeRepository.findAll(queryStr);
  }

  static async getInstrumentTypeById(instrumentTypeId) {
    return await instrumentTypeRepository.findById(instrumentTypeId);
  }
  static async updateInstrumentType(instrumentTypeId, updateData) {
    return await instrumentTypeRepository.update(instrumentTypeId, updateData);
  }
  static async deleteInstrumentType(instrumentTypeId) {
    return await instrumentTypeRepository.delete(instrumentTypeId);
  }
}

module.exports = InstrumentTypeService;
