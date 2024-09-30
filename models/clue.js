const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    text: String,
    length: Number
});

const clueSchema = new mongoose.Schema({
    question: String,
    answers: [answerSchema]
});



const Clue = mongoose.model('Clue', clueSchema);

module.exports = Clue;