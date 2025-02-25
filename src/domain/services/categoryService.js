const CategoryRepository = require("../repositories/categoryRepository");
const csv = require("csv-parser");
const fs = require("fs");
const XLSX = require("xlsx");

const categoryRepository = new CategoryRepository();

class CategoryService {
  static async importCategoriesFromFile(user, filePath) {
    const categories = [];

    // Check the file extension
    const fileExtension = filePath.split(".").pop().toLowerCase();

    if (fileExtension === "csv") {
      // Parse CSV file
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (row) => categories.push(row))
          .on("end", resolve)
          .on("error", reject);
      });
    } else if (fileExtension === "xlsx") {
      // Parse Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Use the first sheet
      const sheet = workbook.Sheets[sheetName];
      categories.push(...XLSX.utils.sheet_to_json(sheet));
    } else {
      throw new Error(
        "Unsupported file type. Only CSV and Excel files are allowed."
      );
    }

    // Transform and save each category
    const savedCategories = [];
    for (const category of categories) {
      try {
        const transformedCategory = await this.transformCategoryData(
          user,
          category
        );

        // Save the category
        const savedCategory = await categoryRepository.create(
          transformedCategory
        );
        savedCategories.push(savedCategory);
      } catch (error) {
        console.error(`Error processing category: ${category.name}`, error);
      }
    }

    return savedCategories;
  }

  // Helper function to transform category data
  static async transformCategoryData(user, category) {
    // Resolve parent category (if provided)
    let parent = null;
    if (category["Parent"]) {
      const parentCategory = await categoryRepository.findByName(
        category["Parent"]
      );
      parent = parentCategory ? parentCategory._id : null;
    }

    // Determine the type
    const type = parent ? "sub-category" : "category";

    return {
      name: category["Name"],
      code: category["Code"]?.toString(),
      parent, // Resolved ObjectId or null
      status: category["Active"] === "Yes", // Convert to boolean
      type, // Set type based on parent
      user,
    };
  }

  static async addCategory(categoryData) {
    return await categoryRepository.add(categoryData);
  }

  static async getAllCategory(queryStr) {
    return await categoryRepository.findAll(queryStr);
  }

  static async getParentCategories() {
    return await categoryRepository.findCategories();
  }
  static async getChildCategories() {
    return await categoryRepository.findSubCategories();
  }

  static async getCategoryById(categoryId) {
    return await categoryRepository.findById(categoryId);
  }
  static async updateCategory(categoryId, updateData) {
    return await categoryRepository.update(categoryId, updateData);
  }
  static async deleteCategory(categoryId) {
    return await categoryRepository.delete(categoryId);
  }
}

module.exports = CategoryService;
