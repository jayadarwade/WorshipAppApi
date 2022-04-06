const mongoose = require("mongoose");
const schema = mongoose.Schema;
const cartSchema = new mongoose.Schema({
  userId: schema.Types.ObjectId,
  productList: [{
    type: schema.Types.ObjectId,
    ref: "products",
  }],
  packageList: [{
    type: schema.Types.ObjectId,
    ref: "packages",
  }],
});
module.exports = mongoose.model("carts", cartSchema);
