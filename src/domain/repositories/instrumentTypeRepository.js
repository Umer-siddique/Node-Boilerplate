const { NotFoundError } = require("../../core/exceptions");
const InstrumentType = require("../entities/InstrumentType");
const APIFeatures = require("../../core/utils/APIFeatures");

class InstrumentTypeRepository {
  async add(instrumentTypeData) {
    const instrumentType = await InstrumentType.create(instrumentTypeData);
    return instrumentType;
  }

  async findAll(queryStr) {
    let query = await InstrumentType.find();

    const features = new APIFeatures(query, queryStr, ["name"])
      .filter()
      .sort()
      .limitFields()
      .paginate(); // Example: Searching by 'name'

    return await features.query;
  }

  async findById(id) {
    const instrumentType = await InstrumentType.findById(id);
    if (!instrumentType) {
      throw new NotFoundError("InstrumentType not found");
    }
    return instrumentType;
  }

  async update(id, updateData) {
    const instrumentType = await InstrumentType.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!instrumentType) {
      throw new NotFoundError("InstrumentType not found");
    }
    return instrumentType;
  }

  async delete(id) {
    const instrumentType = await InstrumentType.findByIdAndUpdate(
      id,
      {
        deleted_at: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!instrumentType) {
      throw new NotFoundError("InstrumentType not found");
    }
    return instrumentType;
  }
}

module.exports = InstrumentTypeRepository;
