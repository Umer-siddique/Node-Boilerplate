const mongoose = require("mongoose");

// Define countryRatificationSchema first
const instrumentCountrySchema = new mongoose.Schema(
  {
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: [true, "Please provide a country"],
    },
    ratified: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    ratificationDate: {
      type: Date,
      default: null,
      required: [true, "Ratification date is required"],
    },
  },
  { timestamps: true }
);

const InstrumentCountry = mongoose.model(
  "InstrumentCountry",
  instrumentCountrySchema
);

module.exports = InstrumentCountry;
