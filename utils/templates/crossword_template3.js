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


const generateTemplte3 = async(puzzleState) => {
  if (!await fillRecordOnGrid(puzzleState, 7, 0, 0, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;  //C00

  if (!await fillRecordOnGrid(puzzleState, 3, 4, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C40   
  if (!await fillRecordOnGrid(puzzleState, 3, 4, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C45
  

  if (!await fillRecordOnGrid(puzzleState, 7, 1, 7, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C17
  if (!await fillRecordOnGrid(puzzleState, 7, 7, 1, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C71
  if (!await fillRecordOnGrid(puzzleState, 5, 5, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C50

  if (!await fillRecordOnGrid(puzzleState, 6, 2, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C22

  if (!await fillRecordOnGrid(puzzleState, 9, 2, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) return false;  //C20
  // if (!await fillRecordOnGrid(puzzleState, 7, 0, 0, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;  //C00
  if (!await fillRecordOnGrid(puzzleState, 6, 0, 2, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;  //C02
  if (!await fillRecordOnGrid(puzzleState, 6, 1, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C10
  if (!await fillRecordOnGrid(puzzleState, 4, 0, 4, ORIENTATION_ENUM.COLUMN, 'RIGHT_DOWN')) return false;  //C04
  if (!await fillRecordOnGrid(puzzleState, 5, 0, 7, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false;  //C06
  if (!await fillRecordOnGrid(puzzleState, 4, 2, 4, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C24
  if (!await fillRecordOnGrid(puzzleState, 4, 0, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C08
  if (!await fillRecordOnGrid(puzzleState, 3, 8, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C85




  if (!await fillRecordOnGrid(puzzleState, 3, 5, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C58

  if (!await fillRecordOnGrid(puzzleState, 3, 6, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C65
  if (!await fillRecordOnGrid(puzzleState, 3, 5, 6, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C56

  if (!await fillRecordOnGrid(puzzleState, 2, 6, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C63
  if (!await fillRecordOnGrid(puzzleState, 4, 8, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false;  //C80

  if (!await fillRecordOnGrid(puzzleState, 4, 4, 4, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C80

  if (!await fillRecordOnGrid(puzzleState, 3, 7, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false;  //C70


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
    generateTemplte3
    
  }