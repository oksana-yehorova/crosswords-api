const mongoose = require('mongoose');

const puzzleSchema = new mongoose.Schema({
    puzzleData: mongoose.Schema.Types.Mixed,
    clueDiary: mongoose.Schema.Types.Mixed,
    totalClues: Number,
    deadCells: Number
}, { timestamps: true });

const Puzzle = mongoose.model('Puzzle', puzzleSchema);

module.exports = Puzzle;