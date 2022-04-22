const express = require("express");
const route = express.Router();
const cartController = require("../controller/cartController");

route.post("/add", cartController.add);

route.get("/view", cartController.view);

route.get("/view/:id", cartController.viewone);

route.delete("/delete/:id", cartController.deletecart);

route.delete("/delete-product/:id/:productid", cartController.deleteOneProduct);

module.exports = route;