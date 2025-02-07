const CategoryRepository = require("../repositories/categoryRepository");

const categoryRepository = new CategoryRepository();

class CategoryService {
  static async addCategory(categoryData) {
    return await categoryRepository.add(categoryData);
  }

  static async getAllCategory() {
    return await categoryRepository.findAll();
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
