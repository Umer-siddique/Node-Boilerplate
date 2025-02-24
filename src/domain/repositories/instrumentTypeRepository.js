const { NotFoundError } = require("../../core/exceptions");
const InstrumentType = require("../entities/InstrumentType");
const APIFeatures = require("../../core/utils/APIFeatures");

class InstrumentTypeRepository {
  async add(instrumentTypeData) {
    const instrumentType = await InstrumentType.create(instrumentTypeData);
    return instrumentType;
  }

  async findAll(queryStr) {
    let query = InstrumentType.find({ deleted_at: null }).populate(
      "user",
      "name email"
    );

    if (queryStr && Object.keys(queryStr).length > 0) {
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
    } else {
      // If queryStr is empty, return all InstrumentTypes without filtering
      const instrumentTypes = await query;
      const totalDocuments = await InstrumentType.countDocuments({
        deleted_at: null,
      });

      return { instrumentTypes, totalDocuments };
    }
  }

  async findById(id) {
    const instrumentType = await InstrumentType.findById(id);
    if (!instrumentType) {
      throw new NotFoundError("InstrumentType not found");
    }
    return instrumentType;
  }
  async findByName(name) {
    const instrumentType = await InstrumentType.findOne({ name });
    if (!instrumentType) {
      throw new NotFoundError("InstrumentType not found with the given name");
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
