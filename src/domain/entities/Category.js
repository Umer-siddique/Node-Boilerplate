const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: [true, "Category code is required"],
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
      index: true,
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

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
