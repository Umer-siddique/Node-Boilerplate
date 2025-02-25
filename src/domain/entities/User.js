const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { ROLES } = require("../../config/constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 character"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Prevents password from being returned in queries
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 6,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          }),
        message:
          "Password must be at least 6 characters, with one uppercase, one number, and one symbol",
      },
    },
    role: {
      type: String,
      required: [true, "Please select a role"],
      lowercase: true,
      enum: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.DATAMANAGER, ROLES.USER],
      default: "user",
    },
    status: {
      type: Boolean,
      default: false,
      enum: {
        values: [true, false], // 0: Inactive, 1: Active
        message: "Status must be either false (Inactive) or true (Active)",
      },
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

    passwordChangedAt: Date,
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Hash password before saving to the database
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// Add password update to the database
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Compare provided password with the hashed password in the database
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Mongoose query middleware
// Will show all the user who are acitve/non blocked or deleted
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ status: { $ne: false } });
  next();
});

// Remove sensitive fields from the JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
