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
const legacartaRegions = readJsonFile(
  path.join(dataDir, "legacarta.regions.json")
);
const updatedRegionsWithCountryIDs = readJsonFile(
  path.join(dataDir, "updatedRegionsWithCountryIDs.json")
);

// // Create a map for countryId to countryName
// const countryMap = {};
// countries.forEach((country) => {
//   countryMap[country._id.$oid] = country.countryName;
// });

// // Group countries by regionId
// const regionMap = {};

// regionsCountries.forEach((entry) => {
//   const regionId = entry.regionId.$oid;
//   const countryId = entry.countryId.$oid;

//   if (!regionMap[regionId]) {
//     regionMap[regionId] = [];
//   }

//   if (countryMap[countryId]) {
//     regionMap[regionId].push(countryMap[countryId]);
//   }
// });

// // Convert to an array of region objects
// const regionArray = Object.keys(regionMap).map((regionId) => ({
//   regionId,
//   countries: regionMap[regionId],
// }));

// Create a map for quick lookup of region descriptions by _id.$oid
// const regionDescriptionMap = new Map();
// lcRegions.forEach((region) => {
//   regionDescriptionMap.set(region._id.$oid, region.regionDescription);
// });

// // Add regionName to regionsWithCountries based on matching regionId
// regionsWithCountries.forEach((regionWithCountries) => {
//   const regionDescription = regionDescriptionMap.get(
//     regionWithCountries.regionId
//   );
//   if (regionDescription) {
//     regionWithCountries.regionName = regionDescription;
//   }
// });

// Create a map for quick lookup of countries by regionName
const regionCountriesMap = new Map();
updatedRegionsWithCountryIDs.forEach((region) => {
  regionCountriesMap.set(region.regionName, region.countries);
});

// Iterate through legacarta.regions.json and update the countries array
legacartaRegions.forEach((legacartaRegion) => {
  const countries = regionCountriesMap.get(legacartaRegion.name);
  if (countries) {
    legacartaRegion.countries = countries;
  } else {
    legacartaRegion.countries = []; // Keep the array empty if no match is found
  }
});

// Save the updated legacarta.categories.json
const outputPath = path.join(dataDir, "updatedLegacartaRegions.json");
fs.writeFileSync(outputPath, JSON.stringify(legacartaRegions, null, 2));

console.log(
  `✅ Updated legacarta.regions.json has been saved to ${outputPath}`
);
