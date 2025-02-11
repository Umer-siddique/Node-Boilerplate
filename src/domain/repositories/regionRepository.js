const { NotFoundError } = require("../../core/exceptions");
const Region = require("../entities/Region");
const APIFeatures = require("../../core/utils/APIFeatures");

class RegionRepository {
  async add(regionData) {
    const region = await Region.create(regionData);
    return region;
  }

  async findAll(queryStr) {
    let query = Region.find({ deleted_at: null }).populate("parent", "name");

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

  async delete(id) {
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
}

module.exports = RegionRepository;
