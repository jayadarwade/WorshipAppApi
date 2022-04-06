const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  categoryId:{
    type: Schema.Types.ObjectId,
    ref: "packagecategories",
   }
});
module.exports = mongoose.model("packages", packageSchema);