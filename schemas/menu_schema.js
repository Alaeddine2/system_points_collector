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
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    //required: true
  },
  imgUrl: {
    type: String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "m_categories",
    required: true
  },
  category_id: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
});

module.exports = mongoose.model("m_menu", schema);