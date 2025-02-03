const http = require("http");
const dotenv = require("dotenv");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Configure .env
dotenv.config({ path: "../.env" });

// Require App
const app = require("./app");

// Create an HTTP Server
const server = http.createServer(app);

// DB Connection
const connectDB = require("./infrastructure/database/mongoDB");
const config = require("./config/env/develoment");
connectDB();

// Get PORT from ENV or default
const runningEnvironment = config.node_env;
const PORT = config.port || 8000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT} in ${runningEnvironment} mode`);
});

// Handle Unhandled Rejections and SIGTERM
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
