const colors = require("colors");
const {
  fillRecordOnGrid,
  ORIENTATION_ENUM,
  finalizePuzzle,
} = require('../../puzzleGenActionsForPuzzleJinnie');

const generateTemplate = async (puzzleState) => {
  if (!await fillRecordOnGrid(puzzleState, 7, 0, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 2, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 3, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 6, 4, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 6, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 7, 8, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 10, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 6, 11, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;

  if (!await fillRecordOnGrid(puzzleState, 7, 0, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 8, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 5, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 9, 4, 2, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 6, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 5, 0, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 5, 6, 3, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 8, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 4, 7, 4, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 7, 0, 5, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 2, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 3, 5, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 2, 7, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 2, 8, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 6, 10, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;

  if (!await fillRecordOnGrid(puzzleState, 6, 5, 6, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 5, 0, 7, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 1, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 3, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 5, 7, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 9, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 4, 11, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;

  if (!await fillRecordOnGrid(puzzleState, 4, 0, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 5, 8, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 7, 8, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
  if (!await fillRecordOnGrid(puzzleState, 3, 8, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 5, 6, 9, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;

  if (!await fillRecordOnGrid(puzzleState, 6, 0, 10, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;
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