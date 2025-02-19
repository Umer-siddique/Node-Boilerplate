const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "data"); // Centralized directory path

// Function to determine regionType based on regionId
// const getRegionType = (regionId) => {
//   if (regionId >= 1 && regionId <= 29) {
//     return "Geographical region and composition";
//   } else if (regionId >= 30 && regionId <= 34) {
//     return "Developing levels";
//   } else if (regionId >= 35 && regionId <= 47) {
//     return "Developed and developing regions";
//   } else {
//     return "Least developed countries";
//   }
// };

// Helper function to safely read JSON files
const readJsonFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    process.exit(1); // Exit if file read fails
  }
};

// Load JSON files safely
const regions = readJsonFile(
  path.join(dataDir, "updated_legacarta1.regions.json")
);

// // Transform the data
// const transformedRegions = regions.map((region) => ({
//   regionId: region.regionId.$numberInt,
//   name: region.regionDescription,
//   regionCode: region.regionCode,
//   status: region.active.$numberInt === "1",
//   parentId: region.parentId ? region.parentId.$numberInt : null,
//   parent: null,
//   type: "region",
//   regionType: getRegionType(region.regionId.$numberInt),
// }));

// Create a map to store regionId to _id.$oid mapping
// const regionIdToOidMap = new Map();

// First pass: Populate the map with regionId and corresponding _id.$oid
regions.forEach((region) => {
  if (region.parent) region.type = "sub-region";
  if (region.regionId || region.parentId) {
    delete region.regionId;
    delete region.parentId;
  }
});

// Second pass: Update the parent field where parentId matches regionId
// regions.forEach((region) => {
//   if (region.parentId) {
//     const parentOid = regionIdToOidMap.get(region.parentId);
//     if (parentOid) {
//       region.parent = parentOid;
//     }
//   }
// });

// Save the updated legacarta.categories.json
const outputPath = path.join(dataDir, "updated_legacarta2.regions.json");
fs.writeFileSync(outputPath, JSON.stringify(regions, null, 2));

console.log(
  `✅ console.log('Transformation complete. Data saved to ${outputPath}`
);
