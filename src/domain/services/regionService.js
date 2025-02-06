const RegionRepository = require("../repositories/regionRepository");

const regionRepository = new RegionRepository();

class RegionService {
  static async addRegion(regionData) {
    return await regionRepository.add(regionData);
  }

  static async getAllRegion() {
    return await regionRepository.findAll();
  }

  static async getRegionById(regionId) {
    return await regionRepository.findById(regionId);
  }
  static async updateRegion(regionId, updateData) {
    return await regionRepository.update(regionId, updateData);
  }
  static async deleteRegion(regionId) {
    return await regionRepository.delete(regionId);
  }
}

module.exports = RegionService;
