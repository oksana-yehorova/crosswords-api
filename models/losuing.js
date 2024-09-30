// models/Losuing.js
const mongoose = require('mongoose');

const losuingSchema = new mongoose.Schema({
  Aasseite: String
});

const Losuing = mongoose.model('Losuing', losuingSchema);

module.exports = Losuing;
