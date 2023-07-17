const mongoose = require("mongoose");

// Page Schema

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
