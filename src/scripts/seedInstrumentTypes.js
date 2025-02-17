const seedData = require("./seedData"); // Path to the reusable seeding function
const InstrumentType = require("../domain/entities/InstrumentType"); // Path to your model
const instrumentTypesData = require("../data/instruments_types.json"); // Path to your JSON data

seedData(InstrumentType, instrumentTypesData);
