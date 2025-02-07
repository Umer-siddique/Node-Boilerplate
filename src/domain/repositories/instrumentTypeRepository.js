const { NotFoundError } = require("../../core/exceptions");
const InstrumentType = require("../entities/InstrumentType");

class InstrumentTypeRepository {
  async add(instrumentTypeData) {
    const instrumentType = await InstrumentType.create(instrumentTypeData);
    return instrumentType;
  }

  async findAll() {
    const instrumentTypes = await InstrumentType.find({});
    return instrumentTypes;
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
