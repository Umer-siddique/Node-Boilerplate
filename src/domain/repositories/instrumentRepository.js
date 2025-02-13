const { AppError } = require("../../core/exceptions");
const APIFeatures = require("../../core/utils/APIFeatures");
const Instrument = require("../entities/Instrument");
// const RelatedInstrument = require("../entities/RelatedInstrument");
// const InstrumentDetail = require("../entities/InstrumentDetail");
// const InstrumentGroup = require("../entities/InstrumentGroup");

class InstrumentRepository {
  // async addTreaty(instrumentData) {
  //   const treaty = await RelatedInstrument.create(instrumentData);
  //   return treaty;
  // }
  // async addRelatedGroups(instrumentData) {
  //   const groups = await InstrumentGroup.create(instrumentData);
  //   return groups;
  // }

  // async findAllInstrumentsDetails() {
  //   return await InstrumentDetail.find();
  // }

  async add(instrumentData) {
    const instrument = await Instrument.create(instrumentData);
    return instrument;
  }

  async findAll(queryStr) {
    let query = Instrument.find({ deleted_at: null });

    // Create an instance of APIFeatures but DO NOT apply pagination before counting
    const features = new APIFeatures(query, queryStr, ["name"])
      .filter()
      .sort()
      .limitFields();

    // Get total count **before applying pagination**
    const totalDocuments = await Instrument.countDocuments(
      features.query.getFilter()
    );

    // Now apply pagination
    features.paginate();

    const instruments = await features.query;
    return { instruments, totalDocuments };
  }

  async findById(id) {
    const instrument = await Instrument.findById(id);
    if (!instrument) {
      throw new AppError("Instrument not found", 404); // Throw error directly
    }
    return instrument;
  }

  async update(id, updateData) {
    const instrument = await Instrument.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!instrument) {
      throw new AppError("Instrument not found", 404); // Throw error directly
    }
    return instrument;
  }

  async softDelete(id) {
    const instrument = await Instrument.findByIdAndUpdate(
      id,
      {
        deleted_at: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!instrument) {
      throw new AppError("Instrument not found", 404); // Throw error directly
    }
    return instrument;
  }

  async delete(id) {
    const instrument = await Instrument.findByIdAndDelete(id);
    if (!instrument) {
      throw new NotFoundError("Instrument not found");
    }
    return instrument;
  }
}

module.exports = InstrumentRepository;
