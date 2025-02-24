const mongoose = require("mongoose");

const instrumentTypeSchema = new mongoose.Schema(
  {
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
      required: [true, "Please select status"],
      enum: {
        values: [true, false], // false: Inactive, true: Active
        message: "Status must be either false (Inactive) or true (Active)",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    deleted_at: {
      type: Date,
      default: null,
      // select: false,
    },
  },
  { timestamps: true }
);

const InstrumentType = mongoose.model("InstrumentType", instrumentTypeSchema);
module.exports = InstrumentType;
