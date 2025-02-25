const ActivityLogService = require("../../domain/services/activityLogService");
const AsyncHandler = require("../../core/utils/AsyncHandler");

class ActivityLogController {
  static getLogsByEntity = AsyncHandler(async (req, res) => {
    const { entityId, entityType } = req.params;
    const logs = await ActivityLogService.getLogsByEntity(entityId, entityType);

    res.status(200).json(logs);
  });
  static getLogsByEntity = AsyncHandler(async (req, res) => {
    const { entityId, entityType } = req.params;
    const logs = await ActivityLogService.getLogsByEntity(entityId, entityType);

    res.status(200).json(logs);
  });

  static getLogsByEntityName = AsyncHandler(async (req, res) => {
    const { entityType } = req.params;
    const logs = await ActivityLogService.getLogsByEntityName(entityType);

    res.status(200).json(logs);
  });

  static getAllLogs = AsyncHandler(async (req, res) => {
    const { page = 1, limit = 10, entityType, action, userId } = req.query;
    const filter = {};
    if (entityType) filter.entityType = entityType;
    if (action) filter.action = action;
    if (userId) filter.userId = userId;

    const result = await ActivityLogService.getAllLogs(filter, page, limit);
    res.status(200).json(result);
  });
}

module.exports = ActivityLogController;
