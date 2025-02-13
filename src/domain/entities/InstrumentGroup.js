const mongoose = require("mongoose");

const instrumentGroupSchema = new mongoose.Schema(
  {
    instrument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstrumentDetail",
      default: null,
    },
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
  },
  { timestamps: true }
);

const InstrumentGroup = mongoose.model(
  "InstrumentGroup",
  instrumentGroupSchema
);
module.exports = InstrumentGroup;
