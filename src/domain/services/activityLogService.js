const ActivityLogRepository = require("../repositories/activityLogRepository");

const activityLogRepository = new ActivityLogRepository();

class ActivityLogService {
  async logActivity({
    user,
    action,
    entityType,
    entityId,
    entityName,
    changes = [],
  }) {
    return await activityLogRepository.create({
      user,
      action,
      entityType,
      entityId,
      entityName,
      changes,
    });
  }

  async getLogsByEntity(entityId, entityType) {
    return await activityLogRepository.findByEntity(entityId, entityType);
  }
  async getLogsByEntityName(entityType) {
    return await activityLogRepository.findByEntityName(entityType);
  }

  async getAllLogs(filter = {}, page = 1, limit = 10) {
    const logs = await activityLogRepository.findAll(filter, page, limit);
    const totalLogs = await activityLogRepository.count(filter);
    return {
      logs,
      totalLogs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page,
    };
  }
}

module.exports = new ActivityLogService();
