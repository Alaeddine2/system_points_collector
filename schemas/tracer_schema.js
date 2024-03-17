const mongoose = require("mongoose");

const schema = new mongoose.Schema({

  creating_date: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: String,
    required: true
  },
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "m_user",
  },
  proffessional_id: {
    type: String,
    required: true
  },
  proffessional : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "m_user",
  },
  status: {
    type: String,
    default: "pending"
  },
  description: {
    type: String,
  },
  action: {
    type: Number,
  },
  points: {
    type: Number,
  },
  menuList: {
    type: Array,
  },
});

module.exports = mongoose.model("m_tracer", schema);