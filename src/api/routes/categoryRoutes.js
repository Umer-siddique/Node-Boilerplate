const express = require("express");
const CategoryController = require("../controllers/categoryController");
const authProtect = require("../middlewares/authMiddleware");
const upload = require("../../config/multer"); // Import the multer config

const router = express.Router();

router.post(
  "/import",
  upload.single("file"),
  CategoryController.importCategories
);

router.use(authProtect);

router.get("/parents", CategoryController.getParentCategories);
router.get("/childs", CategoryController.getChildCategories);

router
  .route("/")
  .get(CategoryController.getCategories)
  .post(CategoryController.addCategory);

router
  .route("/:id")
  .get(CategoryController.getCategory)
  .patch(CategoryController.updateCategory)
  .delete(CategoryController.deleteCategory);

module.exports = router;
