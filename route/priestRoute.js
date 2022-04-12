const express = require("express");
const route = express.Router();
const priestController = require("../controller/priestController.js");
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");

var storages = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storages });

const storage = new Storage({
  projectId: "worship-first",
  keyFilename: "worship-first-firebase-adminsdk-vcyhq-642e473ed6.json",
});

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