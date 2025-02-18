const seedData = require("./seedData"); // Path to the reusable seeding function
const Country = require("../domain/entities/Country"); // Path to model
const countriesData = require("../data/countries.json"); // Path to JSON data

seedData(Country, countriesData);
