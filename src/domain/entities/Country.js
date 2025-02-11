const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Country name is required"],
      minlength: [2, "Country name must have at least 2 characters"],
      unique: true,
      trim: true,
      index: true,
    },

    iso_02: {
      type: String,
      required: [true, "ISO 02 code is required"],
      minlength: [2, "ISO 02 code must be exactly 2 characters"],
      maxlength: [2, "ISO 02 code must be exactly 2 characters"],
    },
    iso_03: {
      type: String,
      minlength: [3, "ISO 03 code must be exactly 3 characters"],
      maxlength: [3, "ISO 03 code must be exactly 3 characters"],
    },
    iso_03_num: {
      type: String,
      match: [/^\d+$/, "ISO 03 code must be numeric"],
    },
    continent: {
      type: String,
      required: [true, "Continent is required"],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      default: null,
    },
    status: {
      type: Boolean,
      default: false,
      enum: {
        values: [true, false], // 0: Inactive, 1: Active
        message: "Status must be either false (Inactive) or true (Active)",
      },
    },
    deleted_at: {
      type: Date,
      default: null,
      // select: false,
    },
  },
  { timestamps: true }
);

// Index for faster lookups by name, continent, and country code
countrySchema.index(
  { name: 1, continent: 1, iso_02: 1 },
  { name: "name_continent_iso_02_index" }
);

// Unique index to prevent duplicate country names with the same code
countrySchema.index(
  { name: 1, iso_02: 1 },
  { unique: true, name: "unique_name_iso_02_index" }
);

// Case-insensitive collation for name-based queries
countrySchema.index(
  { name: 1 },
  {
    collation: { locale: "en", strength: 2 },
    name: "case_insensitive_name_index",
  }
);

// Add a virtual field to fetch associated regions
countrySchema.virtual("regions", {
  ref: "Region", // Reference the Region model
  localField: "_id", // Field in the Country model
  foreignField: "countries", // Field in the Region model
  justOne: false, // Set to true if a country belongs to only one region
});

// Enable virtuals to be included in JSON responses
countrySchema.set("toJSON", { virtuals: true });
countrySchema.set("toObject", { virtuals: true });

const Country = mongoose.model("Country", countrySchema);
module.exports = Country;
