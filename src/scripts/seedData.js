const mongoose = require("mongoose");
const connectDB = require("../infrastructure/database/mongoDB");

const seedData = async (model, data) => {
  try {
    // Connect to the database
    await connectDB();

    // Clear the collection to avoid duplicate entries
    await model.deleteMany({});

    // Insert the data into the collection
    const result = await model.insertMany(data);

    console.log(
      `${result.length} documents seeded successfully in ${model.modelName}.`
    );
  } catch (error) {
    console.error(`Error seeding data for ${model.modelName}:`, error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

module.exports = seedData;
