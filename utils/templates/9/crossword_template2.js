const colors = require("colors");
const {
    fillRecordOnGrid,
    ORIENTATION_ENUM,
    finalizePuzzle,
  } = require('../../puzzleGenActionsForPuzzleJinnie');


const generateTemplate = async(puzzleState) => {
  
  if (!await fillRecordOnGrid(puzzleState, 4, 7, 1, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C71
  if (!await fillRecordOnGrid(puzzleState, 4, 6, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C64
  if (!await fillRecordOnGrid(puzzleState, 6, 2, 5, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C25
  if (!await fillRecordOnGrid(puzzleState, 9, 4, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;  //C40
  if (!await fillRecordOnGrid(puzzleState, 8, 1, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C10
  if (!await fillRecordOnGrid(puzzleState, 4, 0, 3, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false; //C03
  if (!await fillRecordOnGrid(puzzleState, 9, 0, 7, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;  //C07
  if (!await fillRecordOnGrid(puzzleState, 4, 8, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C84
  if (!await fillRecordOnGrid(puzzleState, 6, 2, 7, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C27
  
  if (!await fillRecordOnGrid(puzzleState, 2, 7, 6, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C76
  if (!await fillRecordOnGrid(puzzleState, 2, 5, 6, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C56
  if (!await fillRecordOnGrid(puzzleState, 4, 4, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C44
  
  
  if (!await fillRecordOnGrid(puzzleState, 5, 0, 5, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;  //C05
  
  
  if (!await fillRecordOnGrid(puzzleState, 7, 0, 0, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false; //C00
  
  if (!await fillRecordOnGrid(puzzleState, 2, 2, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false; //C02

  if (!await fillRecordOnGrid(puzzleState, 5, 5, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C50
  
  
  
  if (!await fillRecordOnGrid(puzzleState, 3, 0, 4, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C04
  // if (!await fillRecordOnGrid(puzzleState, 5, 0, 5, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;  //C05

  
  


  if (!await fillRecordOnGrid(puzzleState, 6, 2, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C32
  if (!await fillRecordOnGrid(puzzleState, 3, 8, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C80

  if (!await fillRecordOnGrid(puzzleState, 5, 0, 5, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;  //C05
  

  
  

  
  if (!await fillRecordOnGrid(puzzleState, 4, 4, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C42
  
  
  
  if (!await fillRecordOnGrid(puzzleState, 4, 7, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;  //C05



  

  console.log(colors.bgGreen('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
  console.log(colors.bgGreen('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
  console.log(colors.bgWhite('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
  console.log(colors.bgWhite('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
  console.log(colors.bgGreen('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
  console.log(colors.bgGreen('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
  

  const payload = await finalizePuzzle(puzzleState);
  return payload;
}

  module.exports = {
    generateTemplate
    
  }