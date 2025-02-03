const { AppError } = require("../../core/exceptions");
const User = require("../entities/User");

class UserRepository {
  async create(userData) {
    const user = await User.create(userData);
    return user;
  }

  async findById(id) {
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new AppError("User not found", 404); // Throw error directly
    }
    return user;
  }

  async findByEmail(email) {
    const user = await User.findOne({ email }).select("+password");
    return user;
  }

  async updateUser(id, updateData) {
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) {
      throw new AppError("User not found", 404); // Throw error directly
    }
    return user;
  }

  async deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new AppError("User not found", 404); // Throw error directly
    }
  }
}

module.exports = UserRepository;
