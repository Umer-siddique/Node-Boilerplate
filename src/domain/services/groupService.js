const GroupRepository = require("../repositories/groupRepository");

const groupRepository = new GroupRepository();

class GroupService {
  static async addGroup(groupData) {
    return await groupRepository.add(groupData);
  }

  static async getAllGroup(queryStr) {
    return await groupRepository.findAll(queryStr);
  }

  static async getGroupById(groupId) {
    return await groupRepository.findById(groupId);
  }
  static async updateGroup(groupId, updateData) {
    return await groupRepository.update(groupId, updateData);
  }
  static async deleteGroup(groupId) {
    return await groupRepository.delete(groupId);
  }
}

module.exports = GroupService;
