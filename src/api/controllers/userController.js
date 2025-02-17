const UserService = require("../../domain/services/userService");
const { sendResponse } = require("../../core/utils/response");
const AsyncHandler = require("../../core/utils/AsyncHandler");
const createSendToken = require("../../core/utils/createSendToken");

class UserController {
  static createUser = AsyncHandler(async (req, res, next) => {
    const user = await UserService.createUser(req.body);
    sendResponse(res, 201, "User created successfully", user);
  });

  static loginUser = AsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await UserService.loginUser(email, password);
    createSendToken(user, 200, req, res);
  });

  static getUsers = AsyncHandler(async (req, res, next) => {
    const { users, totalDocuments } = await UserService.getAllUser(req.query);
    sendResponse(res, 200, "Users fetched successfully", users, totalDocuments);
  });

  static getUser = AsyncHandler(async (req, res, next) => {
    const user = await UserService.getUser(req.params.id);
    sendResponse(res, 200, "User fetched successfully", user);
  });

  static updateUser = AsyncHandler(async (req, res, next) => {
    const user = await UserService.updateUser(req.params.id, req.body);
    sendResponse(res, 200, "User updated successfully", user);
  });
  static deleteUser = AsyncHandler(async (req, res, next) => {
    const user = await UserService.deleteUser(req.params.id);
    sendResponse(res, 200, "User updated successfully", user);
  });
}

module.exports = UserController;
