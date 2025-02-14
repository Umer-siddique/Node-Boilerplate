const { AppError } = require("../../core/exceptions");
const Country = require("../entities/Country");
const APIFeatures = require("../../core/utils/APIFeatures");

class CountryRepository {
  async add(countryData) {
    const country = await Country.create(countryData);
    return country;
  }

  async findAll(queryStr) {
    let query = Country.find({ deleted_at: null }).populate(
      "regions",
      "name type"
    );

    // Create an instance of APIFeatures but DO NOT apply pagination before counting
    const features = new APIFeatures(query, queryStr, [
      "name",
      "iso_02",
      "iso_03",
      "continent",
    ])
      .filter()
      .sort()
      .limitFields();

    // Get total count **before applying pagination**
    const totalDocuments = await Country.countDocuments(
      features.query.getFilter()
    );

    // Now apply pagination
    features.paginate();

    const countries = await features.query;
    return { countries, totalDocuments };
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

  async softDelete(id) {
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

  async delete(id) {
    const country = await Country.findByIdAndDelete(id);
    if (!country) {
      throw new NotFoundError("Country not found");
    }
    return country;
  }
}

module.exports = CountryRepository;
