const redis = require("redis");
const logger = require("../../core/logging/logger");

const client = redis.createClient();

client.on("connect", () => {
  logger.info("Redis Connected");
});

client.on("error", (err) => {
  logger.error(`Redis Error: ${err.message}`);
});

module.exports = client;
