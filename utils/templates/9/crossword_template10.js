const colors = require("colors");
const {
    fillRecordOnGrid,
    ORIENTATION_ENUM,
    finalizePuzzle,
} = require('../../puzzleGenActionsForPuzzleJinnie');


const generateTemplate = async (puzzleState) => {
    if (!await fillRecordOnGrid(puzzleState, 4, 4, 7, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C47
    if (!await fillRecordOnGrid(puzzleState, 4, 5, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C54
    if (!await fillRecordOnGrid(puzzleState, 8, 6, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C60
    if (!await fillRecordOnGrid(puzzleState, 8, 0, 6, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C06
    if (!await fillRecordOnGrid(puzzleState, 6, 8, 2, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C82
    if (!await fillRecordOnGrid(puzzleState, 4, 4, 5, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C45
    if (!await fillRecordOnGrid(puzzleState, 6, 2, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C28
    if (!await fillRecordOnGrid(puzzleState, 4, 7, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C74
    console.log(colors.bgGreen('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
    if (!await fillRecordOnGrid(puzzleState, 4, 0, 4, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;  //C04
    if (!await fillRecordOnGrid(puzzleState, 8, 3, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;  //C30
    if (!await fillRecordOnGrid(puzzleState, 4, 1, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C14
    if (!await fillRecordOnGrid(puzzleState, 4, 3, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C34
    if (!await fillRecordOnGrid(puzzleState, 4, 0, 8, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;  //C08
    
    if (!await fillRecordOnGrid(puzzleState, 8, 0, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C03
    if (!await fillRecordOnGrid(puzzleState, 3, 1, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C10
    if (!await fillRecordOnGrid(puzzleState, 3, 0, 0, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;  //C00
    if (!await fillRecordOnGrid(puzzleState, 2, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C02
    console.log(colors.bgRed('|||||||||||||||||||||||||||||||||||||||||||||||||||||'))
    if (!await fillRecordOnGrid(puzzleState, 4, 4, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C40
    if (!await fillRecordOnGrid(puzzleState, 5, 3, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C31    
    if (!await fillRecordOnGrid(puzzleState, 4, 8, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;  //C80
    if (!await fillRecordOnGrid(puzzleState, 3, 5, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C50
    if (!await fillRecordOnGrid(puzzleState, 4, 3, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C32
    
    

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