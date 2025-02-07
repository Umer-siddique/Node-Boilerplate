const GroupService = require("../../domain/services/groupService");
const { sendResponse } = require("../../core/utils/response");
const AsyncHandler = require("../../core/utils/AsyncHandler");

class GroupController {
  static addGroup = AsyncHandler(async (req, res, next) => {
    const group = await GroupService.addGroup(req.body);
    sendResponse(res, 201, "Group Added successfully", group);
  });

  static getGroups = AsyncHandler(async (req, res, next) => {
    const groups = await GroupService.getAllGroup();
    sendResponse(res, 200, "Groups fetched successfully", groups);
  });

  static getGroup = AsyncHandler(async (req, res, next) => {
    const group = await GroupService.getGroupById(req.params.id);
    sendResponse(res, 200, "Group fetched successfully", group);
  });

  static updateGroup = AsyncHandler(async (req, res, next) => {
    const group = await GroupService.updateGroup(req.params.id, req.body);
    sendResponse(res, 200, "Group updated sucessfully", group);
  });

  static deleteGroup = AsyncHandler(async (req, res, next) => {
    const group = await GroupService.deleteGroup(req.params.id);
    sendResponse(res, 204, "Group deleted sucessfully", group);
  });
}

module.exports = GroupController;
