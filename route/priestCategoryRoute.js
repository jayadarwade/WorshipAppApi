const express = require("express");
const route = express.Router();
const priestController = require("../controller/priestCategoryController");
const multer = require("multer");

var storages = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storages });

route.post("/add", upload.single("image"), priestController.add);

route.get("/view", priestController.view);

route.delete("/delete/:id", priestController.delete);

route.post("/update", upload.single("image"), priestController.update);

module.exports = route;
