const mongoose = require("mongoose");

// Page Schema

const categorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
});

module.exports = mongoose.model("Category", categorySchema);
