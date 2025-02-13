const mongoose = require("mongoose");

const instrumentSchema = new mongoose.Schema(
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
    relatedTreaties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instrument",
        default: [],
      },
    ],
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        default: [],
      },
    ],
    countryRatifications: {
      type: [
        {
          countryName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Country",
            required: [true, "Please provide a country"],
          },
          ratified: {
            type: Boolean,
            enum: [true, false],
            // required: [true, "Ratification status is required"],
            default: false,
          },
          ratificationDate: {
            type: Date,
            required: function () {
              return this.ratified === true;
            }, // Required only if ratified
            default: null,
          },
          statusChangeDate: {
            type: Date,
            required: true, // Tracks when the ratification status changed
          },
        },
      ],
      // default: [],
    },

    deleted_at: {
      type: Date,
      default: null,
      // select: false,
    },
  },
  { timestamps: true }
);

const Instrument = mongoose.model("Instrument", instrumentSchema);
module.exports = Instrument;
