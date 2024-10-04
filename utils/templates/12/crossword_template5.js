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

  // bottom left
  while (!blockGenerated) {
    tmpPuzzleState = JSON.parse(JSON.stringify(puzzleState));

    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 8, 4, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 8, 10, 3, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 4, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 9, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 6, 6, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 11, 1, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 8, 5, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 7, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 7, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 5, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 6, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;

    blockGenerated = await fillRecordOnGrid(tmpPuzzleState, 3, 11, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT');
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

    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 9, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 8, 11, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 6, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 6, 10, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 11, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 7, 7, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 2, 5, 5, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 7, 4, 9, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;

    blockGenerated = await fillRecordOnGrid(tmpPuzzleState, 3, 8, 7, ORIENTATION_ENUM.ROW, 'RIGHT');
  }
  puzzleState = JSON.parse(JSON.stringify(tmpPuzzleState));
  blockGenerated = false;
  attempts = 0;

  // top left
  while (!blockGenerated) {
    tmpPuzzleState = JSON.parse(JSON.stringify(puzzleState));

    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 1, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 7, 0, 5, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 2, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 3, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 0, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 0, 0, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) continue;

    blockGenerated = await fillRecordOnGrid(tmpPuzzleState, 3, 4, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT');
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

    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 1, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 0, 7, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 2, 7, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 0, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 6, 3, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 5, 5, 6, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 0, 10, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 4, 1, 10, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 4, 7, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 4, 11, ORIENTATION_ENUM.COLUMN, 'DOWN')) continue;
    if (!await fillRecordOnGrid(tmpPuzzleState, 3, 4, 3, ORIENTATION_ENUM.ROW, 'RIGHT')) continue;

    blockGenerated = await fillRecordOnGrid(tmpPuzzleState, 3, 0, 11, ORIENTATION_ENUM.COLUMN, 'DOWN');
  }
  puzzleState = JSON.parse(JSON.stringify(tmpPuzzleState));

  const payload = await finalizePuzzle(puzzleState);
  return payload;
}

module.exports = {
  generateTemplate

}