const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name must be required"],
      unique: true,
      index: true,
    },
    status: {
      type: Boolean,
      default: false,
      required: [true, "Please select status"],
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

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
