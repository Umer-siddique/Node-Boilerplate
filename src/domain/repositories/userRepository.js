const { NotFoundError } = require("../../core/exceptions");
const APIFeatures = require("../../core/utils/APIFeatures");
const User = require("../entities/User");

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findAll(queryStr) {
    let query = User.find({
      deleted_at: null,
      role: { $ne: "super admin" },
    }).populate("user", "name email");

    if (queryStr && Object.keys(queryStr).length > 0) {
      // Create an instance of APIFeatures but DO NOT apply pagination before counting
      const features = new APIFeatures(query, queryStr, ["name", "email"])
        .filter()
        .sort()
        .limitFields();

      // Get total count **before applying pagination**
      const totalDocuments = await User.countDocuments(
        features.query.getFilter()
      );

      // Now apply pagination
      // features.paginate();

      const users = await features.query;
      return { users, totalDocuments };
    } else {
      // If queryStr is empty, return all InstrumentTypes without filtering
      const users = await query;
      const totalDocuments = await User.countDocuments({
        deleted_at: null,
      });

      return { regions, totalDocuments };
    }
  }

  async findById(id) {
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new NotFoundError("User not found"); // Throw error directly
    }
    return user;
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select("+password");
  }

  async update(id, updateData) {
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) {
      throw new NotFoundError("User not found"); // Throw error directly
    }
    return user;
  }

  async delete(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundError("User not found", 404); // Throw error directly
    }
  }
}

module.exports = UserRepository;
