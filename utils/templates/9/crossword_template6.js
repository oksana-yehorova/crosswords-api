const colors = require("colors");
const {
  fillRecordOnGrid,
  ORIENTATION_ENUM,
  finalizePuzzle,
} = require('../../puzzleGenActionsForPuzzleJinnie');



const generateTemplate = async (puzzleState) => {
  if (!await fillRecordOnGrid(puzzleState, 8, 3, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C30
  if (!await fillRecordOnGrid(puzzleState, 9, 0, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) return false;  //C00
  if (!await fillRecordOnGrid(puzzleState, 5, 0, 7, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;  //C07
  if (!await fillRecordOnGrid(puzzleState, 5, 0, 5, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;  //C05
  if (!await fillRecordOnGrid(puzzleState, 4, 2, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C20
  if (!await fillRecordOnGrid(puzzleState, 3, 0, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C03
  if (!await fillRecordOnGrid(puzzleState, 6, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C02
  if (!await fillRecordOnGrid(puzzleState, 3, 0, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C01
  if (!await fillRecordOnGrid(puzzleState, 4, 0, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C08
  if (!await fillRecordOnGrid(puzzleState, 5, 4, 3, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C43 
  if (!await fillRecordOnGrid(puzzleState, 4, 6, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C64
  if (!await fillRecordOnGrid(puzzleState, 6, 2, 5, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C25
  if (!await fillRecordOnGrid(puzzleState, 6, 2, 7, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C27
  if (!await fillRecordOnGrid(puzzleState, 4, 8, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C84  
  if (!await fillRecordOnGrid(puzzleState, 4, 7, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;  //C70
  if (!await fillRecordOnGrid(puzzleState, 4, 4, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C41
  if (!await fillRecordOnGrid(puzzleState, 4, 4, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) return false;  //C40
  if (!await fillRecordOnGrid(puzzleState, 4, 5, 4, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;  //C54
  if (!await fillRecordOnGrid(puzzleState, 6, 7, 2, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C72 
  if (!await fillRecordOnGrid(puzzleState, 3, 5, 6, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C56
  if (!await fillRecordOnGrid(puzzleState, 3, 5, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C58
  if (!await fillRecordOnGrid(puzzleState, 3, 8, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C80 
  console.log(colors.bgGreen('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
  console.log(colors.bgGreen('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
  console.log(colors.bgWhite('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
  console.log(colors.bgWhite('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
  console.log(colors.bgGreen('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
  console.log(colors.bgGreen('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
  // return;

  const payload = await finalizePuzzle(puzzleState);
  return payload;
}






module.exports = {
  generateTemplate

}