const { NotFoundError } = require("../../core/exceptions");
const APIFeatures = require("../../core/utils/APIFeatures");
const Category = require("../entities/Category");

class CategoryRepository {
  async add(categoryData) {
    const category = await Category.create(categoryData);
    return category;
  }

  async findAll(queryStr) {
    let query = Category.find({ deleted_at: null }).populate("parent", "name");

    // Create an instance of APIFeatures but DO NOT apply pagination before counting
    const features = new APIFeatures(query, queryStr, ["name", "code"])
      .filter()
      .sort()
      .limitFields();

    // Get total count **before applying pagination**
    const totalDocuments = await Category.countDocuments(
      features.query.getFilter()
    );

    // Now apply pagination
    features.paginate();

    const categories = await features.query;
    return { categories, totalDocuments };
  }

  async findCategories() {
    return await Category.find({ parent: null });
  }
  async findSubCategories() {
    return await Category.find({ parent: { $ne: null } });
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

  async sofDelete(id) {
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

  async delete(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    return category;
  }
}

module.exports = CategoryRepository;
