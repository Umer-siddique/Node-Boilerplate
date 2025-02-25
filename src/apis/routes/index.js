const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const countryRoutes = require("./countryRoutes");
const regionRoutes = require("./regionRoutes");
const groupRoutes = require("./groupRoutes");
const categoryRoutes = require("./categoryRoutes");
const instrumentRoutes = require("./instrumentRoutes");
const instrumentTypeRoutes = require("./instrumentTypeRoutes");
const activityLogRoutes = require("./activityLogRoutes");

const routes = [
  { path: "/users", route: userRoutes },
  { path: "/auth", route: authRoutes },
  { path: "/countries", route: countryRoutes },
  { path: "/regions", route: regionRoutes },
  { path: "/groups", route: groupRoutes },
  { path: "/categories", route: categoryRoutes },
  { path: "/instruments", route: instrumentRoutes },
  { path: "/instrument-types", route: instrumentTypeRoutes },
  { path: "/activity-logs", route: activityLogRoutes },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
