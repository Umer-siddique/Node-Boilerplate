const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      index: true,
    },
    code: {
      type: String,
      default: null,
      index: true,
    },
    type: {
      type: String,
      enum: ["category", "sub-category"],
      required: true,
    },
    weight: {
      type: Number,
      default: 0,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Self-referencing for hierarchical structure
      default: null, // Null for top-level categories
      validate: {
        validator: function (value) {
          // Parent is required only if the type is 'sub-category'
          return this.type === "sub-category" ? value !== null : true;
        },
        message: "Parent is required for sub-categories",
      },
    },
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
      default: "",
    },
    depth: {
      type: Number,
      default: 0,
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

// Virtual for counting instruments linked to categories
categorySchema.virtual("instruments", {
  ref: "Instrument", // Reference the Instrument model
  localField: "_id", // Field in the Category model
  foreignField: "category", // Field in the Instrument model
  count: true, // Return the count of matching documents
});

// Virtual for counting instruments linked to subcategories
categorySchema.virtual("subCategoryInstruments", {
  ref: "Instrument", // Reference the Instrument model
  localField: "_id", // Field in the Category model
  foreignField: "subCategory", // Field in the Instrument model
  count: true, // Return the count of matching documents
});

// Middleware to generate slug and set depth before saving
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (this.type === "sub-category" && this.parent) {
    // Calculate depth based on parent's depth
    this.constructor.findById(this.parent).then((parentCategory) => {
      this.depth = parentCategory ? parentCategory.depth + 1 : 0;
      next();
    });
  } else {
    this.depth = 0; // Top-level category
    next();
  }
});

// Middleware to handle updates (e.g., findByIdAndUpdate)
categorySchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }

  if (update.type === "sub-category" && update.parent) {
    const parentCategory = await this.model.findById(update.parent);
    update.depth = parentCategory ? parentCategory.depth + 1 : 0;
  } else if (update.type === "category") {
    update.depth = 0; // Reset depth for top-level categories
  }

  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
