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
const instruments = readJsonFile(
  path.join(dataDir, "updated_test.instruments.json")
);

// Function to transform countryRatifications
function transformCountryRatifications(instruments) {
  return instruments.map((instrument) => {
    const countryRatificationsMap = {};

    // Group ratifications by countryName
    instrument.countryRatifications.forEach((ratification) => {
      const countryId = ratification.countryName.$oid;

      if (!countryRatificationsMap[countryId]) {
        countryRatificationsMap[countryId] = {
          countryName: { $oid: countryId },
          ratifications: [],
        };
      }

      countryRatificationsMap[countryId].ratifications.push({
        ratified: ratification.ratified,
        ratificationDate: ratification.ratificationDate,
        statusChangeDate: ratification.ratificationDate, // Assuming statusChangeDate is the same as ratificationDate
      });
    });

    // Convert the map back to an array
    instrument.countryRatifications = Object.values(countryRatificationsMap);
    return instrument;
  });
}

// Transform the data
const transformedData = transformCountryRatifications(instruments);

// Save the updated legacarta.categories.json
const outputPath = path.join(dataDir, "updated.testInstruments.json");
fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2));

console.log(
  `✅Country Ratificaitons transformed successfully! Output saved to: ${outputPath}`
);
