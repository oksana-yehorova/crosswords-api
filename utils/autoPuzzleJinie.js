const colors = require("colors");


const {
    randomIntBetweenRange,
  } = require('./puzzleGenActionsForPuzzleJinnie');


  function createPuzzleState(date, gridSize) {
    return {
      gridSize: gridSize,
      template: null,
      date: date,
      gridSnapshot: Array(gridSize).fill(null).map(() => Array(gridSize).fill(null)),
      clueDiary: { xl: [], l: [], m: [], s: [] },
      cluesObj: { xl: [], l: [], m: [], s: [] },
      NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE: 0,
      NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE: 0,
      NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE: 0,
      NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE: 0,
      NUMBER_OF_S_CLUES_FOR_ACTIVE_PUZZLE: 0,
    };
  }

  async function generateMultiplePuzzles(numberOfPuzzles, gridSize) {
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


        puzzle = await generatePuzzle(counter, gridSize); // Ensure generatePuzzle() and other functions it calls are refactored to use puzzleState
      }while(!puzzle)
      console.log(colors.bgGreen('PUZZLE#', counter,' generated!!'))
      puzzles.push(puzzle);
    }
    return puzzles;
  }


  const generatePuzzle = async (date, gridSize)=> {
    return await initiatePuzzleGenerationFlow(createPuzzleState(date, gridSize));
  };

  const initiatePuzzleGenerationFlow =  async(puzzleState) => {
    let templates = {
      9: [1, 2, 3, 6, 7, 8, 9, 10, 11],
      12: [1, 2, 3, 4, 5, 6, 7]
    };
    const randomIndex = randomIntBetweenRange(0, templates[puzzleState.gridSize].length - 1);
    const chosenTemplate = templates[puzzleState.gridSize][randomIndex];
    console.log(colors.bgGreen('Genearteing Template# ', chosenTemplate))
    puzzleState.template = chosenTemplate;
    const {generateTemplate} = require(`./templates/${puzzleState.gridSize}/crossword_template${chosenTemplate}`);
    return await generateTemplate(puzzleState);
  }

  module.exports = {
    generateMultiplePuzzles,
    initiatePuzzleGenerationFlow
  }
