// const fs = require("fs");
// const path = require("path");

// // Load the JSON files
// const legacartaCategories = JSON.parse(
//   fs.readFileSync(
//     path.join(__dirname, "data", "legacarta.categories.json"),
//     "utf-8"
//   )
// );
// const updatedFilteredCategories = JSON.parse(
//   fs.readFileSync(
//     path.join(__dirname, "data", "updated_filtered_lcCategories.json"),
//     "utf-8"
//   )
// );

// // Create a mapping of name to _id from legacarta.categories.json
// const nameToIdMap = {};
// legacartaCategories.forEach((category) => {
//   nameToIdMap[category.name] = category._id.$oid;
// });

// // Update the parent field in legacarta.categories.json
// legacartaCategories.forEach((category) => {
//   const matchingCategory = updatedFilteredCategories.find(
//     (updatedCategory) => updatedCategory.name === category.name
//   );
//   if (matchingCategory && matchingCategory.parentName) {
//     const parentId = nameToIdMap[matchingCategory.parentName];
//     if (parentId) {
//       category.parent = parentId;
//     }
//   }
// });

// // Save the updated legacarta.categories.json
// fs.writeFileSync(
//   path.join(__dirname, "data", "updated_legacarta.categories.json"),
//   JSON.stringify(legacartaCategories, null, 2)
// );

// console.log("Parent fields updated successfully!");

const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "data"); // Centralized directory path

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
const legacartaCategories = readJsonFile(
  path.join(dataDir, "legacarta.categories.json")
);
const updatedFilteredCategories = readJsonFile(
  path.join(dataDir, "updated_filtered_lcCategories.json")
);

// Create a mapping of name to _id from legacarta.categories.json
const nameToIdMap = {};
legacartaCategories.forEach((category) => {
  if (category._id && category._id.$oid) {
    nameToIdMap[category.name] = category._id.$oid;
  } else {
    console.warn(`Skipping category with missing _id: ${category.name}`);
  }
});

// Update the parent field in legacartaCategories
legacartaCategories.forEach((category) => {
  const matchingCategory = updatedFilteredCategories.find(
    (updatedCategory) => updatedCategory.name === category.name
  );

  if (matchingCategory && matchingCategory.parentName) {
    const parentId = nameToIdMap[matchingCategory.parentName];

    if (parentId) {
      category.parent = parentId;
    } else {
      console.warn(
        `Parent category "${matchingCategory.parentName}" not found for "${category.name}"`
      );
    }
  }
});

// Save the updated legacarta.categories.json
const outputPath = path.join(dataDir, "updated_legacarta.categories.json");
fs.writeFileSync(outputPath, JSON.stringify(legacartaCategories, null, 2));

console.log(
  `✅ Parent fields updated successfully! Output saved to: ${outputPath}`
);
