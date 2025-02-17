const UserRepository = require("../repositories/userRepository");
const { BadRequestError, UnauthorizedError } = require("../../core/exceptions");

const userRepository = new UserRepository();

class UserService {
  static async createUser(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestError("Email already in use"); // Throw error directly
    }

    return await userRepository.create(userData);
  }

  static async loginUser(email, password) {
    // 1) Check if email and password exist
    if (!email || !password) {
      throw new BadRequestError("Please provide email and password!");
    }

    // 2) Check if user exists && password is correct
    const user = await userRepository.findByEmail(email);

    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedError("Incorrect email or password"); // Throw error directly
    }

    // Check if user deleted or blocked
    if (!user.status) {
      throw new BadRequestError("User may have been deleted or blocked!");
    }

    return user;
  }

  static async getAllUser(queryStr) {
    return await userRepository.findAll(queryStr);
  }

  static async getUser(id) {
    return await userRepository.findById(id);
  }
  static async updateUser(userId, updateData) {
    return await userRepository.update(userId, updateData);
  }
  static async deleteUser(userId) {
    return await userRepository.delete(userId);
  }
}

module.exports = UserService;
