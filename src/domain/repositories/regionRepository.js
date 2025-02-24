const { NotFoundError } = require("../../core/exceptions");
const Region = require("../entities/Region");
const APIFeatures = require("../../core/utils/APIFeatures");

class RegionRepository {
  async add(regionData) {
    const region = await Region.create(regionData);
    return region;
  }

  async findAll(queryStr) {
    let query = Region.find({ deleted_at: null })
      .populate("user", "name email")
      .populate("parent", "name");

    if (queryStr && Object.keys(queryStr).length > 0) {
      // Create an instance of APIFeatures but DO NOT apply pagination before counting
      const features = new APIFeatures(query, queryStr, ["name", "regionCode"])
        .filter()
        .sort()
        .limitFields();

      // Get total count **before applying pagination**
      const totalDocuments = await Region.countDocuments(
        features.query.getFilter()
      );

      // Now apply pagination
      features.paginate();

      const regions = await features.query;
      return { regions, totalDocuments };
    } else {
      // If queryStr is empty, return all InstrumentTypes without filtering
      const regions = await query;
      const totalDocuments = await Region.countDocuments({
        deleted_at: null,
      });

      return { regions, totalDocuments };
    }
  }

  async findRegions() {
    return await Region.find({ parent: null });
  }
  async findSubRegions() {
    return await Region.find({ parent: { $ne: null } });
  }

  async findById(id) {
    const region = await Region.findById(id);
    if (!region) {
      throw new NotFoundError("Region not found");
    }
    return region;
  }

  async update(id, updateData) {
    const region = await Region.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!region) {
      throw new NotFoundError("Region not found");
    }
    return region;
  }

  async softDelete(id) {
    const region = await Region.findByIdAndUpdate(
      id,
      {
        deleted_at: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!region) {
      throw new NotFoundError("Region not found");
    }
    return region;
  }

  async delete(id) {
    const region = await Region.findByIdAndDelete(id);
    if (!region) {
      throw new NotFoundError("Region not found");
    }
    return region;
  }
}

module.exports = RegionRepository;
