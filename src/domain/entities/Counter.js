const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  model: { type: String, required: true, unique: true }, // The model name (e.g., "Instrument")
  count: { type: Number, required: true, default: 0 }, // Auto-incrementing value
});

const Counter = mongoose.model("Counter", counterSchema);
module.exports = Counter;
