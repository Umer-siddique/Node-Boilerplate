const CountryRepository = require("../repositories/countryRepository");

const countryRepository = new CountryRepository();

class CountryService {
  static async addCountry(countryData) {
    return await countryRepository.add(countryData);
  }

  static async getAllCountry() {
    return await countryRepository.findAll();
  }

  static async getCountryById(countryId) {
    return await countryRepository.findById(countryId);
  }
  static async updateCountry(countryId, updateData) {
    return await countryRepository.update(countryId, updateData);
  }
  static async deleteCountry(countryId) {
    return await countryRepository.delete(countryId);
  }
}

module.exports = CountryService;
