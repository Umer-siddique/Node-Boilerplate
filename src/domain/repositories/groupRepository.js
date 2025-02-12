const { NotFoundError } = require("../../core/exceptions");
const Group = require("../entities/Group");
const APIFeatures = require("../../core/utils/APIFeatures");

class GroupRepository {
  async add(groupData) {
    const group = await Group.create(groupData);
    return group;
  }

  async findAll(queryStr) {
    let query = Group.find({ deleted_at: null });

    // Create an instance of APIFeatures but DO NOT apply pagination before counting
    const features = new APIFeatures(query, queryStr, ["name"])
      .filter()
      .sort()
      .limitFields();

    // Get total count **before applying pagination**
    const totalDocuments = await Group.countDocuments(
      features.query.getFilter()
    );

    // Now apply pagination
    features.paginate();

    const groups = await features.query;
    return { groups, totalDocuments };
  }

  async findById(id) {
    const group = await Group.findById(id);
    if (!group) {
      throw new NotFoundError("Group not found");
    }
    return group;
  }

  async update(id, updateData) {
    const group = await Group.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!group) {
      throw new NotFoundError("Group not found");
    }
    return group;
  }

  async softDelete(id) {
    const group = await Group.findByIdAndUpdate(
      id,
      {
        deleted_at: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!group) {
      throw new NotFoundError("Group not found");
    }
    return group;
  }

  async delete(id) {
    const group = await Group.findByIdAndDelete(id);
    if (!group) {
      throw new NotFoundError("Group not found");
    }
    return group;
  }
}

module.exports = GroupRepository;
