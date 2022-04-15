const express = require("express");
const route = express.Router();
const adminController = require("../controller/adminController.js");
const multer = require("multer");

var storages = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storages });

route.post(
  "/admin_register",
  upload.single("image"),
  adminController.adminRegistration
);

route.post("/admin_login", adminController.adminLogin);

route.post(
  "/admin-send-reset-password-email",
  adminController.sendUserPasswordResetEmail
);

route.post(
  "/admin-reset-password/:id/:token",
  adminController.adminPasswordReset
);

route.post(
  "/adminUpdateprofile",
  upload.single("image"),
  adminController.updateprofile
);

route.get("/view", adminController.view);

module.exports = route;
