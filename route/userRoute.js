const express = require("express");
const route = express.Router();
const userController = require('../controller/userController.js');
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");

var storages = multer.diskStorage({
    destination: "public/images",
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

var upload = multer({ storage: storages });

route.post('/register', upload.single("image"), userController.userRegistration)

route.post('/login', userController.userLogin)

route.post('/send-reset-password-email', userController.sendUserPasswordResetEmail)

route.post('/reset-password/:id/:token', userController.userPasswordReset)

route.post("/updateprofile", upload.single("image"), userController.updateprofile);

// route.post('/changepassword',userController.changeUserPassword)

route.get('/view',userController.view)


module.exports = route;