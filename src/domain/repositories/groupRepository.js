const { NotFoundError } = require("../../core/exceptions");
const Group = require("../entities/Group");

class GroupRepository {
  async add(groupData) {
    const group = await Group.create(groupData);
    return group;
  }

  async findAll() {
    const groups = await Group.find({});
    return groups;
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
