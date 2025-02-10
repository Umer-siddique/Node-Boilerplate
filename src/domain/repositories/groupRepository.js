const { NotFoundError } = require("../../core/exceptions");
const Group = require("../entities/Group");
const APIFeatures = require("../../core/utils/APIFeatures");

class GroupRepository {
  async add(groupData) {
    const group = await Group.create(groupData);
    return group;
  }

  async findAll(queryStr) {
    let query = Group.find();

    const features = new APIFeatures(query, queryStr, ["name"])
      .filter()
      .sort()
      .limitFields()
      .paginate(); // Example: Searching by 'name'

    return await features.query;
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

  async delete(id) {
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
}

module.exports = GroupRepository;
