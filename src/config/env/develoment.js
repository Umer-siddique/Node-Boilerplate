require("dotenv").config();

module.exports = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 8000,
  db: {
    mongo_local_uri: process.env.LOCAL_MONGO_URI,
    mongo_uri: process.env.MONGO_URI,
    redis_host: process.env.REDIS_HOST,
    redis_port: process.env.REDIS_PORT,
    redis_password: process.env.REDIS_PASSWORD, // Optional, if using Redis with password
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    cookieExpiresIn: process.env.JWT_COOKIE_EXPIRES_IN,
  },
};
