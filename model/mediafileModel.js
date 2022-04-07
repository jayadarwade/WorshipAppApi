const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mediafile = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  categoryid: {
    type: schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("mediafiles", mediafile);
