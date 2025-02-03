const express = require("express");
const UserController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", UserController.createUser);
router.get("/:id", UserController.getUser);
// router.get("/:id", authMiddleware, UserController.getUser);

module.exports = router;
