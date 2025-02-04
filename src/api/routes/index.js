const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const countryRoutes = require("./countryRoutes");

const routes = [
  { path: "/users", route: userRoutes },
  { path: "/countries", route: countryRoutes },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
