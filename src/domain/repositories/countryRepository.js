const { AppError } = require("../../core/exceptions");
const Country = require("../entities/Country");
const APIFeatures = require("../../core/utils/APIFeatures");

class CountryRepository {
  async add(countryData) {
    const country = await Country.create(countryData);
    return country;
  }

  async create(data) {
    const country = new Country(data);
    return await country.save({ runValidators: true, new: true });
  }

  async findAll(queryStr) {
    let query = Country.find({ deleted_at: null })
      .populate("user", "name email")
      .populate("regions", "name type");

    if (queryStr && Object.keys(queryStr).length > 0) {
      // Create an instance of APIFeatures only if queryStr exists
      const features = new APIFeatures(query, queryStr, [
        "name",
        "iso_02",
        "iso_03",
        "continent",
      ])
        .filter()
        .sort()
        .limitFields();

      // Get total count before applying pagination
      const totalDocuments = await Country.countDocuments(
        features.query.getFilter()
      );

      // Apply pagination
      // features.paginate();

      const countries = await features.query;
      return { countries, totalDocuments };
    } else {
      // If queryStr is empty, return all countries without filtering
      const countries = await query;
      const totalDocuments = await Country.countDocuments({ deleted_at: null });

      return { countries, totalDocuments };
    }
  }

  async findAllWithoutFilters() {
    return await Country.find({ parent: null });
  }

  async findById(id) {
    const country = await Country.findById(id);
    if (!country) {
      throw new AppError("Country not found", 404); // Throw error directly
    }
    return country;
  }
  async findByName(name) {
    const country = await Country.findOne({ name });
    // if (!country) {
    //   throw new AppError("Country not found", 404); // Throw error directly
    // }
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
