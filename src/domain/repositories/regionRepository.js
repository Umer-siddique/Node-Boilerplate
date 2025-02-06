const { AppError } = require("../../core/exceptions");
const Region = require("../entities/Region");

class RegionRepository {
  async add(regionData) {
    const region = await Region.create(regionData);
    return region;
  }

  async findAll() {
    const regions = await Region.find({});
    return regions;
  }

  async findById(id) {
    const region = await Region.findById(id);
    if (!region) {
      throw new AppError("Region not found", 404); // Throw error directly
    }
    return region;
  }

  async update(id, updateData) {
    const region = await Region.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!region) {
      throw new AppError("Region not found", 404); // Throw error directly
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
      throw new AppError("Region not found", 404); // Throw error directly
    }
    return region;
  }
}

module.exports = RegionRepository;
