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

  const generatePZHTemplte1 = async(puzzleState)=>{
      
      await setupRow2(puzzleState);
      await setupRow4(puzzleState);

      await setupRow6(puzzleState);
      await setupRow7(puzzleState);
      await setupRow8(puzzleState);



      await setupRow0(puzzleState);
      await setupRow1(puzzleState);
      
      
      
      
      
      return

      await setupRow2(puzzleState);
      
      
      
      await setupRow3(puzzleState);
      
      
      
      

      

      
      await setupRow5(puzzleState);
      
      
      
  }

//   const generateTemplte1 = async(puzzleState) => {
//     let flag = true;
//     console.log(colors.bgGreen('insdie Row: 8'))
//     await fillRecordOnGrid(puzzleState, 5, 8, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT');
//     await fillRecordOnGrid(puzzleState, 6, 8, 2, ORIENTATION_ENUM.ROW, 'RIGHT');    
// //
//     await fillRecordOnGrid(puzzleState, 9, 0, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT'); //C00
    
//     await fillRecordOnGrid(puzzleState, 2, 0, 4, ORIENTATION_ENUM.COLUMN, 'DOWN');
//     await fillRecordOnGrid(puzzleState, 2, 0, 5, ORIENTATION_ENUM.COLUMN, 'DOWN');
//     await fillRecordOnGrid(puzzleState, 7, 2, 0, ORIENTATION_ENUM.ROW, 'RIGHT'); //C20
//     await fillRecordOnGrid(puzzleState, 8, 0, 1, ORIENTATION_ENUM.COLUMN, 'DOWN');  //C01
//     await fillRecordOnGrid(puzzleState, 3, 0, 3, ORIENTATION_ENUM.COLUMN, 'DOWN');

//     await fillRecordOnGrid(puzzleState, 3, 3, 5, ORIENTATION_ENUM.ROW, 'RIGHT');
    
//     await fillRecordOnGrid(puzzleState, 5, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN');
//     await fillRecordOnGrid(puzzleState, 8, 0, 6, ORIENTATION_ENUM.COLUMN, 'DOWN');
//     await fillRecordOnGrid(puzzleState, 4, 0, 8, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN');
//     await fillRecordOnGrid(puzzleState, 6, 2, 8, ORIENTATION_ENUM.COLUMN, 'DOWN');

//     console.log(colors.bgGreen('insdie Row: 3'))
//     await fillRecordOnGrid(puzzleState, 3, 3, 0, ORIENTATION_ENUM.ROW, 'RIGHT');
//     await fillRecordOnGrid(puzzleState, 5, 3, 4, ORIENTATION_ENUM.COLUMN, 'DOWN');
//     // await fillRecordOnGrid(puzzleState, 3, 3, 5, ORIENTATION_ENUM.ROW, 'RIGHT');

    

//     console.log(colors.bgGreen('insdie Row: 4'))
//     await fillRecordOnGrid(puzzleState, 2, 4, 0, ORIENTATION_ENUM.ROW, 'RIGHT');
//     await fillRecordOnGrid(puzzleState, 3, 4, 3, ORIENTATION_ENUM.ROW, 'RIGHT');
//     await fillRecordOnGrid(puzzleState, 4, 4, 7, ORIENTATION_ENUM.COLUMN, 'DOWN');


//     console.log(colors.bgGreen('insdie Row: 7'))
//     await fillRecordOnGrid(puzzleState, 3, 7, 5, ORIENTATION_ENUM.ROW, 'RIGHT');


//     console.log(colors.bgGreen('insdie Row: 5'))
//     await fillRecordOnGrid(puzzleState, 3, 5, 3, ORIENTATION_ENUM.COLUMN, 'DOWN');
//     await fillRecordOnGrid(puzzleState, 3, 5, 5, ORIENTATION_ENUM.ROW, 'RIGHT');    

