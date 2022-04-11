const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    password_confirmation: {
      type: String,
    },
  });
  module.exports = mongoose.model("admins", adminSchema);