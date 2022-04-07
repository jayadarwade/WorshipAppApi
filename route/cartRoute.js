const express = require("express");
const route = express.Router();
const cartController = require("../controller/cartController")

// route.post("/addPackage",cartController.addPackage)

route.post("/add",cartController.add);

route.get("/view/:id",cartController.view);

route.delete("/delete/:id/:productid",cartController.deleteOneProduct);

route.delete("/delete/:id",cartController.deletecart);

module.exports = route;