const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");

router.post("/place-order",orderController.place);

router.post("/create",orderController.create);

router.post("/order-status",orderController.orderStatus);

router.get("/view",orderController.view);

router.get("/view-one/:userId",orderController.viewOne);
module.exports = router;