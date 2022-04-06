const mongoose = require("mongoose");
const priestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("priestcategoies", priestSchema);