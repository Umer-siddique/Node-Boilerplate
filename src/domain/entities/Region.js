const mongoose = require("mongoose");
const slugify = require("slugify");

const regionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Region name is required"],
      trim: true,
      index: true,
    },
    regionCode: {
      required: [true, "Region code is required"],
      type: String,
      match: [/^\d+$/, "Region Code must be numeric"],
      index: true,
    },
    regionType: {
      type: String,
      required: [true, "Region type is required"],
    },
    type: {
      type: String,
      enum: ["region", "sub-region"],
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region", // Self-referencing for hierarchical structure
      default: null, // Null for top-level regions
      validate: {
        validator: function (value) {
          // Parent is required only if the type is 'sub-region'
          return this.type === "sub-region" ? value !== null : true;
        },
        message: "Parent is required for sub-regions",
      },
    },
    countries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country", // Reference to the Country collection
        default: [], // Empty for parent regions
      },
    ],
    status: {
      type: Boolean,
      default: false,
      enum: {
        values: [true, false], // false: Inactive, true: Active
        message: "Status must be either false (Inactive) or true (Active)",
      },
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    depth: {
      type: Number,
      default: 0,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Middleware to generate slug and set depth before saving
regionSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (this.type === "sub-region" && this.parent) {
    // Calculate depth based on parent's depth
    this.constructor.findById(this.parent).then((parentRegion) => {
      this.depth = parentRegion ? parentRegion.depth + 1 : 0;
      next();
    });
  } else {
    this.depth = 0; // Top-level region
    next();
  }
});

// Middleware to handle updates (e.g., findByIdAndUpdate)
regionSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }

  if (update.type === "sub-region" && update.parent) {
    const parentRegion = await this.model.findById(update.parent);
    update.depth = parentRegion ? parentRegion.depth + 1 : 0;
  } else if (update.type === "region") {
    update.depth = 0; // Reset depth for top-level regions
  }

  next();
});

// Add a compound index to enforce uniqueness of `name` within the same `parent`
regionSchema.index({ name: 1, parent: 1 }, { unique: true });

const Region = mongoose.model("Region", regionSchema);

module.exports = Region;
