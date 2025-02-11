const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Region name is required"],
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["region", "sub-region"],
      required: true,
    },
    regionType: {
      type: String,
      required: [true, "Region type is required"],
    },
    regionCode: {
      required: [true, "Region code is required"],
      type: String,
      match: [/^\d+$/, "Region Code must be numeric"],
      index: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region", // Self-referencing for hierarchical structure
      default: null, // Null for top-level regions
    },
    countries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country", // Reference to the Country collection
        default: [], // Empty for parent regions
        // validate: {
        //   validator: function (countries) {
        //     // Countries can only be added for sub-regions
        //     return this.type === "sub-region";
        //   },
        //   message: "Countries can only be added for sub-regions.",
        // },
      },
    ],
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

// Add a compound index to enforce uniqueness of `name` within the same `parent`
// regionSchema.index({ name: 1, parent: 1 }, { unique: true });

const Region = mongoose.model("Region", regionSchema);

module.exports = Region;
