const express = require("express");
const route = express.Router();
const multer = require("multer");
const mediafileController = require("../controller/mediafileContrller");

var storages = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storages });

var upload = multer({ storage: storages });

route.post("/add", upload.single("image"), mediafileController.add);

route.get("/view", mediafileController.view);

route.get("/view-by-cat/:id",mediafileController.viewByCat);

route.delete("/delete/:id", mediafileController.delete);

route.post("/update", upload.single("image"), mediafileController.update);

route.get("/view-by-type/:type",mediafileController.viewByType);

module.exports = route;
