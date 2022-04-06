const mongoose = require("mongoose");
const PackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("packagecategories", PackageSchema);