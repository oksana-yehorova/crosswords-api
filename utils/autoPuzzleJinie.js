const colors = require("colors");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const xlsx = require("xlsx");
const Clue = require("../models/clue.js");
const PuzzleModel = require('../models/puzzle');
const { BATCH_SIZE, MAX_NUMBER_OF_CLUES, MIN_NUMBER_OF_CLUES, PERCENTAGE_NUMBER_OF_XL_CLUES, PERCENTAGE_NUMBER_OF_L_CLUES,
  PERCENTAGE_NUMBER_OF_M_CLUES, PERCENTAGE_NUMBER_OF_S_CLUES, CLUE_LENGTH_XL,CLUE_LENGTH_L, CLUE_LENGTH_M, CLUE_LENGTH_S } = require('../constants');

let { gridSnapshot,
  clueDiary, cluesObj,
  NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE,
  NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE,
  NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE,
  NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE,
  NUMBER_OF_S_CLUES_FOR_ACTIVE_PUZZLE} = require('../globalState');

const {generatePZHTemplte1, generateTemplte1} = require('./templates/crossword_template1');
const {generateTemplte2} = require('./templates/crossword_template2');
const {generateTemplte3} = require('./templates/crossword_template3');

const {generateTemplte6} = require('./templates/crossword_template6');
const {generateTemplte7} = require('./templates/crossword_template7');
const {generateTemplte8} = require('./templates/crossword_template8');
const {generateTemplte9} = require('./templates/crossword_template9');
const {generateTemplte10} = require('./templates/crossword_template10');
const {generateTemplte11} = require('./templates/crossword_template11');
// const {generateTemplte12} = require('./templates/crossword_template12');


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
    scanGridForPossibleClues
  } = require('./puzzleGenActionsForPuzzleJinnie');


  function createPuzzleState(date) {
    return {
      template: null,
      date: date,
      gridSnapshot: Array(9).fill(null).map(() => Array(9).fill(null)),
      clueDiary: { xl: [], l: [], m: [], s: [] },
      cluesObj: { xl: [], l: [], m: [], s: [] },
      NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE: 0,
      NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE: 0,
      NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE: 0,
      NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE: 0,
      NUMBER_OF_S_CLUES_FOR_ACTIVE_PUZZLE: 0,
    };
  }
  
  async function generateMultiplePuzzles(numberOfPuzzles) {
    let puzzles = [];
    let counterArr = [];

    for (let i = numberOfPuzzles - 1; i >= 0; i--) {
      let now = new Date()
      now. setHours(0,0,0,0)
      let date = new Date(now.setDate(now.getDate() - i))
      counterArr.push([
        date.getFullYear(),
        ('0' + (date.getMonth() + 1)).slice(-2),
        ('0' + date.getDate()).slice(-2),
      ].join('-'))
    }

    for(const counter of counterArr){
      let puzzle = false;
      do{
        console.log(colors.bgRed('FRESH PUzzle Generation Request..'))
        console.log(colors.bgRed('**** **** **** ****'))
        console.log(colors.bgRed('**** **** **** ****'))
        console.log(colors.bgRed('**** **** **** ****'))
        console.log(colors.bgRed('**** **** **** ****'))
        
        
        puzzle = await generatePuzzle(counter); // Ensure generatePuzzle() and other functions it calls are refactored to use puzzleState
        // console.log(colors.bgRed('POST puzzle genration request, here is the payload:', puzzle));
      }while(!puzzle)
      console.log(colors.bgGreen('PUZZLE#', counter,' generated!!'))
      puzzles.push(puzzle);
    }
    // puzzles.map(puzzle => console.log(colors.bgRed(puzzle._id)));
    return puzzles;
  }
  

  const generatePuzzle = async (date)=> {
    return await initiatePuzzleGenerationFlow(createPuzzleState(date));
  };
  

  // const initiatePuzzleGenerationFlow = async (puzzleState) => {
  //   setNumberOfCluesForActivePuzzle(puzzleState);
  //   return await setCluesForActivePuzzleOfAnyType(puzzleState,"XL");
  // }
  const initiatePuzzleGenerationFlow =  async(puzzleState) => {
    //  await setupPointZero(puzzleState);
    // return await generateTemplte1(puzzleState);
    // return await generateTemplte2(puzzleState);
    // return await generateTemplte3(puzzleState);
    // return await generateTemplte6(puzzleState);
    // return await generateTemplte7(puzzleState); 
    // return await generateTemplte8(puzzleState);
    // return await generateTemplte9(puzzleState);
    //  return await generateTemplte10(puzzleState);
    //  return await generateTemplte11(puzzleState);

    let templates = [1,2,3,6,7,8,9,10,11];
    const randomIndex = randomIntBetweenRange(0, templates.length - 1);
    const chosenTemplate = templates[randomIndex];
    console.log(colors.bgGreen('Genearteing Template# ', chosenTemplate))
    puzzleState.template = chosenTemplate;
    switch(chosenTemplate){
      case 1:
        return await generateTemplte1(puzzleState);
        break;
      case 2:
        return await generateTemplte2(puzzleState);
        break;
      case 3:
        return await generateTemplte3(puzzleState);
        break;
      case 6:
        return await generateTemplte6(puzzleState);
        break;
      case 7:
        return await generateTemplte7(puzzleState);
        break;
      case 8:
        return await generateTemplte8(puzzleState);
        break;
      case 9:
        return await generateTemplte9(puzzleState);
        break;
      case 10:
        return await generateTemplte10(puzzleState);
        break;
      case 11:
        return await generateTemplte11(puzzleState);
        break;
      
      default:
        break;
    }
  }

  async function pickRandomTemplate(puzzleState) {
    // Array of template numbers
    const templates = [1, 2, 3, 6, 7, 8, 9, 10, 11];

    

    // Picking a random template from the array
    const randomIndex = randomIntBetweenRange(0, templates.length - 1);
    const chosenTemplate = templates[randomIndex];
   
}




  module.exports = {
    generateMultiplePuzzles,
    initiatePuzzleGenerationFlow
  }
