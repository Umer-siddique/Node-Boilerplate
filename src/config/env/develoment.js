require("dotenv").config();

module.exports = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 8000,
  db: {
    mongo_local_uri: process.env.LOCAL_MONGO_URI,
    mongo_uri: process.env.LOCAL_MONGO_URI,
    redis_host: process.env.REDIS_HOST,
    redis_port: process.env.REDIS_PORT,
    redis_password: process.env.REDIS_PASSWORD, // Optional, if using Redis with password
  },
  jwtSecret: process.env.JWT_SECRET,
};
