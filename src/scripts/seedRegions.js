const seedData = require("./seedData"); // Path to the reusable seeding function
const Region = require("../domain/entities/Region"); // Path to model
const transformedRegions = require("../data/transformedRegions.json"); // Path to JSON data

seedData(Region, transformedRegions);
