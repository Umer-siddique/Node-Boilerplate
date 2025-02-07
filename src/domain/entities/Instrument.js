const mongoose = require("mongoose");

// Define countryRatificationSchema first
const countryRatificationSchema = new mongoose.Schema({
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  ratification: {
    type: String,
    enum: ["Yes", "No"],
    default: "No",
  },
  ratificationDate: {
    type: Date,
    default: null,
  },
});

const instrumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Instrument name is required"],
    unique: true,
    index: true,
  },
  instrumentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InstrumentType",
    required: [true, "Please select instrument type"],
    index: true,
  },
  entryDate: {
    type: Date,
    required: [true, "Entry date is required"],
  },
  depositary: {
    type: String,
    default: "",
  },
  signedDate: {
    type: Date,
    required: [true, "Signed date is required"],
  },
  signedPlace: {
    type: String,
    required: [true, "Signed place is required"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please select category"],
    index: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please select sub category"],
    index: true,
  },
  relevance: {
    type: Number,
    default: 0,
  },
  about: {
    type: String,
    default: "",
  },
  relevant: {
    type: String,
    default: "",
  },
  additional: {
    type: String,
    default: "",
  },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  relatedTreaties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instrument",
    },
  ],
  countryRatifications: {
    type: [countryRatificationSchema], // Array of countryRatification objects
    default: [], // Default to an empty array
  },
  deleted_at: {
    type: Date,
    default: null,
  },
});

const Instrument = mongoose.model("Instrument", instrumentSchema);
module.exports = Instrument;
