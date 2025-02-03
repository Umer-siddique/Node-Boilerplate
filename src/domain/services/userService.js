const UserRepository = require("../repositories/userRepository");
const { BadRequestError, UnauthorizedError } = require("../../core/exceptions");

const userRepository = new UserRepository();

class UserService {
  static async createUser(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestError("Email already in use"); // Throw error directly
    }

    const user = await userRepository.create(userData);
    return user;
  }

  static async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new BadRequestError("User not found"); // Throw error directly
    }
    return user;
  }

  static async loginUser(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedError("Invalid email or password"); // Throw error directly
    }
    return user;
  }
}

module.exports = UserService;
