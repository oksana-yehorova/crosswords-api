const colors = require("colors");
const {
  fillRecordOnGrid,
  ORIENTATION_ENUM,
  finalizePuzzle,
} = require('../../puzzleGenActionsForPuzzleJinnie');

const generateTemplate = async (puzzleState) => {
  let tmpPuzzleState = JSON.parse(JSON.stringify(puzzleState));
  let blockGenerated = false;
  let attempts;
  const attemptsLimit = 75;

  // top left
  while (!blockGenerated) {
    tmpPuzzleState = JSON.parse(JSON.stringify(puzzleState));

    if (!await fillRecordOnGrid(tmpPuzzleState, 7, 0, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 2, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 3, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 0, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 7, 0, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 7, 0, 5, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) continue;

    blockGenerated = await fillRecordOnGrid(tmpPuzzleState, 6, 4, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT');
  }
  puzzleState = JSON.parse(JSON.stringify(tmpPuzzleState))
  blockGenerated = false;
  attempts = 0;

  // top right
  while (!blockGenerated) {
    attempts++;
    if (attempts >= attemptsLimit) {
      return false;
    }

    tmpPuzzleState = JSON.parse(JSON.stringify(puzzleState));

    if (!await fillRecordOnGrid(tmpPuzzleState, 9, 4, 2, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 3, 5, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 0, 7, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 0, 10, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 2, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 0, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 1, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 3, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 0, 11, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 5, 8, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;

    blockGenerated = await fillRecordOnGrid(tmpPuzzleState, 5, 2, 10, ORIENTATION_ENUM.COLUMN, 'DOWN');
  }
  puzzleState = JSON.parse(JSON.stringify(tmpPuzzleState));
  blockGenerated = false;
  attempts = 0;

  // bottom right
  while (!blockGenerated) {
    attempts++;
    if (attempts >= attemptsLimit) {
      return false;
    }

    tmpPuzzleState = JSON.parse(JSON.stringify(puzzleState));

    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 6, 3, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 5, 7, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 2, 7, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 2, 8, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 5, 6, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;

    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 11, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 8, 10, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 9, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 8, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 10, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 6, 9, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 6, 11, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;

    blockGenerated = await fillRecordOnGrid(tmpPuzzleState, 3, 7, 8, ORIENTATION_ENUM.ROW, 'RIGHT');
  }
  puzzleState = JSON.parse(JSON.stringify(tmpPuzzleState));
  blockGenerated = false;
  attempts = 0;

  // bottom left
  while (!blockGenerated) {
    attempts++;
    if (attempts >= attemptsLimit) {
      return false;
    }

    tmpPuzzleState = JSON.parse(JSON.stringify(puzzleState));

    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 11, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 8, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 10, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 8, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 7, 8, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 6, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 7, 4, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;

    blockGenerated = await fillRecordOnGrid(tmpPuzzleState, 4, 6, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT');
  }
  puzzleState = JSON.parse(JSON.stringify(tmpPuzzleState));

  const payload = await finalizePuzzle(puzzleState);
  return payload;
}

module.exports = {
  generateTemplate

}