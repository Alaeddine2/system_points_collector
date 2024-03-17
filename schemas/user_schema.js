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
  login: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  tel: {
    type: String
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    default: "user"
  },
  role_number: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: false
  },
  activeToken: String,
  activeExpires: Date,
});

module.exports = mongoose.model("m_user", schema);