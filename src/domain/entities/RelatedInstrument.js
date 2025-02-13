const mongoose = require("mongoose");

const relatedInstrumentSchema = new mongoose.Schema(
  {
    instrument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstrumentDetail",
      default: null,
    },
    relatedTreaties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InstrumentDetail",
      },
    ],
  },
  { timestamps: true }
);

const RelatedInstrument = mongoose.model(
  "RelatedInstrument",
  relatedInstrumentSchema
);
module.exports = RelatedInstrument;
