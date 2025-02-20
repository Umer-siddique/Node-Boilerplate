const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "data/InstrumentsCategories"); // Centralized directory path

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
const lcInstrumentsCategories = readJsonFile(
  path.join(dataDir, "lcInstrumentsCategories.json")
);
const lcInstruments = readJsonFile(path.join(dataDir, "lcInstruments.json"));
const lcCategories = readJsonFile(path.join(dataDir, "lcCategories.json"));

// Create mappings for quick lookup
const instrumentMap = new Map(
  lcInstruments.map((item) => [item._id.$oid, item.instrumentDescription])
);
const categoryMap = new Map(
  lcCategories.map((item) => [item._id.$oid, item.categoryDescription])
);

// Update lcInstrumentsCategories with instrumentName and categoryName
lcInstrumentsCategories.forEach((entry) => {
  if (instrumentMap.has(entry.instrumentId.$oid)) {
    entry.instrumentName = instrumentMap.get(entry.instrumentId.$oid);
  }
  if (categoryMap.has(entry.categoryId.$oid)) {
    entry.categoryName = categoryMap.get(entry.categoryId.$oid);
  }
});

// Save the updated legacarta.categories.json
const outputPath = path.join(dataDir, "updated_lcInstrumentsCategories.json");
fs.writeFileSync(outputPath, JSON.stringify(lcInstrumentsCategories, null, 2));

console.log(
  "Matching complete. Updated file saved as updated_lcInstrumentsCategories.json"
);
