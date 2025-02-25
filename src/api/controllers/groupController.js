const { BadRequestError } = require("../../core/exceptions");
const GroupService = require("../../domain/services/groupService");
const { sendResponse } = require("../../core/utils/response");
const AsyncHandler = require("../../core/utils/AsyncHandler");

class GroupController {
  static addGroup = AsyncHandler(async (req, res, next) => {
    const user = req.user._id;
    const group = await GroupService.addGroup({ ...req.body, user });
    sendResponse(res, 201, "Group Added successfully", group);
  });

  static importGroups = AsyncHandler(async (req, res, next) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Call the service to process the file
    const result = await GroupService.importGroupsFromFile(file.path);

    res.status(200).json({
      message: "Groups imported successfully",
      data: result,
    });
  });

  static getGroups = AsyncHandler(async (req, res, next) => {
    const { groups, totalDocuments } = await GroupService.getAllGroup(
      req.query
    );
    sendResponse(
      res,
      200,
      "Groups fetched successfully",
      groups,
      totalDocuments
    );
  });

  static getGroup = AsyncHandler(async (req, res, next) => {
    const group = await GroupService.getGroupById(req.params.id);
    sendResponse(res, 200, "Group fetched successfully", group);
  });

  static updateGroup = AsyncHandler(async (req, res, next) => {
    const user = req.user._id;
    const group = await GroupService.updateGroup(req.params.id, {
      ...req.body,
      user,
    });
    sendResponse(res, 200, "Group updated sucessfully", group);
  });

  static deleteGroup = AsyncHandler(async (req, res, next) => {
    const group = await GroupService.deleteGroup(req.params.id);
    sendResponse(res, 204, "Group deleted sucessfully", group);
  });
}

module.exports = GroupController;
