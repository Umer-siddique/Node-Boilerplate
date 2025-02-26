const GroupRepository = require("../repositories/groupRepository");
const csv = require("csv-parser");
const stream = require("stream");
const XLSX = require("xlsx");

const groupRepository = new GroupRepository();

class GroupService {
  static async importGroupsFromFile(user, fileBuffer, fileType) {
    const groups = [];

    // Check the file type (MIME type)
    if (fileType === "text/csv") {
      // Parse CSV file from buffer
      await new Promise((resolve, reject) => {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);

        bufferStream
          .pipe(csv())
          .on("data", (row) => groups.push(row))
          .on("end", resolve)
          .on("error", reject);
      });
    } else if (
      fileType === "application/vnd.ms-excel" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      // Parse Excel file from buffer
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
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
