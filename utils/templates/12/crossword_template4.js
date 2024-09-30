const colors = require("colors");
const {
  fillRecordOnGrid,
  ORIENTATION_ENUM,
  finalizePuzzle,
} = require('../../puzzleGenActionsForPuzzleJinnie');

const generateTemplate = async (puzzleState) => {
  if (!await fillRecordOnGrid(puzzleState, 5, 0, 0, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 1, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 2, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 6, 3, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 5, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 7, 7, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 9, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 10, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;

  if (!await fillRecordOnGrid(puzzleState, 6, 5, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 6, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 7, 2, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 8, 9, 2, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 11, 2, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;

  if (!await fillRecordOnGrid(puzzleState, 4, 0, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 6, 5, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 3, 0, 4, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 4, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 6, 5, 4, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 5, 0, 5, ORIENTATION_ENUM.COLUMN, 'DOWN_RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 6, 1, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 2, 5, ORIENTATION_ENUM.COLUMN, 'DOWN_RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 6, 8, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 6, 10, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;

  if (!await fillRecordOnGrid(puzzleState, 6, 5, 6, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 6, 0, 7, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 2, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 3, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 5, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 6, 7, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 11, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;

  if (!await fillRecordOnGrid(puzzleState, 3, 6, 8, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 7, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 3, 0, 9, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 7, 4, 9, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 6, 0, 10, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 7, 10, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 3, 0, 11, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 4, 11, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 2, 9, 11, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  const payload = await finalizePuzzle(puzzleState);
  return payload;
}

module.exports = {
  generateTemplate

}