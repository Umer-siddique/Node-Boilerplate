const User = require("../entities/User");

class UserRepository {
  async create(userData) {
    const user = await User.create(userData);
    return user;
  }

  async findById(id) {
    const user = await User.findById(id).select("-password");
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
    return user;
  }

  async deleteUser(id) {
    await User.findByIdAndDelete(id);
  }
}

module.exports = UserRepository;
