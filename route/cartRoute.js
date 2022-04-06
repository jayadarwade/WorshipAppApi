const express = require("express");
const route = express.Router();
const cartController = require("../controller/cartController")
route.post("/addProductr",cartController.add);

route.post("/addPackage",cartController.addPackage)

module.exports = route;