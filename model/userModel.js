const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
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
  },
  image: {
    type: String,
  },
  mobile: {
    type: String,
    // unique: true,
  },
  otp : {
    type : String,
  }
});
module.exports = mongoose.model("users", userSchema);