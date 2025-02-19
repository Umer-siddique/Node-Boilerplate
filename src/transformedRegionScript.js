// const fs = require("fs");
// const path = require("path");

// const dataDir = path.join(__dirname, "data"); // Centralized directory path

// // Helper function to safely read JSON files
// const readJsonFile = (filePath) => {
//   try {
//     return JSON.parse(fs.readFileSync(filePath, "utf-8"));
//   } catch (error) {
//     console.error(`Error reading file: ${filePath}`, error);
//     process.exit(1); // Exit if file read fails
//   }
// };

// // Load JSON files safely
// const regions = readJsonFile(
//   path.join(dataDir, "updatedLegacartaRegions.json")
// );

// regions.forEach((region) => {
//   if (region.parent) region.type = "sub-region";
//   if (region.regionId || region.parentId) {
//     delete region.regionId;
//     delete region.parentId;
//   }
// });

const { ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Read the JSON file
const dataDir = path.join(__dirname, "data"); // Centralized directory path

const readJsonFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    process.exit(1); // Exit if file read fails
  }
};

const data = readJsonFile(path.join(dataDir, "updatedLegacartaRegions.json"));

// Function to convert string IDs to ObjectId
function convertIdsToObjectId(data) {
  return data.map((row) => {
    if (Array.isArray(row.countries) && row.countries.length > 0) {
      row.countries = row.countries.map((id) => ({ $oid: id }));
    }
    return row;
  });
}

// Convert the IDs
const updatedData = convertIdsToObjectId(data);

// Save the updated legacarta.categories.json
const outputPath = path.join(
  dataDir,
  "updatedLegacartaRegionsWithObjectIds.json"
);
fs.writeFileSync(outputPath, JSON.stringify(updatedData, null, 2));

console.log(`✅ Updated data has been written to to ${outputPath}`);
