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
  const attemptsLimit = 50;

  // top left
  while (!blockGenerated) {
    tmpPuzzleState = JSON.parse(JSON.stringify(puzzleState));

    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 0, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 3, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 0, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 0, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 2, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 5, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) continue;

    blockGenerated = await fillRecordOnGrid(tmpPuzzleState, 4, 0, 5, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN');
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

    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 0, 7, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 1, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 0, 9, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 0, 11, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 2, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 3, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 0, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 0, 10, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 4, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 2, 5, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;

    blockGenerated = await fillRecordOnGrid(tmpPuzzleState, 2, 5, 4, ORIENTATION_ENUM.ROW, 'RIGHT');
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

    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 5, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 4, 11, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 6, 8, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 7, 4, 9, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 11, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 9, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 8, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 6, 6, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 7, 10, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 10, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 7, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 8, 11, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 7, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;

    blockGenerated = await fillRecordOnGrid(tmpPuzzleState, 3, 6, 7, ORIENTATION_ENUM.COLUMN, 'DOWN');
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

    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 6, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 10, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 5, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 5, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 11, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 8, 4, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 9, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 7, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;

    blockGenerated = await fillRecordOnGrid(tmpPuzzleState, 4, 7, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT');
  }
  puzzleState = JSON.parse(JSON.stringify(tmpPuzzleState));

  const payload = await finalizePuzzle(puzzleState);
  return payload;
}

module.exports = {
  generateTemplate

}