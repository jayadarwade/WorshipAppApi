const express = require("express");
const app = express();
const cors = require("cors");
const body = require("body-parser")
app.use(cors());
const productCategoryRoute = require("./route/Category");
const mediafileCategoryRoute= require("./route/mediafileCategoryRoute");
const mediafileRouter = require("./route/mediafile");
const productRoute = require("./route/productRoute");
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://mahak:root@cluster1.p5j5p.mongodb.net/worshipFirst?retryWrites=true&w=majority").then(()=>{
    console.log("connected");
}).catch(err=>{
    console.log("Failed + " + err);
});
app.use(express.static("./public"));
app.use(body.urlencoded({ extended: true }));
app.use(body.json());
app.use("/product-category",productCategoryRoute);
app.use("/medialfile-category",mediafileCategoryRoute);
app.use("/mediafile",mediafileRouter);
app.use("/product",productRoute);

app.listen(3000,()=>{
    console.log("Server is running on port " + 3000);
});
