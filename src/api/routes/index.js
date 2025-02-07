const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const countryRoutes = require("./countryRoutes");
const regionRoutes = require("./regionRoutes");
const groupRoutes = require("./groupRoutes");
const instrumentTypeRoutes = require("./instrumentTypeRoutes");

const routes = [
  { path: "/users", route: userRoutes },
  { path: "/countries", route: countryRoutes },
  { path: "/regions", route: regionRoutes },
  { path: "/groups", route: groupRoutes },
  { path: "/instrument-types", route: instrumentTypeRoutes },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
