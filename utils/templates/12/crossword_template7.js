const colors = require("colors");
const {
  fillRecordOnGrid,
  ORIENTATION_ENUM,
  finalizePuzzle,
} = require('../../puzzleGenActionsForPuzzleJinnie');

const generateTemplate = async (puzzleState) => {
  if (!await fillRecordOnGrid(puzzleState, 5, 0, 0, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 1, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 2, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 3, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 5, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 6, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 8, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 9, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 10, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 6, 11, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;

  if (!await fillRecordOnGrid(puzzleState, 6, 5, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 7, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 8, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 4, 0, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 6, 5, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 4, 0, 4, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 7, 1, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 7, 3, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 7, 5, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 6, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 2, 7, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 8, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 7, 10, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;

  if (!await fillRecordOnGrid(puzzleState, 7, 4, 5, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 7, 0, 6, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 2, 6, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 4, 6, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 2, 9, 6, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 4, 7, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 9, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 11, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;

  if (!await fillRecordOnGrid(puzzleState, 3, 0, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 7, 4, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 2, 4, 9, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 6, 9, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 4, 0, 10, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 2, 10, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 8, 10, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 5, 0, 11, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 6, 11, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;


  const payload = await finalizePuzzle(puzzleState);
  return payload;
}

module.exports = {
  generateTemplate

}