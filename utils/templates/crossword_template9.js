const colors = require("colors");
const {

    setupPointZero,
    randomIntBetweenRange,
    setNumberOfCluesForActivePuzzle,
    printGrid,
    calculateShare,
    getNumberOfCluesAgainstPercentage,
    getRandomizedClueLengthAgainstType,
    getClueWithSpecificAnswerPattern,
    gridAnalysisForLargeWords,
    getClueWithSpecificAnswerPattern1,
    getClueAgainstAnswerLength,
    getAnswerStartingIndex,
    addLargetypeWordsToGrid,
    getLargeWordsWithAnchorBranching,
    generateAndPlaceALargeWord,
    fetchLargeWordOptionsAgainstXLWord,
    randomlyPickBetweenRowAndColumn,
    fetchSuitableClueFromDB,
    analyzeString,
    scanPathForAnyCharacter,
    clueCellInPathScan,
    determineCluePlacement,
    getClueIndexAgainstAnswerStartingIndex,
    getAnswerCoordinatesAgainstClue,
    gridSnapshopFillerUtil,
    setCluesForActivePuzzleOfAnyType,
    scanLineForPossibleClue,
    readXLSXFile,
    scanGridForPossibleClues,
    pickRandom, generateDashes,
    fillRecordOnGrid,
    ORIENTATION_ENUM,
    generateWordStructureAgainstProvidedClueData,
    finalizePuzzle,
} = require('../puzzleGenActionsForPuzzleJinnie');


const generateTemplte9 = async (puzzleState) => {

    if (!await fillRecordOnGrid(puzzleState, 4, 4, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C48
    if (!await fillRecordOnGrid(puzzleState, 8, 6, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C60 
    if (!await fillRecordOnGrid(puzzleState, 4, 0, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C03 
    if (!await fillRecordOnGrid(puzzleState, 6, 2, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C20 
    if (!await fillRecordOnGrid(puzzleState, 8, 0, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C01
    if (!await fillRecordOnGrid(puzzleState, 4, 3, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) return false;  //C30
    if (!await fillRecordOnGrid(puzzleState, 4, 3, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C32

    
    
    if (!await fillRecordOnGrid(puzzleState, 4, 0, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) return false;  //C00 
    if (!await fillRecordOnGrid(puzzleState, 2, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C02
    if (!await fillRecordOnGrid(puzzleState, 5, 0, 4, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;  //C04
    if (!await fillRecordOnGrid(puzzleState, 4, 1, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C14 
    if (!await fillRecordOnGrid(puzzleState, 4, 0, 7, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;  //C07
    if (!await fillRecordOnGrid(puzzleState, 4, 3, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C34
    if (!await fillRecordOnGrid(puzzleState, 3, 0, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C08 

    if (!await fillRecordOnGrid(puzzleState, 6, 2, 7, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C27
    if (!await fillRecordOnGrid(puzzleState, 6, 8, 2, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C82
    if (!await fillRecordOnGrid(puzzleState, 3, 5, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C53
    if (!await fillRecordOnGrid(puzzleState, 5, 8, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;  //C80
    
    if (!await fillRecordOnGrid(puzzleState, 4, 4, 6, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C46
    if (!await fillRecordOnGrid(puzzleState, 3, 5, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C55
    if (!await fillRecordOnGrid(puzzleState, 3, 7, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C75
    if (!await fillRecordOnGrid(puzzleState, 2, 5, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C50
    if (!await fillRecordOnGrid(puzzleState, 3, 4, 4, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C44
    
    
    
    



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
    generateTemplte9

}