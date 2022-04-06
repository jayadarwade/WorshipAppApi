const express = require("express");
const route = express.Router();
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const packageCategoryController = require("../controller/categoryPackageController");
const path = require("path");
var storages = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storages });

const storage = new Storage({
  projectId: "worship-first",
  keyFilename:
    "../WorshipFirstBackEnd/worship-first-firebase-adminsdk-vcyhq-642e473ed6.json",
});
const bucketName = "gs://worship-first.appspot.com/";
route.post("/add", upload.single("image"), packageCategoryController.add);

route.post("/update", upload.single("image"), packageCategoryController.update);

route.get("/view", packageCategoryController.view);

route.delete("/delete/:id",packageCategoryController.delete)

module.exports=route;