const colors = require("colors");
const {
  fillRecordOnGrid,
  ORIENTATION_ENUM,
  finalizePuzzle,
} = require('../../puzzleGenActionsForPuzzleJinnie');

const generateTemplate = async (puzzleState) => {
  if (!await fillRecordOnGrid(puzzleState, 4, 0, 0, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 1, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 6, 2, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 3, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 4, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 6, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 7, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 6, 9, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 11, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;

  if (!await fillRecordOnGrid(puzzleState, 6, 4, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 11, 1, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;

  if (!await fillRecordOnGrid(puzzleState, 6, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 7, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 3, 0, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 4, 3, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 5, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 8, 10, 3, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;

  if (!await fillRecordOnGrid(puzzleState, 7, 7, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 8, 4, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 7, 0, 5, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 1, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 6, 3, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 2, 5, 5, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 8, 5, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 5, 5, 6, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 6, 6, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 5, 0, 7, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 2, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 4, 7, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 8, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 9, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 11, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;

  if (!await fillRecordOnGrid(puzzleState, 5, 0, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 6, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 7, 4, 9, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 4, 0, 10, ORIENTATION_ENUM.ROW, 'LEFT_DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 1, 10, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 6, 10, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 3, 0, 11, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 4, 11, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 8, 11, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  const payload = await finalizePuzzle(puzzleState);
  return payload;
}

module.exports = {
  generateTemplate

}