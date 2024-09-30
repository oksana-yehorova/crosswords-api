// models/Tip.js
const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  tip: String
});

const Tip = mongoose.model('Tip', tipSchema);

module.exports = Tip;
