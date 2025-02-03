const mongoose = require("mongoose");
const { logEvents } = require("../../core/logging/logger");
const config = require("../../config/env/develoment");

const MONGO_URI =
  config.node_env === "development"
    ? config.db.mongo_local_uri
    : config.db.mongo_uri;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connected sucessfully!");
  } catch (err) {
    console.log("Db connection error💥", err);
    logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      "mongoErrLog.log"
    );
    process.exit(1);
  }
};

module.exports = connectDB;
