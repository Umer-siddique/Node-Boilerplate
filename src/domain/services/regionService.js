const RegionRepository = require("../repositories/regionRepository");

const regionRepository = new RegionRepository();

class RegionService {
  static async addRegion(regionData) {
    return await regionRepository.add(regionData);
  }

  static async getAllRegion(queryStr) {
    return await regionRepository.findAll(queryStr);
  }

  static async getParentRegions() {
    return await regionRepository.findRegions();
  }
  static async getChildRegions() {
    return await regionRepository.findSubRegions();
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
