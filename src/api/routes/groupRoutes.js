const express = require("express");
const GroupController = require("../controllers/groupController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(GroupController.getGroups).post(GroupController.addGroup);

router
  .route("/:id")
  .get(GroupController.getGroup)
  .patch(GroupController.updateGroup)
  .delete(GroupController.deleteGroup);

module.exports = router;
