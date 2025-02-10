const { NotFoundError } = require("../../core/exceptions");
const APIFeatures = require("../../core/utils/APIFeatures");
const Category = require("../entities/Category");

class CategoryRepository {
  async add(categoryData) {
    const category = await Category.create(categoryData);
    return category;
  }

  async findAll(queryStr) {
    let query = Category.find().populate("parent", "name");

    const features = new APIFeatures(query, queryStr, [
      "name",
      "code",
      "parent",
    ])
      .filter()
      .sort()
      .limitFields()
      .paginate(); // Example: Searching by 'name' & 'code'

    return await features.query;
  }

  async findById(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    return category;
  }

  async update(id, updateData) {
    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    return category;
  }

  async delete(id) {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        deleted_at: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    return category;
  }
}

module.exports = CategoryRepository;
