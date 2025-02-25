const csv = require("csv-parser");
const fs = require("fs");
const XLSX = require("xlsx");
const RegionRepository = require("../repositories/regionRepository");
const CountryRepository = require("../repositories/countryRepository");

const regionRepository = new RegionRepository();
const countryRepository = new CountryRepository();

class RegionService {
  static async importRegionsFromFile(filePath) {
    const regions = [];

    // Check the file extension
    const fileExtension = filePath.split(".").pop().toLowerCase();

    if (fileExtension === "csv") {
      // Parse CSV file
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (row) => regions.push(row))
          .on("end", resolve)
          .on("error", reject);
      });
    } else if (fileExtension === "xlsx") {
      // Parse Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Use the first sheet
      const sheet = workbook.Sheets[sheetName];
      regions.push(...XLSX.utils.sheet_to_json(sheet));
    } else {
      throw new Error(
        "Unsupported file type. Only CSV and Excel files are allowed."
      );
    }

    // Transform and save each region
    const savedRegions = [];
    for (const region of regions) {
      try {
        const transformedRegion = await this.transformRegionData(region);

        // Save the region
        const savedRegion = await regionRepository.create(transformedRegion);
        savedRegions.push(savedRegion);
      } catch (error) {
        console.error(`Error processing region: ${region.name}`, error);
      }
    }

    return savedRegions;
  }

  // Helper function to transform region data
  static async transformRegionData(region) {
    // Resolve parent region (if provided)
    let parent = null;
    if (region["Parent"]) {
      const parentRegion = await regionRepository.findByName(region["Parent"]);
      parent = parentRegion ? parentRegion._id : null;
    }

    // Determine the type
    const type = parent ? "sub-region" : "region";

    // Resolve countries (only for sub-regions)
    let countries = [];
    if (parent && region["Countries"]) {
      const countryNames = region["Countries"].split(",");
      countries = await Promise.all(
        countryNames.map(async (name) => {
          const country = await countryRepository.findByName(name.trim());
          return country ? country._id : null;
        })
      );
      countries = countries.filter((id) => id !== null); // Filter out null values
    }

    return {
      name: region["Name"],
      regionCode: region["Region Code"],
      parent, // Resolved ObjectId or null
      status: region["Active"].toString() === "Yes", // Convert to boolean
      regionType: region["Region Type"],
      type, // Set type based on parent
      countries, // Resolved array of ObjectId or empty array
    };
  }

  static async addRegion(regionData) {
    return await regionRepository.add(regionData);
  }

  static async getAllRegion(queryStr) {
    return await regionRepository.findAll(queryStr);
  }

  static async getParentRegions() {
    return await regionRepository.findRegions();
  }
  static async getChildRegions() {
    return await regionRepository.findSubRegions();
  }

  static async getRegionById(regionId) {
    return await regionRepository.findById(regionId);
  }
  static async updateRegion(regionId, updateData) {
    return await regionRepository.update(regionId, updateData);
  }
  static async deleteRegion(regionId) {
    return await regionRepository.delete(regionId);
  }
}

module.exports = RegionService;
