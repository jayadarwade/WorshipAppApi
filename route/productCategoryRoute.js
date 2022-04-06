const express = require("express");
const router = express.Router();
const {Storage} = require("@google-cloud/storage");
const multer = require("multer");
const productCategoryModel = require("../model/productCategoryModel");
const path = require("path");
var storages = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storages });

const storage = new Storage({
    projectId : "worship-first",
    keyFilename : "../WorshipFirstBackEnd/worship-first-firebase-adminsdk-vcyhq-642e473ed6.json"
});
const bucketName = "gs://worship-first.appspot.com/";
router.post("/add",upload.single("image"),(request,response)=>{
    productCategoryModel.create({
        name : request.body.name,
        image : "https://firebasestorage.googleapis.com/v0/b/worship-first.appspot.com/o/"+request.file.filename+"?alt=media&token=hello"
    }).then(result=>{
        uploadFile(path.join(__dirname, "../", "public/images/") + request.file.filename);
        return response.status(201).json(result);
    }).catch(err=>{
        return response.status(500).json(err);
    });
});

const uploadFile = async(filename)=>{
    storage.bucket(bucketName).upload(filename,{
        gzip:true,
        metadata : {
            metadata : {
                firebaseStorageDownloadTokens : "hello"
            }
        }
    });
}
module.exports = router;