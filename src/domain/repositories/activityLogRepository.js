const ActivityLog = require("../entities/ActivityLog");

class ActivityLogRepository {
  async create(logData) {
    const log = new ActivityLog(logData);
    await log.save();
    return log;
  }

  async findByEntity(entityId, entityType) {
    return await ActivityLog.find({ entityId, entityType })
      .sort({ timestamp: -1 })
      .populate("user", "name email");
  }
  async findByEntityName(entityType) {
    return await ActivityLog.find({ entityType })
      .sort({ timestamp: -1 })
      .populate("user", "name email");
  }

  async findAll(filter = {}, page = 1, limit = 10) {
    return await ActivityLog.find(filter)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "name email");
  }

  async count(filter = {}) {
    return await ActivityLog.countDocuments(filter);
  }
}

module.exports = ActivityLogRepository;
