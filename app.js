const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());


const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://mahak:root@cluster1.p5j5p.mongodb.net/worshipFirst?retryWrites=true&w=majority").then(()=>{
    console.log("connected");
}).catch(err=>{
    console.log("Failed + " + err);
});

app.listen(3000,()=>{
    console.log("Server is running on port " + 3000);
})
