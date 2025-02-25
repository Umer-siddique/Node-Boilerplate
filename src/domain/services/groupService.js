const GroupRepository = require("../repositories/groupRepository");
const csv = require("csv-parser");
const fs = require("fs");
const XLSX = require("xlsx");

const groupRepository = new GroupRepository();

class GroupService {
  static async importGroupsFromFile(user, filePath) {
    const groups = [];

    // Check the file extension
    const fileExtension = filePath.split(".").pop().toLowerCase();

    if (fileExtension === "csv") {
      // Parse CSV file
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (row) => groups.push(row))
          .on("end", resolve)
          .on("error", reject);
      });
    } else if (fileExtension === "xlsx") {
      // Parse Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Use the first sheet
      const sheet = workbook.Sheets[sheetName];
      groups.push(...XLSX.utils.sheet_to_json(sheet));
    } else {
      throw new Error(
        "Unsupported file type. Only CSV and Excel files are allowed."
      );
    }

    // Transform and save each group
    const savedGroups = [];
    for (const group of groups) {
      try {
        const transformedGroup = this.transformGroupData(user, group);

        // Save the group
        const savedGroup = await groupRepository.create(transformedGroup);
        savedGroups.push(savedGroup);
      } catch (error) {
        console.error(`Error processing group: ${group.name}`, error);
      }
    }

    return savedGroups;
  }

  // Helper function to transform group data
  static transformGroupData(user, group) {
    // console.log("Groups", group);
    return {
      name: group["Name"],
      status: group["Active"] === "Yes",
      user,
    };
  }

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
