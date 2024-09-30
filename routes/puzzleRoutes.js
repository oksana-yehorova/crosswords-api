const express = require('express');
const router = express.Router();
const puzzleController = require('../controllers/puzzleController');

router.post('/assignPuzzle', puzzleController.assignPuzzle);
router.post('/assignPuzzleById', puzzleController.assignPuzzleById);
router.post('/adjacentPuzzle', puzzleController.getPuzzleByDateDirection );
router.post('/puzzleByDate', puzzleController.getPuzzleDataAgainstDate);
router.get('/todaysPuzzle',puzzleController.getTodaysOrMostRecentPuzzle);
router.post('/', puzzleController.createPuzzle);
router.get('/', puzzleController.getAllPuzzles);
router.get('/:id', puzzleController.getPuzzle);
router.patch('/:id', puzzleController.updatePuzzle);
router.delete('/:id', puzzleController.deletePuzzle);


module.exports = router;
