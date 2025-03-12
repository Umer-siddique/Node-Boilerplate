const { AppError, NotFoundError } = require("../../core/exceptions");
const APIFeatures = require("../../core/utils/APIFeatures");
const Instrument = require("../entities/Instrument");
const Counter = require("../entities/Counter");
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
    // Find and update the counter in one atomic operation
    const counter = await Counter.findOneAndUpdate(
      { model: "Instrument" }, // Identify the counter by model name
      { $inc: { count: 1 } }, // Increment the count by 1
      { new: true, upsert: true } // Return the updated document and create if not exists
    );
    instrumentData.instrumentId = counter.count;

    return await Instrument.create(instrumentData);
  }

  async create(data) {
    // Find and update the counter in one atomic operation
    const counter = await Counter.findOneAndUpdate(
      { model: "Instrument" }, // Identify the counter by model name
      { $inc: { count: 1 } }, // Increment the count by 1
      { new: true, upsert: true } // Return the updated document and create if not exists
    );

    // Assign the incremented instrumentId to the new document
    data.instrumentId = counter.count;

    // Create and save the instrument
    const instrument = new Instrument(data);
    return await instrument.save({ runValidators: true, new: true });
  }

  async findAll(queryStr) {
    let query = Instrument.find({ deleted_at: null })
      .populate("user", "name email")
      .populate("category", "name weight")
      .populate("subCategory", "name")
      .populate("instrumentType", "name")
      .populate("relatedTreaties", "name")
      .populate("groups", "name")
      .populate("countryRatifications.countryName", "name");

    if (queryStr && Object.keys(queryStr).length > 0) {
      // Create an instance of APIFeatures but DO NOT apply pagination before counting
      const features = new APIFeatures(query, queryStr, [
        "name",
        "instrumentUUID",
      ])
        .filter()
        .sort()
        .limitFields();

      // Get total count **before applying pagination**
      const totalDocuments = await Instrument.countDocuments(
        features.query.getFilter()
      );

      // Now apply pagination
      // features.paginate();

      const instruments = await features.query;
      return { instruments, totalDocuments };
    } else {
      // If queryStr is empty, return all Instruments without filtering
      const instruments = await query;
      const totalDocuments = await Instrument.countDocuments({
        deleted_at: null,
      });

      return { instruments, totalDocuments };
    }
  }

  async getTotalRatifications() {
    const totalRatificationsSum = await Instrument.getTotalRatificationsSum();
    return totalRatificationsSum;
  }

  async findById(id) {
    const instrument = await Instrument.findById(id);
    if (!instrument) {
      throw new AppError("Instrument not found", 404); // Throw error directly
    }
    return instrument;
  }
  async findByName(name) {
    return await Instrument.findOne({ name });
  }
  async findByUUID(uuid) {
    const instrument = await Instrument.findOne({ instrumentUUID: uuid });
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
