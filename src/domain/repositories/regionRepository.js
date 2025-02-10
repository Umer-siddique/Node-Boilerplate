const { NotFoundError } = require("../../core/exceptions");
const Region = require("../entities/Region");
const APIFeatures = require("../../core/utils/APIFeatures");

class RegionRepository {
  async add(regionData) {
    const region = await Region.create(regionData);
    return region;
  }

  async findAll(queryStr) {
    let query = await Region.find();

    const features = new APIFeatures(query, queryStr, [
      "name",
      "regionCode",
      "parent",
    ])
      .filter()
      .sort()
      .limitFields()
      .paginate(); // Example: Searching by 'name.regionCode,parent'

    return await features.query;
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
