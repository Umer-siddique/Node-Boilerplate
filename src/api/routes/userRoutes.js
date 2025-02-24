const express = require("express");
const UserController = require("../controllers/userController");
const authProtect = require("../middlewares/authMiddleware");
const permissionProtect = require("../middlewares/authProtectMiddleware");

const router = express.Router();

router.use(authProtect);
// router.use(permissionProtect("super admin"));

router.get("/", UserController.getUsers);

router
  .route("/:id")
  .get(UserController.getUser)
  .patch(UserController.updateUser)
  .delete(UserController.deleteUser);

module.exports = router;
