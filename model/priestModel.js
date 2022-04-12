const mongoose = require("mongoose");
const schema = mongoose.Schema;
const priestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  password_confirmation: {
    type: String,
  },

  mobile: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    required: true,
  },
  priestCategory: [
    {
      type: schema.Types.ObjectId,
      ref: "priestcategories",
    },
  ],
  about: {
    type: String,
  },
});

module.exports = mongoose.model("priests", priestSchema);
