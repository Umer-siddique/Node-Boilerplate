const csv = require("csv-parser");
const stream = require("stream");
const XLSX = require("xlsx");
const RegionRepository = require("../repositories/regionRepository");
const CountryRepository = require("../repositories/countryRepository");

const regionRepository = new RegionRepository();
const countryRepository = new CountryRepository();

class RegionService {
  static async importRegionsFromFile(user, fileBuffer, fileType) {
    const regions = [];

    // Check the file type (MIME type)
    if (fileType === "text/csv") {
      // Parse CSV file from buffer
      await new Promise((resolve, reject) => {
        const stream = require("stream");
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);

        bufferStream
          .pipe(csv())
          .on("data", (row) => regions.push(row))
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
        const transformedRegion = await this.transformRegionData(user, region);

        // Validate required fields
        if (!transformedRegion.name || !transformedRegion.regionCode) {
          console.error(`Skipping region: Missing required fields`, region);
          continue; // Skip this region if required fields are missing
        }

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
  static async transformRegionData(user, region) {
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
      name: region["Name"]?.trim(), // Ensure name is trimmed and not null
      regionCode: region["Region Code"], // Ensure regionCode is trimmed and not null
      parent, // Resolved ObjectId or null
      status: region["Active"]?.toString() === "Yes", // Convert to boolean
      regionType: region["Region Type"]?.trim(), // Ensure regionType is trimmed and not null
      type, // Set type based on parent
      countries, // Resolved array of ObjectId or empty array
      user,
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
