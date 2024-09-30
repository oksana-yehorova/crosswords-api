const colors = require("colors");
const {
    fillRecordOnGrid,
    ORIENTATION_ENUM,
    finalizePuzzle,
} = require('../../puzzleGenActionsForPuzzleJinnie');


const generateTemplate = async (puzzleState) => {
    if (!await fillRecordOnGrid(puzzleState, 4, 2, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C24 
    if (!await fillRecordOnGrid(puzzleState, 3, 0, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C03
    if (!await fillRecordOnGrid(puzzleState, 7, 0, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C01  
    if (!await fillRecordOnGrid(puzzleState, 7, 0, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) return false;  //C00
    if (!await fillRecordOnGrid(puzzleState, 8, 6, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C60 

    if (!await fillRecordOnGrid(puzzleState, 3, 3, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C30
    if (!await fillRecordOnGrid(puzzleState, 3, 2, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C20

    if (!await fillRecordOnGrid(puzzleState, 3, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C02  
    if (!await fillRecordOnGrid(puzzleState, 3, 0, 4, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;  //C04


    if (!await fillRecordOnGrid(puzzleState, 7, 1, 7, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C17 

    if (!await fillRecordOnGrid(puzzleState, 9, 0, 7, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;  //C07 

    if (!await fillRecordOnGrid(puzzleState, 3, 3, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C35 
    if (!await fillRecordOnGrid(puzzleState, 3, 7, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C75 
    if (!await fillRecordOnGrid(puzzleState, 7, 8, 1, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C81
    if (!await fillRecordOnGrid(puzzleState, 4, 4, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C48  
    //   if (!await fillRecordOnGrid(puzzleState, 9, 0, 7, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;  //C07 
    // if (!await fillRecordOnGrid(puzzleState, 4, 2, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C24 
    if (!await fillRecordOnGrid(puzzleState, 3, 0, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C08 


    // if (!await fillRecordOnGrid(puzzleState, 8, 6, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C60 
    if (!await fillRecordOnGrid(puzzleState, 3, 4, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) return false;  //C40 
    if (!await fillRecordOnGrid(puzzleState, 4, 4, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C42 
    if (!await fillRecordOnGrid(puzzleState, 5, 8, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;  //C80 

    if (!await fillRecordOnGrid(puzzleState, 5, 3, 4, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C34 
    if (!await fillRecordOnGrid(puzzleState, 4, 4, 3, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C43 
    // if (!await fillRecordOnGrid(puzzleState, 4, 4, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C48 
    if (!await fillRecordOnGrid(puzzleState, 3, 5, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C55 
    if (!await fillRecordOnGrid(puzzleState, 3, 5, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C53 
    //   console.log(colors.bgGreen('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
    //   console.log(colors.bgGreen('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
    //   console.log(colors.bgWhite('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
    //   console.log(colors.bgWhite('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
    //   console.log(colors.bgGreen('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
    //   console.log(colors.bgGreen('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
    //   return;
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