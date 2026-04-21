// models/Lead.js
const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  project: String,
  source: String,   // enquiry / contact / newsletter
  formType: String, // same as source
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Lead", leadSchema);