const { AppError } = require("../../core/exceptions");
const Country = require("../entities/Country");

class CountryRepository {
  async add(countryData) {
    const country = await Country.create(countryData);
    return country;
  }

  async findAll() {
    const countries = await Country.find({});
    return countries;
  }

  async findById(id) {
    const country = await Country.findById(id);
    if (!country) {
      throw new AppError("Country not found", 404); // Throw error directly
    }
    return country;
  }

  async update(id, updateData) {
    const country = await Country.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!country) {
      throw new AppError("Country not found", 404); // Throw error directly
    }
    return country;
  }

  async delete(id) {
    const country = await Country.findByIdAndUpdate(
      id,
      {
        deleted_at: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!country) {
      throw new AppError("Country not found", 404); // Throw error directly
    }
    return country;
  }
}

module.exports = CountryRepository;
