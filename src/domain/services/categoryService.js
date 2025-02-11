const CategoryRepository = require("../repositories/categoryRepository");

const categoryRepository = new CategoryRepository();

class CategoryService {
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
