const express = require("express");
const route = express.Router();
const priestController = require("../controller/priestController.js");
const multer = require("multer");

var storages = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storages });

route.post(
  "/priest_register",
  upload.single("image"),
  priestController.priestRegistration
);

route.post("/priest_login", priestController.priestLogin);

route.post(
  "/priest_updateprofile",
  upload.single("image"),
  priestController.priestUpdateprofile
);

route.post("/reset-password/:id/:token", priestController.priestPasswordReset);

route.get("/priest-view", priestController.view);

route.post("/priest-delete/:id", priestController.delete);

module.exports = route;