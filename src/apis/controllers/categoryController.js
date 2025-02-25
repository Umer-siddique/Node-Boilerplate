const CategoryService = require("../../domain/services/categoryService");
const { sendResponse } = require("../../core/utils/response");
const AsyncHandler = require("../../core/utils/AsyncHandler");
const { BadRequestError } = require("../../core/exceptions");

class CategoryController {
  static addCategory = AsyncHandler(async (req, res, next) => {
    const user = req.user._id;
    const category = await CategoryService.addCategory({
      ...req.body,
      user,
    });
    sendResponse(res, 201, "Category Added successfully", category);
  });

  static importCategories = AsyncHandler(async (req, res, next) => {
    const file = req.file;
    if (!file) throw new BadRequestError("No file uploaded");

    // Call the service to process the file
    const result = await CategoryService.importCategoriesFromFile(
      req.user._id,
      file.path
    );

    res.status(200).json({
      message: "Categories imported successfully",
      data: result,
    });
  });

  static getCategories = AsyncHandler(async (req, res, next) => {
    const { categories, totalDocuments } = await CategoryService.getAllCategory(
      req.query
    );
    sendResponse(
      res,
      200,
      "Categories fetched successfully",
      categories,
      totalDocuments
    );
  });

  static getParentCategories = AsyncHandler(async (req, res, next) => {
    const categories = await CategoryService.getParentCategories();
    sendResponse(res, 200, "Categories fetched successfully", categories);
  });

  static getChildCategories = AsyncHandler(async (req, res, next) => {
    const subCategories = await CategoryService.getChildCategories();
    sendResponse(
      res,
      200,
      "Sub Categories fetched successfully",
      subCategories
    );
  });

  static getCategory = AsyncHandler(async (req, res, next) => {
    const category = await CategoryService.getCategoryById(req.params.id);
    sendResponse(res, 200, "Category fetched successfully", category);
  });

  static updateCategory = AsyncHandler(async (req, res, next) => {
    const user = req.user._id;
    const category = await CategoryService.updateCategory(req.params.id, {
      ...req.body,
      user,
    });
    sendResponse(res, 200, "Category updated sucessfully", category);
  });

  static deleteCategory = AsyncHandler(async (req, res, next) => {
    const category = await CategoryService.deleteCategory(req.params.id);
    sendResponse(res, 204, "Category deleted sucessfully", category);
  });
}

module.exports = CategoryController;
