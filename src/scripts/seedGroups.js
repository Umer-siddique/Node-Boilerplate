const seedData = require("./seedData"); // Path to the reusable seeding function
const Group = require("../domain/entities/Group"); // Path to model
const groupsData = require("../data/groups.json"); // Path to JSON data

seedData(Group, groupsData);
