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
      const stream = require("stream");
      await new Promise((resolve, reject) => {
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
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // Use the first sheet
      const sheet = workbook.Sheets[sheetName];
      regions.push(...XLSX.utils.sheet_to_json(sheet));
    } else {
      throw new Error(
        "Unsupported file type. Only CSV and Excel files are allowed."
      );
    }

    // Transform and save/update each region
    const savedRegions = [];
    for (const region of regions) {
      try {
        const transformedRegion = await this.transformRegionData(user, region);

        // Check if region already exists by name or region code
        const existingRegion = await regionRepository.findByName(
          transformedRegion.name
        );

        let savedRegion;
        if (existingRegion) {
          // Update existing region
          savedRegion = await regionRepository.update(
            existingRegion._id,
            transformedRegion
          );
        } else {
          // Create new region
          savedRegion = await regionRepository.create(transformedRegion);
        }

        savedRegions.push(savedRegion);
      } catch (error) {
        console.error(`Error processing region: ${region.Name}`, error);
      }
    }

    return savedRegions;
  }

  // Helper function to transform region data
  static async transformRegionData(user, region) {
    // Resolve parent region (if provided)

    console.log("Region", region);

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
      name: region["Name"]?.trim(),
      regionCode: region["Code"]?.toString()?.trim(),
      parent,
      status: Boolean(region["Active"]),
      regionType: region["Type"]?.trim(),
      type,
      countries,
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
