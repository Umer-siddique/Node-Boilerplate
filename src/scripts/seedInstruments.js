const seedData = require("./seedData"); // Path to the reusable seeding function
const Instrument = require("../domain/entities/Instrument"); // Path to your model
const instrumentsData = require("../data/lcInstruments_transformed.json"); // Path to your JSON data

seedData(Instrument, instrumentsData);
