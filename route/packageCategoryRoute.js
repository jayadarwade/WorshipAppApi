const express= require('express');
const route = express.Router();
const multer = require("multer");
const packageCategoryController = require("../controller/categoryPackageController");
var storage = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cd) {
    cd(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });
route.post(
  "/add",
  upload.single("image"),
  packageCategoryController.add
);

module.exports=route;