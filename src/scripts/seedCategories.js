const seedData = require("./seedData"); // Path to the reusable seeding function
const Category = require("../domain/entities/Category"); // Path to model
const categoriesData = require("../data/categories.json"); // Path to JSON data

seedData(Category, categoriesData);
