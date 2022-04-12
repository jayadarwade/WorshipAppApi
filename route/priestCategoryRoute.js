const express = require("express");
const route = express.Router();
const priestController = require("../controller/priestCategoryController");
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
var upload = multer({ storage: storages });

route.post("/add", upload.single("image"), priestController.add);

route.get("/view", priestController.view);

route.delete("/delete/:id", priestController.delete);

route.post("/update/:id", upload.single("image"), priestController.update);

module.exports = route;
