const mongoose = require("mongoose");
const Counter = require("./domain/entities/Counter");

async function initCounter() {
  await mongoose.connect(
    "mongodb+srv://dev:BrfJuo8Ap419WoTU@cluster0.q6b1d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );

  // Initialize counter for Instruments to 618
  await Counter.findOneAndUpdate(
    { model: "Instrument" },
    { $set: { count: 618 } }, // Set the counter to 618
    { upsert: true } // Create if it doesn't exist
  );

  console.log("Counter initialized!");
  mongoose.disconnect();
}

initCounter();
