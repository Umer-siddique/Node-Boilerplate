const { NotFoundError } = require("../../core/exceptions");
const InstrumentType = require("../entities/InstrumentType");
const APIFeatures = require("../../core/utils/APIFeatures");

class InstrumentTypeRepository {
  async add(instrumentTypeData) {
    const instrumentType = await InstrumentType.create(instrumentTypeData);
    return instrumentType;
  }

  async findAll(queryStr) {
    let query = InstrumentType.find({ deleted_at: null });

    // Create an instance of APIFeatures but DO NOT apply pagination before counting
    const features = new APIFeatures(query, queryStr, ["name"])
      .filter()
      .sort()
      .limitFields();

    // Get total count **before applying pagination**
    const totalDocuments = await InstrumentType.countDocuments(
      features.query.getFilter()
    );

    // Now apply pagination
    features.paginate();

    const instrumentTypes = await features.query;
    return { instrumentTypes, totalDocuments };
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

  async softDelete(id) {
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

  async delete(id) {
    const instrumentType = await InstrumentType.findByIdAndDelete(id);
    if (!instrumentType) {
      throw new NotFoundError("InstrumentType not found");
    }
    return instrumentType;
  }
}

module.exports = InstrumentTypeRepository;
