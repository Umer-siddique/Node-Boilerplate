const UserService = require("../../domain/services/userService");
const { sendResponse } = require("../../core/utils/response");
const AsyncHandler = require("../../core/utils/AsyncHandler");

class UserController {
  static createUser = AsyncHandler(async (req, res, next) => {
    const user = await UserService.createUser(req.body);
    sendResponse(res, 201, "User created successfully", user);
  });

  static getUser = AsyncHandler(async (req, res, next) => {
    const user = await UserService.getUserById(req.params.id);
    sendResponse(res, 200, "User fetched successfully", user);
  });

  static loginUser = AsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await UserService.loginUser(email, password);
    sendResponse(res, 200, "Login successful", user);
  });
}

module.exports = UserController;
