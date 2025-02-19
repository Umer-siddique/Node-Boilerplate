const mongoose = require("mongoose");

const instrumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Instrument name is required"],
      unique: true,
      index: true,
    },
    entryDate: {
      type: Date,
      // required: [true, "Entry date is required"],
      default: null,
    },
    depositary: {
      type: String,
      // required: [true, "Please enter depositary"],
      default: "",
    },
    signedDate: {
      type: Date,
      required: [true, "Signed date is required"],
    },
    signedPlace: {
      type: String,
      // required: [true, "Signed place is required"],
      defualt: "",
    },

    relevance: {
      type: Number,
      default: 0,
    },
    maxScore: {
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

    instrumentType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstrumentType",
      default: null,
      // required: [true, "Please select instrument type"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      // required: [true, "Please select category"],
      // index: true,
      default: null,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      // required: [true, "Please select sub category"],
      // index: true,
      default: null,
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
      default: [],
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
