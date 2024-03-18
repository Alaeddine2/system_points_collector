const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  creating_date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
});

module.exports = mongoose.model("m_categories", schema);