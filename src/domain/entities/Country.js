const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a country name"],
      unique: true,
      trim: true,
      index: true,
    },
    iso2: {
      type: String,
      required: [true, "Please enter a 2-letter ISO code"],
    },
    iso3: {
      type: String,
      required: [true, "Please enter a 3-letter ISO code"],
    },
    iso3_Num: {
      type: Number,
      required: [true, "Please enter a numeric ISO code"],
    },
    continent: {
      type: String,
      required: [true, "Please enter a continent"],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    status: {
      type: String,
      default: "No",
    },
    deleted_at: {
      type: Date,
      default: null,
      select: false,
    },
  },
  { timestamps: true }
);

const Country = mongoose.model("Country", countrySchema);
module.exports = Country;
