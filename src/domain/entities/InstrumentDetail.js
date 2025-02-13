const mongoose = require("mongoose");

const instrumentDetailSchema = new mongoose.Schema(
  {
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
      required: [true, "Please enter depositary"],
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
    aboutInfo: {
      type: String,
      default: "",
    },
    relevantInfo: {
      type: String,
      default: "",
    },
    additionalInfo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const InstrumentDetail = mongoose.model(
  "InstrumentDetail",
  instrumentDetailSchema
);
module.exports = InstrumentDetail;
