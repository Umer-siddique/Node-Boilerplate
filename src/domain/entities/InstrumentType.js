const mongoose = require("mongoose");

const instrumentTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Instrument type name is required"],
    unique: true,
    index: true,
  },
  order: {
    type: Number,
    required: [true, "Order is required"],
    validate: {
      validator: Number.isInteger,
      message: "Order must be an integer.",
    },
  },
  status: {
    type: Boolean,
    default: false,
    enum: {
      values: [true, false], // false: Inactive, true: Active
      message: "Status must be either false (Inactive) or true (Active)",
    },
  },
});

const InstrumentType = mongoose.model("InstrumentType", instrumentTypeSchema);
module.exports = InstrumentType;
