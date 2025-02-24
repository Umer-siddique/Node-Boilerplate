const express = require("express");
const router = express.Router();
const ActivityLogController = require("../controllers/activityLogController");

router.get(
  "/entity/:entityId/:entityType",
  ActivityLogController.getLogsByEntity
);
router.get("/entity/:entityType", ActivityLogController.getLogsByEntityName);
router.get("/", ActivityLogController.getAllLogs);

module.exports = router;