//     console.log(colors.bgGreen('insdie Row: 6'))
//     await fillRecordOnGrid(puzzleState, 3, 6, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT');
//     await fillRecordOnGrid(puzzleState, 6, 6, 2, ORIENTATION_ENUM.ROW, 'RIGHT');   


//   }

const generateTemplte1 = async(puzzleState) => {
  
  
  if (!await fillRecordOnGrid(puzzleState, 5, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false; //C02
  if (!await fillRecordOnGrid(puzzleState, 9, 0, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT')) return false; //C00
  
  if (!await fillRecordOnGrid(puzzleState, 8, 0, 1, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false;  //C01
  if (!await fillRecordOnGrid(puzzleState, 3, 6, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false; //C60
  if (!await fillRecordOnGrid(puzzleState, 2, 4, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false; //C40
  if (!await fillRecordOnGrid(puzzleState, 3, 3, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false; //C30
  if (!await fillRecordOnGrid(puzzleState, 7, 2, 0, ORIENTATION_ENUM.ROW, 'RIGHT')) return false; //C20
  if (!await fillRecordOnGrid(puzzleState, 5, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false; //C02
  
  if (!await fillRecordOnGrid(puzzleState, 3, 0, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false; //C03
  if (!await fillRecordOnGrid(puzzleState, 2, 0, 4, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false; //C04
  if (!await fillRecordOnGrid(puzzleState, 2, 0, 5, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false; //C05
  if (!await fillRecordOnGrid(puzzleState, 8, 0, 6, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false; //C06
  if (!await fillRecordOnGrid(puzzleState, 4, 0, 8, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN')) return false; //C08

  if (!await fillRecordOnGrid(puzzleState, 6, 8, 2, ORIENTATION_ENUM.ROW, 'RIGHT')) return false; //C82

  if (!await fillRecordOnGrid(puzzleState, 6, 6, 2, ORIENTATION_ENUM.ROW, 'RIGHT')) return false; //C62
  
  if(! await fillRecordOnGrid(puzzleState, 3, 5, 3, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false; //C53

  if (!  await fillRecordOnGrid(puzzleState, 5, 3, 4, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false; // C34
  if (!await await fillRecordOnGrid(puzzleState, 3, 3, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false; //C35

  

  if (!await fillRecordOnGrid(puzzleState, 6, 2, 8, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false; //C28


  if (!await fillRecordOnGrid(puzzleState, 5, 8, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT')) return false; //C80
  
  // if (!await fillRecordOnGrid(puzzleState, 6, 6, 2, ORIENTATION_ENUM.ROW, 'RIGHT')) return false; //C62

  
  if (!await fillRecordOnGrid(puzzleState, 4, 4, 7, ORIENTATION_ENUM.COLUMN, 'DOWN')) return false; // C47
  if (!await fillRecordOnGrid(puzzleState, 3, 5, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false; // C55

  
  // if (!await fillRecordOnGrid(puzzleState, 6, 8, 2, ORIENTATION_ENUM.ROW, 'RIGHT')) return false; //C82

  if (!await fillRecordOnGrid(puzzleState, 3, 7, 5, ORIENTATION_ENUM.ROW, 'RIGHT')) return false; //C75

  
  
  if (!await fillRecordOnGrid(puzzleState, 3, 4, 3, ORIENTATION_ENUM.ROW, 'RIGHT')) return false; //C43
  
  const payload = await finalizePuzzle(puzzleState);
  return payload;
}


  const setupRow0 = async (puzzleState)=>{
    console.log(colors.bgRed('insdie Row: 0'))
    await fillRecordOnGrid(puzzleState, 9, 0, 0, ORIENTATION_ENUM.ROW, 'DOWN_RIGHT');
    await fillRecordOnGrid(puzzleState, 8, 0, 1, ORIENTATION_ENUM.COLUMN, 'DOWN');
    await fillRecordOnGrid(puzzleState, 5, 0, 2, ORIENTATION_ENUM.COLUMN, 'DOWN');
    await fillRecordOnGrid(puzzleState, 3, 0, 3, ORIENTATION_ENUM.COLUMN, 'DOWN');
    await fillRecordOnGrid(puzzleState, 2, 0, 4, ORIENTATION_ENUM.COLUMN, 'DOWN');
    await fillRecordOnGrid(puzzleState, 2, 0, 5, ORIENTATION_ENUM.COLUMN, 'DOWN');
    await fillRecordOnGrid(puzzleState, 8, 0, 6, ORIENTATION_ENUM.COLUMN, 'DOWN');
    await fillRecordOnGrid(puzzleState, 4, 0, 8, ORIENTATION_ENUM.COLUMN, 'LEFT_DOWN');
    
    
    
  }

  const setupRow1 = async (puzzleState)=>{
    console.log(colors.bgRed('insdie Row: 1'))
    // EMPTY
  }

  const setupRow2 = async (puzzleState)=>{
    console.log(colors.bgGreen('insdie Row: 2'))
    await fillRecordOnGrid(puzzleState, 7, 2, 0, ORIENTATION_ENUM.ROW, 'RIGHT');
    await fillRecordOnGrid(puzzleState, 6, 2, 8, ORIENTATION_ENUM.COLUMN, 'DOWN');
  }

  const setupRow3 = async (puzzleState)=>{
    console.log(colors.bgGreen('insdie Row: 3'))
    await fillRecordOnGrid(puzzleState, 3, 3, 0, ORIENTATION_ENUM.ROW, 'RIGHT');
    await fillRecordOnGrid(puzzleState, 5, 3, 4, ORIENTATION_ENUM.COLUMN, 'DOWN');
    await fillRecordOnGrid(puzzleState, 3, 3, 5, ORIENTATION_ENUM.ROW, 'RIGHT');
  }

  const setupRow4 = async (puzzleState)=>{
    console.log(colors.bgGreen('insdie Row: 4'))
    await fillRecordOnGrid(puzzleState, 2, 4, 0, ORIENTATION_ENUM.ROW, 'RIGHT');
    await fillRecordOnGrid(puzzleState, 3, 4, 3, ORIENTATION_ENUM.ROW, 'RIGHT');
    await fillRecordOnGrid(puzzleState, 4, 4, 7, ORIENTATION_ENUM.COLUMN, 'DOWN');
  }

  const setupRow5 = async (puzzleState)=>{
    console.log(colors.bgGreen('insdie Row: 5'))
    await fillRecordOnGrid(puzzleState, 3, 5, 3, ORIENTATION_ENUM.COLUMN, 'DOWN');
    await fillRecordOnGrid(puzzleState, 3, 5, 5, ORIENTATION_ENUM.ROW, 'RIGHT');    
  }

  const setupRow6 = async (puzzleState)=>{
    console.log(colors.bgGreen('insdie Row: 6'))
    await fillRecordOnGrid(puzzleState, 3, 6, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT');
    await fillRecordOnGrid(puzzleState, 6, 6, 2, ORIENTATION_ENUM.ROW, 'RIGHT');    
  }

  const setupRow7 = async (puzzleState)=>{
    console.log(colors.bgGreen('insdie Row: 7'))
    await fillRecordOnGrid(puzzleState, 3, 7, 5, ORIENTATION_ENUM.ROW, 'RIGHT');
  }

  const setupRow8 = async (puzzleState)=>{
    console.log(colors.bgGreen('insdie Row: 8'))
    await fillRecordOnGrid(puzzleState, 5, 8, 0, ORIENTATION_ENUM.ROW, 'UP_RIGHT');
    await fillRecordOnGrid(puzzleState, 6, 8, 2, ORIENTATION_ENUM.ROW, 'RIGHT');    
  }



  module.exports = {
    generatePZHTemplte1,
    generateTemplte1
    
  }