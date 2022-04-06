const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const productCategoryRoute = require("./route/productCategoryRoute");
const packageCategoryRouter = require("./route/packageCategoryRoute")

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://mahak:root@cluster1.p5j5p.mongodb.net/worshipFirst?retryWrites=true&w=majority").then(()=>{
    console.log("connected");
}).catch(err=>{
    console.log("Failed + " + err);
});
app.use(express.static("./public"));
app.use('/packageCategory',packageCategoryRouter);
app.use("/product-category",productCategoryRoute);

app.listen(3000,()=>{
    console.log("Server is running on port " + 3000);
})
