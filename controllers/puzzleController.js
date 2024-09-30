const Puzzle = require('../models/puzzle');

exports.assignPuzzleById = async (req, res) => {
    const { date, puzzleId } = req.body; // Assume both date and puzzle ID are provided in the request body
  
    if (!date || !puzzleId) {
      return res.status(400).send('Both date and puzzle ID are required');
    }
  
    // Check if a puzzle for the given date already exists
    const existingPuzzle = await Puzzle.findOne({ 'puzzleData.date': date });
    if (existingPuzzle) {
      return res.status(409).json({
        message: 'A puzzle for this date already exists',
        puzzle: existingPuzzle,
      });
    }
  
    // Attempt to find the puzzle by ID and update it with the given date
    const updated = await Puzzle.findByIdAndUpdate(
      puzzleId, // Find by puzzle ID
      { 'puzzleData.date': date, 'puzzleData.title': `Puzzle for ${date}` }, // Assign date and title
      { new: true } // Return the updated document
    );
  
    if (updated) {
      res.json({
        message: 'Puzzle assigned to date successfully',
        puzzle: updated,
      });
    } else {
      res.status(404).send('No puzzle found with the provided ID');
    }
};


exports.assignPuzzle = async (req, res) => {
    const { date } = req.body; // Assume the date is provided in the request body
  
    if (!date) {
      return res.status(400).send('Date is required');
    }
  
    // Check if a puzzle for the given date already exists
    const existingPuzzle = await Puzzle.findOne({ 'puzzleData.date': date });
    if (existingPuzzle) {
      return res.json({
        message: 'A puzzle for this date already exists',
        puzzle: existingPuzzle,
      });
    }
  
    const title = `Puzzle for ${date}`;
  
    // Find the first unassigned puzzle and update it with the given date and title
    const updated = await Puzzle.findOneAndUpdate(
      { 'puzzleData.date': null }, // Find an unassigned puzzle
      { 'puzzleData.date': date, 'puzzleData.title': title }, // Assign date and title
      { new: true } // Return the updated document
    );
  
    if (updated) {
      res.json({
        message: 'Puzzle assigned to date successfully',
        puzzle: updated,
      });
    } else {
      res.status(404).send('No unassigned puzzles available for assignment');
    }
};

// POST: Create a new puzzle
exports.createPuzzle = async (req, res) => {
    try {
        const newPuzzle = new Puzzle(req.body);
        await newPuzzle.save();
        res.status(201).send(newPuzzle);
    } catch (error) {
        res.status(400).send(error);
    }
};

// GET: Retrieve all puzzles
exports.getAllPuzzles = async (req, res) => {
    try {
        const puzzles = await Puzzle.find({});
        res.status(200).send(puzzles);
    } catch (error) {
        res.status(500).send(error);
    }
};

// GET: Retrieve a single puzzle by id
exports.getPuzzle = async (req, res) => {
    try {
        const puzzle = await Puzzle.findById(req.params.id);
        if (!puzzle) {
            return res.status(404).send();
        }
        res.send(puzzle);
    } catch (error) {
        res.status(500).send(error);
    }
};

// PATCH: Update a puzzle
exports.updatePuzzle = async (req, res) => {
    try {
        const puzzle = await Puzzle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!puzzle) {
            return res.status(404).send();
        }
        res.send(puzzle);
    } catch (error) {
        res.status(400).send(error);
    }
};

// DELETE: Delete a puzzle
exports.deletePuzzle = async (req, res) => {
    try {
        const puzzle = await Puzzle.findByIdAndDelete(req.params.id);
        if (!puzzle) {
            return res.status(404).send();
        }
        res.send(puzzle);
    } catch (error) {
        res.status(500).send(error);
    }
};


exports.getTodaysOrMostRecentPuzzle = async (req, res) => {
    const today = new Date();
    const dateString = today.toISOString().substring(0, 10);

    try {
        let puzzle = await Puzzle.findOne({ 'puzzleData.date': dateString });

        if (!puzzle) {
            puzzle = await Puzzle.findOne({ 'puzzleData.date': { $ne: null } })
                                .sort({ 'puzzleData.date': -1 });
        }

        if (!puzzle) {
            return res.status(404).send('No puzzles found');
        }

        // Check for next puzzle
        const nextPuzzle = await Puzzle.findOne({ 'puzzleData.date': { $gt: puzzle.puzzleData.date } });
        const isNextPuzzleAvailable = !!nextPuzzle;

        // Check for previous puzzle
        const previousPuzzle = await Puzzle.findOne({ 'puzzleData.date': { $lt: puzzle.puzzleData.date } });
        const isPreviousPuzzleAvailable = !!previousPuzzle;

        res.json({
            puzzle: puzzle,
            isNextPuzzleAvailable,
            isPreviousPuzzleAvailable
        });
    } catch (error) {
        res.status(500).send('An error occurred while fetching the puzzle');
    }
};


exports.getPuzzleDataAgainstDate = async (req, res) => {
    const { date } = req.body; // Get the date from the POST request body

    if (!date) {
        return res.status(400).send('Date parameter is required.');
    }

    try {
        const puzzle = await Puzzle.findOne({ 'puzzleData.date': date });

        if (!puzzle) {
            return res.status(404).send('No puzzle found for the given date');
        }

        // Check for the availability of the next puzzle
        const nextPuzzle = await Puzzle.findOne({ 'puzzleData.date': { $gt: date } });
        const isNextPuzzleAvailable = !!nextPuzzle;

        // Check for the availability of the previous puzzle
        const previousPuzzle = await Puzzle.findOne({ 'puzzleData.date': { $lt: date } });
        const isPreviousPuzzleAvailable = !!previousPuzzle;

        res.json({
            puzzle: puzzle,
            isNextPuzzleAvailable,
            isPreviousPuzzleAvailable
        });
    } catch (error) {
        console.error('Error finding puzzle:', error);
        res.status(500).send('Internal Server Error');
    }
};



exports.getPuzzleByDateDirection = async (req, res) => {
    const { date, direction } = req.body;

    if (!date || !direction) {
        return res.status(400).send('Both date and direction are required');
    }

    let query = {};
    let sort = {};

    if (direction === "NEXT") {
        query = { 'puzzleData.date': { $gt: date } };
        sort = { 'puzzleData.date': 1 }; // Ascending order
    } else if (direction === "PREVIOUS") {
        query = { 'puzzleData.date': { $lt: date } };
        sort = { 'puzzleData.date': -1 }; // Descending order
    } else {
        return res.status(400).send('Invalid direction. Must be "PREVIOUS" or "NEXT"');
    }

    try {
        const puzzle = await Puzzle.findOne(query).sort(sort);
        if (!puzzle) {
            return res.status(404).send('No puzzles found in the specified direction');
        }

        // Check for next puzzle
        const nextPuzzle = await Puzzle.findOne({ 'puzzleData.date': { $gt: puzzle.puzzleData.date } });
        const isNextPuzzleAvailable = !!nextPuzzle;

        // Check for previous puzzle
        const previousPuzzle = await Puzzle.findOne({ 'puzzleData.date': { $lt: puzzle.puzzleData.date } });
        const isPreviousPuzzleAvailable = !!previousPuzzle;

        res.json({
            puzzle: puzzle,
            isNextPuzzleAvailable,
            isPreviousPuzzleAvailable
        });
    } catch (error) {
        console.error('Error finding puzzle:', error);
        res.status(500).send('Error finding puzzle');
    }
};

