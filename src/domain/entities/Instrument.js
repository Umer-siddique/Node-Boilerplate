const mongoose = require("mongoose");

const instrumentSchema = new mongoose.Schema(
  {
    instrumentUUID: {
      type: String,
      required: [true, "Instrument UUID is required"],
      unique: true,
      index: true,
    },
    instrumentId: {
      type: Number,
      default: null,
    },
    name: {
      type: String,
      required: [true, "Instrument name is required"],
      unique: true,
      index: true,
    },
    entryDate: {
      type: Date,
      default: null,
    },
    depositary: {
      type: String,
      default: "",
    },
    signedDate: {
      type: Date,
      // required: [true, "Signed date is required"],
    },
    signedPlace: {
      type: String,
      default: "",
    },
    relevance: {
      type: Number,
      default: 0,
    },
    ratification: {
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
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
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
            default: false,
          },
          ratificationDate: {
            type: Date,
            required: function () {
              return this.ratified === true;
            },
            default: null,
          },
          statusChangeDate: {
            type: Date,
            required: true,
          },
        },
      ],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for total unique ratifications per instrument
instrumentSchema.virtual("totalRatifications").get(function () {
  const uniqueCountries = new Set();
  if (this.countryRatifications) {
    this.countryRatifications.forEach((ratification) => {
      uniqueCountries.add(ratification.countryName.toString());
    });
  }
  return uniqueCountries.size;
});

// Static method to calculate total sum of ratifications across all instruments
instrumentSchema.statics.getTotalRatificationsSum = async function () {
  const instruments = await this.find({}).select("countryRatifications");

  const uniqueCountries = new Set();

  instruments.forEach((instrument) => {
    if (instrument.countryRatifications) {
      instrument.countryRatifications.forEach((ratification) => {
        uniqueCountries.add(ratification.countryName.toString());
      });
    }
  });

  return uniqueCountries.size;
};

const Instrument = mongoose.model("Instrument", instrumentSchema);

module.exports = Instrument;
