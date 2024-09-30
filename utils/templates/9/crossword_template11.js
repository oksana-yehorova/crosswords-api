const colors = require("colors");
const {
    fillRecordOnGrid,
    ORIENTATION_ENUM,
    finalizePuzzle,
} = require('../../puzzleGenActionsForPuzzleJinnie');


const generateTemplate = async (puzzleState) => {

    if (!await fillRecordOnGrid(puzzleState, 4, 4, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C48
    if (!await fillRecordOnGrid(puzzleState, 4, 5, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C54
    if (!await fillRecordOnGrid(puzzleState, 4, 4, 6, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C46
    if (!await fillRecordOnGrid(puzzleState, 7, 3, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;  //C30
    if (!await fillRecordOnGrid(puzzleState, 4, 0, 7, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;  //C07
    if (!await fillRecordOnGrid(puzzleState, 4, 1, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C14
    if (!await fillRecordOnGrid(puzzleState, 3, 0, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C08
    if (!await fillRecordOnGrid(puzzleState, 8, 0, 5, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C05
    if (!await fillRecordOnGrid(puzzleState, 6, 7, 2, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C72
    if (!await fillRecordOnGrid(puzzleState, 4, 6, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C64
    if (!await fillRecordOnGrid(puzzleState, 4, 8, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C84
    if (!await fillRecordOnGrid(puzzleState, 6, 2, 7, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C27
    if (!await fillRecordOnGrid(puzzleState, 5, 4, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C40  
    console.log(colors.bgWhite('*******************************'))
    //
    if (!await fillRecordOnGrid(puzzleState, 6, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C02  
    if (!await fillRecordOnGrid(puzzleState, 3, 1, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C10  
    if (!await fillRecordOnGrid(puzzleState, 3, 0, 0, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;  //C00
    if (!await fillRecordOnGrid(puzzleState, 3, 0, 4, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;  //C04
    if (!await fillRecordOnGrid(puzzleState, 3, 5, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C50  
    if (!await fillRecordOnGrid(puzzleState, 5, 3, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C31
    if (!await fillRecordOnGrid(puzzleState, 4, 7, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;  //C70  
    if (!await fillRecordOnGrid(puzzleState, 3, 8, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C80
    if (!await fillRecordOnGrid(puzzleState, 5, 3, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C33
    if (!await fillRecordOnGrid(puzzleState, 4, 3, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C34
    
    
    
    


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