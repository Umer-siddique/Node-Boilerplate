const mongoose = require("mongoose");

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
      required: [true, "Category code is required"],
      index: true,
    },
    type: {
      type: String,
      enum: ["category", "sub-category"],
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Self-referencing for hierarchical structure
      default: null, // Null for top-level regions
    },
    status: {
      type: Boolean,
      default: false,
      enum: {
        values: [true, false], // false: Inactive, true: Active
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
// categorySchema.index({ name: 1, parent: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
