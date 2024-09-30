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


function randomIntBetweenRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getClueSize(word) {
  const length = word.length;

  if (length > 7) {
      return 'xl';
  } else if (length >= 5) {
      return 'l';
  } else if (length >= 3) {
      return 'm';
  } else {
      return 's';
  }
}

const setNumberOfCluesForActivePuzzle = () => {
  NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE = randomIntBetweenRange(
    MIN_NUMBER_OF_CLUES,
    MAX_NUMBER_OF_CLUES
  );
  console.log(
    "NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE",
    NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE
  );
  // NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE = getNumberOfCluesAgainstPercentage("XL");
  //hardcoded temporarily
  NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE = 2;
  NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE = getNumberOfCluesAgainstPercentage("L");
  NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE = getNumberOfCluesAgainstPercentage("M");
  // NUMBER_OF_S_CLUES_FOR_ACTIVE_PUZZLE = getNumberOfCluesAgainstPercentage('S');
  NUMBER_OF_S_CLUES_FOR_ACTIVE_PUZZLE =
    NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE -
    (NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE +
      NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE +
      NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE);
  console.log(
    "NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE",
    NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE
  );
  console.log(
    "NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE",
    NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE
  );
  console.log(
    "NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE",
    NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE
  );
  console.log(
    "NUMBER_OF_S_CLUES_FOR_ACTIVE_PUZZLE",
    NUMBER_OF_S_CLUES_FOR_ACTIVE_PUZZLE
  );
  console.log(
    "TOTAL OF SPLITTED CLUES",
    NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE +
      NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE +
      NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE +
      NUMBER_OF_S_CLUES_FOR_ACTIVE_PUZZLE
  );
};




const printGrid = (grid) => {
  gridSnapshot.forEach((row) => {
    0.0;
    console.log(row.map((cell) => cell || ".").join(" "));
  });
};

const calculateShare = (percentage, totalClues) => {
  const decimalPercentage = percentage / 100;
  const share = Math.floor(decimalPercentage * totalClues);
  return share;
};

const getNumberOfCluesAgainstPercentage = (type) => {
  switch (type) {
    case "XL":
      return calculateShare(
        PERCENTAGE_NUMBER_OF_XL_CLUES,
        NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE
      );
    // break;
    case "L":
      return calculateShare(
        PERCENTAGE_NUMBER_OF_L_CLUES,
        NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE
      );
    // break;
    case "M":
      return calculateShare(
        PERCENTAGE_NUMBER_OF_M_CLUES,
        NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE
      );
    // break;
    case "S":
      return calculateShare(
        PERCENTAGE_NUMBER_OF_S_CLUES,
        NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE
      );
    // break;
    default:
      break;
  }
};

const getRandomizedClueLengthAgainstType = (type) => {
  let upperLimit;
  let lowerLimit = 1;
  switch (type) {
    case "XL":
      upperLimit = parseInt(CLUE_LENGTH_XL.split("-")[1]);
      lowerLimit = parseInt(CLUE_LENGTH_XL.split("-")[0]);
      // console.log('upperLimit', upperLimit, 'lowerLImit', lowerLimit);
      return randomIntBetweenRange(lowerLimit, upperLimit);
      // return 9;
    // break;
    case "L":
      upperLimit = parseInt(CLUE_LENGTH_L.split("-")[1]);
      lowerLimit = parseInt(CLUE_LENGTH_L.split("-")[0]);
      // console.log('upperLimit', upperLimit, 'lowerLImit', lowerLimit);
      return randomIntBetweenRange(lowerLimit, upperLimit);
      break;
    case "M":
      // upperLimit = parseInt(CLUE_LENGTH_M.split('-')[1]);
      // lowerLimit = parseInt(CLUE_LENGTH_M.split('-')[0]);
      // // console.log('upperLimit', upperLimit, 'lowerLImit', lowerLimit);
      // return randomIntBetweenRange(lowerLimit, upperLimit);
      return 4;
      break;
    case "S":
      upperLimit = parseInt(CLUE_LENGTH_S.split("-")[1]);
      lowerLimit = parseInt(CLUE_LENGTH_S.split("-")[0]);
      // console.log('upperLimit', upperLimit, 'lowerLImit', lowerLimit);
      return randomIntBetweenRange(lowerLimit, upperLimit);
      break;
    default:
      return;
  }
};

//
const getClueWithSpecificAnswerPattern = async (pattern) => {
  console.log('pattern', pattern);
  try {
    const { totalLength, nonDashCharacters } = pattern;

    let matchStage;
    if (nonDashCharacters.length === 0) {
      // Fetch any clue of the appropriate length
      matchStage = { $expr: { $eq: [{ $strLenCP: "$answers.text" }, totalLength] } };
    } else {
      // Construct a regex pattern from nonDashCharacters
      let regexPattern = nonDashCharacters.reduce((acc, { position, character }) => {
        acc[position] = character;
        return acc;
      }, Array(totalLength).fill('.')).join('');
      matchStage = { "answers.text": { $regex: `^${regexPattern}$` } };
    }

    const clues = await Clue.aggregate([
      { $unwind: "$answers" },
      { $match: matchStage },
      { $sample: { size: 1 } }
    ]);

    if (clues.length > 0) {
      const clue = clues[0];
      return {
        clue: clue.question,
        answer: clue.answers.text,
      };
    } else {
      console.log("No clue found for the given pattern");
      return null;
    }
  } catch (error) {
    console.error("Error fetching clue from the database:", error);
    throw error;
  }
};


const getClueForFilledWordStructure = async (wordStructure) => {
  console.log('Word Structure:', wordStructure);
  try {
    // Convert the word structure into a regex pattern
    // Escapes '-' to be treated as missing character placeholders
    const regexPattern = '^' + wordStructure.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&").replace(/-/g, '.');

    // Calculate the maximum allowed length for the answer
    // It should not exceed the length of the provided word structure
    const maxLength = wordStructure.length;

    // Query for clues where an answer matches the regex pattern
    // and does not exceed the maximum allowed length
    const clues = await Clue.aggregate([
      { $unwind: "$answers" }, // Deconstruct the answers array
      {
        $match: {
          $and: [
            { "answers.text": { $regex: regexPattern, $options: 'i' } }, // Match the pattern
            { "answers.text": { $regex: `^.{0,${maxLength}}$` } }, // Check the length does not exceed maxLength
          ]
        }
      },
      { $sample: { size: 1 } } // Randomly select one matching clue
    ]);

    if (clues.length > 0) {
      const clue = clues[0];
      return {
        clue: clue.question,
        answer: clue.answers.text,
      };
    } else {
      console.log("No clue found for the given word structure");
      return null;
    }
  } catch (error) {
    console.error("Error fetching clue for filled word structure from the database:", error);
    throw error;
  }
};





  const getClueWithSpecificAnswerPattern_ = async (pattern) => {
    console.log('pattern', pattern)
    try {
      const { totalLength, nonDashCharacters } = pattern;

      // If there are no specific characters to match (all dashes), 
      // fetch any clue of the appropriate length.
      if (nonDashCharacters.length === 0) {
        return await getClueAgainstAnswerLength(totalLength);
      }

      // Use aggregation to match the answers array elements that have the correct length
      const clues = await Clue.aggregate([
        { $match: { "answers.length": totalLength } },
        { $unwind: "$answers" },
        { $match: { "answers.length": totalLength } },
        { $sample: { size: 10 } }, // Get a sample of documents to manually filter later
      ]);

      // Filter to find a matching pattern
      for (let clue of clues) {
        if (
          nonDashCharacters.every(
            (ndc) => clue.answers.text[ndc.position] === ndc.character
          )
        ) {
          return {
            clue: clue.question,
            answer: clue.answers.text,
          };
        }
      }

      console.log("No clue found for the given pattern");
      return null;
    } catch (error) {
      console.error("Error fetching clue from the database:", error);
      throw error;
    }
  };

//

function gridAnalysisForLargeWords() {
  const gridSize = gridSnapshot.length; // Assuming a square grid
  const largeWordLengthRange = { min: 5, max: 7 }; // For example, L-sized words

  // Helper function to check if a row or column has enough space
  const hasEnoughSpace = (line, length) => {
    let spaceCount = 0;
    for (let cell of line) {
      if (cell === null) spaceCount++;
      else spaceCount = 0; // Reset  if a filled cell is found

      if (spaceCount === length) return true;
    }
    return false;
  };

  // Helper function to identify potential placements for a large word
  const findPotentialPlacements = (length) => {
    const potentialPlacements = [];

    // Check each row
    for (let i = 0; i < gridSize; i++) {
      if (hasEnoughSpace(gridSnapshot[i], length)) {
        potentialPlacements.push({ orientation: "ROW", index: i });
      }
    }

    // Check each column
    for (let j = 0; j < gridSize; j++) {
      const column = gridSnapshot.map((row) => row[j]);
      if (hasEnoughSpace(column, length)) {
        potentialPlacements.push({ orientation: "COLUMN", index: j });
      }
    }

    return potentialPlacements;
  };

  // Analyze the grid for each large word length
  for (
    let length = largeWordLengthRange.min;
    length <= largeWordLengthRange.max;
    length++
  ) {
    const placements = findPotentialPlacements(length);
    // TODO: Fetch a suitable word for each placement and try to fit it in the grid
    // This may involve checking for intersections and ensuring the word matches existing letters
  }

  // TODO: Return a list of words with their potential placements, or place them directly in the grid
}

//
const getClueWithSpecificAnswerPattern1 = async (pattern) => {
  try {
    const { totalLength, nonDashCharacters } = pattern;

    // Building the query to match the answer pattern
    let answerPatternQuery = { "answers.length": totalLength };
    nonDashCharacters.forEach((ndc) => {
      const positionKey = `answers.text.${ndc.position}`;
      answerPatternQuery[positionKey] = ndc.character;
    });

    // Use aggregation to match the clues with the specific answer pattern
    const clues = await Clue.aggregate([
      { $unwind: "$answers" }, // Unwind the answers array to treat each answer as a separate document
      { $match: answerPatternQuery }, // Match clues with specific answer pattern
      { $sample: { size: 1 } }, // Randomly select one document that matches the query
    ]);

    // If a clue is found, return it
    if (clues.length > 0) {
      const clue = clues[0];
      return {
        clue: clue.question,
        answer: clue.answers.text, // The matched answer
      };
    } else {
      console.log("No clue found for the given pattern");
      return null;
    }
  } catch (error) {
    console.error("Error fetching clue from the database:", error);
    throw error;
  }
};

//

const getClueAgainstAnswerLength = async (answerLength) => {
  try {
    // Use aggregation to match the answers array elements that have the correct length
    const clues = await Clue.aggregate([
      { $match: { "answers.length": answerLength } }, // Match clues with an answer of the correct length
      { $sample: { size: 1 } }, // Randomly select one document that matches the query
    ]);

    // If a clue is found, return it
    if (clues.length > 0) {
      const clue = clues[0];
      // console.log(clue)
      let filtered = clue.answers.filter((answer) => {
        return answer.length === answerLength;
      });
      let obj = {
        clue: clue.question,
        answer: filtered[0].text,
      };

      // console.log(`Found clue: ${clue.question}, Answer: ${clue.answer}`);
      // return clue;
      return obj;
    } else {
      console.log("No clue found for the given length");
      return null;
    }
  } catch (error) {
    console.error("Error fetching clue from the database:", error);
    throw error;
  }
};
//

const getAnswerStartingIndex = (orientation,answerLength,clueIndexI,clueIndexJ,answerDirectionFlow) => {
  let answerStartingIndexI;
  let answerStartingIndexJ;
  console.log('getAnswerStartingIndex: ');
  console.log('orientation, answerLength, clueIndexI, clueIndexJ, answerDirectionFlow',orientation, answerLength, clueIndexI, clueIndexJ, answerDirectionFlow)
  switch (orientation) {
    case "ROW":
      switch (answerDirectionFlow) {
        case "RIGHT":
          answerStartingIndexI = clueIndexI;
          answerStartingIndexJ = clueIndexJ + 1;
          console.log(
            "ROW RIGHT answerStartingIndexI answerStartingIndexJ",
            answerStartingIndexI,
            answerStartingIndexJ
          );
          break;
        case "UP_RIGHT":
          answerStartingIndexI = clueIndexI - 1;
          answerStartingIndexJ = clueIndexJ;
          console.log(
            "ROW UP_RIGHT answerStartingIndexI answerStartingIndexJ",
            answerStartingIndexI,
            answerStartingIndexJ
          );
          break;
        case "DOWN_RIGHT":
          answerStartingIndexI = clueIndexI + 1;
          answerStartingIndexJ = clueIndexJ;
          console.log(
            "ROW DOWN_RIGHT answerStartingIndexI answerStartingIndexJ",
            answerStartingIndexI,
            answerStartingIndexJ
          );
          break;
        default:
          break;
      }

      break;
    case "COLUMN":
      switch (answerDirectionFlow) {
        case "DOWN":
          answerStartingIndexI = clueIndexI + 1;
          answerStartingIndexJ = clueIndexJ;
          break;
        case "LEFT_DOWN":
          answerStartingIndexI = clueIndexI;
          answerStartingIndexJ = clueIndexJ - 1;
          break;
        case "RIGHT_DOWN":
          answerStartingIndexI = clueIndexI;
          answerStartingIndexJ = clueIndexJ + 1;
          break;
        default:
          break;
      }
      break;
  }
  // console.log('answerStartingIndexI', answerStartingIndexI)
  return {
    answerStartingIndexI: answerStartingIndexI,
    answerStartingIndexJ: answerStartingIndexJ,
  };
};

//generate all Large sized words:
const addLargetypeWordsToGrid = () => {
  // do all the pre generation analysis here
  //step#1, find the positions of Anchor Points, try to branch Large words with these points.
  //analyize the anchor points by fetching XL words orientatios and thier paths. Use these to position large words.
};

const getLargeWordsWithAnchorBranching = () => {
  //
};

const generateAndPlaceALargeWord = async () => {
  console.log(colors.blue("Adding Large Size Word Now."));
  // clueDiary.xl.map( async (xlClue) => {
    for(const xlClue of clueDiary.xl){
    console.log(colors.bgBrightMagenta('PROCESSING FOR XL:', xlClue.clueObject.answer, xlClue.orientation ))
    let arr = await fetchLargeWordOptionsAgainstXLWord(xlClue);
    // arr.map( (largeWord)=> {
    for(const largeWord of arr){
      console.log(colors.yellow(largeWord));
      console.log(colors.yellow('now running gridSnapshopFillerUtil for LARGE WORD: ', xlClue.clueObject.answer, xlClue.orientation));
      gridSnapshotFillerUtil(largeWord.orientation, largeWord.clueObject, largeWord.clueIndex.clueIndexI, largeWord.clueIndex.clueIndexJ, largeWord.directionFlow)
      // clueDiary.l.push({
      //   clueNumber: clueDiary.l.length + 1,
      //   clueObject: largeWord.clueObject,
      //   orientation: largeWord.orientation,
      //   startingIndex: getAnswerStartingIndex(largeWord.orientation,largeWord.clueObject.answer.length,largeWord.clueIndex.clueIndexI,largeWord.clueIndex.clueIndexJ,largeWord.directionFlow),
      //   directionFlow: largeWord.directionFlow
      // })
    }
    
    
  };
  
};

function generateCrosswordFromDiary(clueDiary) {
  const crossword = {
    crosswordId: "cw-custom-generated",
    title: "Generated Crossword",
    date: new Date().toISOString().split('T')[0], // Today's date
    gridSize: 9,
    clues: {
      across: [],
      down: []
    },
    cells: [] // Assuming we'll populate this later
  };

  // Helper function to determine the clue's direction
  const getDirection = (orientation) => orientation === "ROW" ? "across" : "down";

  // Iterate through each clue size category in clueDiary
        
  Object.keys(clueDiary).forEach(sizeKey => {
    const clues = clueDiary[sizeKey];
    clues.forEach(clueObj => {
      const clueEntry = {
        // number: (crossword.clues[getDirection(clueObj.orientation)].length+1).toString(),
        // number: (crossword.clues['across'].length + crossword.clues['down'].length + 1).toString(),
        number: clueObj.clueNumber.toString(),
        clue: clueObj.clueObject.clue,
        answer: clueObj.clueObject.answer,
        length: clueObj.clueObject.answer.length,
        clueIndex: { x: clueObj.clueIndex.clueIndexI, y: clueObj.clueIndex.clueIndexJ },
        startPosition: { x: clueObj.startingIndex.answerStartingIndexI, y: clueObj.startingIndex.answerStartingIndexJ },
        direction: getDirection(clueObj.orientation)
      };
      // Add the clue to the appropriate direction in the crossword object
      crossword.clues[clueEntry.direction].push(clueEntry);
    });
  });

  return crossword.clues;
}

// 
function generateCellsArrayFromDiary_backup(clueDiary) {
  const cells = {};
  const processedClueIndices = new Set();

  Object.keys(clueDiary).forEach(sizeKey => {
      clueDiary[sizeKey].forEach(clueObj => {
          const clueIndexKey = `${clueObj.clueIndex.clueIndexI},${clueObj.clueIndex.clueIndexJ}`;
          if (processedClueIndices.has(clueIndexKey)) {
              // Skip processing for already utilized clueIndex
              return;
          }
          processedClueIndices.add(clueIndexKey);

          const { answer } = clueObj.clueObject;
          let { answerStartingIndexI, answerStartingIndexJ } = clueObj.startingIndex;

          for (let i = 0; i < answer.length; i++) {
              const cellKey = `${answerStartingIndexI},${answerStartingIndexJ}`;
              if (!cells[cellKey]) {
                  cells[cellKey] = {
                      content: answer[i],
                      actualContent: answer[i],
                      status: "UNFILLED",
                      clueNumbers: [clueObj.clueNumber.toString()],
                      isCircled: false,
                      type: "",
                      index: { x: answerStartingIndexJ, y: answerStartingIndexI },
                      indicator: {
                          isStartingIndex: i === 0,
                          type: clueObj.directionFlow,
                      },
                      cellValue: 0,
                  };
              } else {
                  // Cell already exists, so we add the clue number to it
                  cells[cellKey].clueNumbers.push(clueObj.clueNumber.toString());
              }

              // Adjust index based on orientation
              if (clueObj.orientation === "ROW") {
                  answerStartingIndexJ++;
              } else {
                  answerStartingIndexI++;
              }
          }
      });
  });

  // Convert the cells object to an array format
  const cellsArray = Object.values(cells);
  return cellsArray;
}


function generateCellsArrayFromDiary_backup(clueDiary) {
  const cells = {};
  const processedClueIndices = new Set();

  Object.keys(clueDiary).forEach(sizeKey => {
    clueDiary[sizeKey].forEach(clueObj => {
      const clueIndexKey = `${clueObj.clueIndex.clueIndexI},${clueObj.clueIndex.clueIndexJ}`;
      if (processedClueIndices.has(clueIndexKey)) {
        return; // Skip processing for already utilized clueIndex
      }
      processedClueIndices.add(clueIndexKey);

      const { answer } = clueObj.clueObject;
      let { answerStartingIndexI, answerStartingIndexJ } = clueObj.startingIndex;

      for (let i = 0; i < answer.length; i++) {
        const cellKey = `${answerStartingIndexI},${answerStartingIndexJ}`;
        if (!cells[cellKey]) {
          cells[cellKey] = {
            content: answer[i],
            actualContent: answer[i],
            status: "UNFILLED",
            clueNumbers: [clueObj.clueNumber.toString()],
            isCircled: false,
            type: "",
            // Corrected index assignment
            index: { x: answerStartingIndexI, y: answerStartingIndexJ },
            indicator: {
              isStartingIndex: i === 0,
              type: clueObj.directionFlow,
            },
            cellValue: 0,
          };
        } else {
          cells[cellKey].clueNumbers.push(clueObj.clueNumber.toString());
        }

        if (clueObj.orientation === "ROW") {
          answerStartingIndexJ++; // Move right in the same row
        } else {
          answerStartingIndexI++; // Move down in the same column
        }
      }
    });
  });

  return Object.values(cells);
}

function generateCellsArrayFromDiary1(clueDiary) {
  console.log(colors.bgBrightMagenta('********************************************'))
  console.log(colors.bgBrightMagenta('********************************************'))
  console.log(colors.bgBrightMagenta('********************************************'))
  console.log(colors.bgBrightMagenta('********************************************'))
  
  const cells = {};

  // Loop through each clue size category
  Object.keys(clueDiary).forEach(sizeKey => {
    clueDiary[sizeKey].forEach(clueObj => {
      const { answer } = clueObj.clueObject;
      let answerStartingIndexI = clueObj.startingIndex.answerStartingIndexI;
      let answerStartingIndexJ = clueObj.startingIndex.answerStartingIndexJ;

      // Loop through each character in the answer
      for (let i = 0; i < answer.length; i++) {
        // Calculate current position based on orientation and iteration
        let currentIndexI = answerStartingIndexI + (clueObj.orientation === "COLUMN" ? i : 0);
        let currentIndexJ = answerStartingIndexJ + (clueObj.orientation === "ROW" ? i : 0);
        const cellKey = `${currentIndexI},${currentIndexJ}`;
        // console.log('currentIndexI', currentIndexI, 'currentIndexJ', currentIndexJ, 'cellKey', cellKey);
        

        if (!cells[cellKey]) {
          cells[cellKey] = {
            easyIndex: cellKey,
            content: answer[i],
            actualContent: answer[i],
            status: "FILLED",
            clueNumbers: [clueObj.clueNumber.toString()],
            isCircled: false,
            type: "",
            index: { x: currentIndexI, y: currentIndexJ },
            indicator: {
              isStartingIndex: i === 0,
              type: clueObj.directionFlow,
            },
            cellValue: 0,
          };
        } else {
          if (!cells[cellKey].clueNumbers.includes(clueObj.clueNumber.toString())) {
            cells[cellKey].clueNumbers.push(clueObj.clueNumber.toString());
          }
        }
      }
    });
  });

  // Convert the cells object into an array format for easier processing downstream
  return Object.values(cells);
  
}


function generateCellsArrayFromDiary(clueDiary) {
  
    const gridLimit = 9; // Assuming a 9 grid, adjust as necessary
    const cells = {};
  
    // Loop through each clue size category
    Object.keys(clueDiary).forEach(sizeKey => {
      clueDiary[sizeKey].forEach(clueObj => {
        
        const { answer } = clueObj.clueObject;
        let answerStartingIndexI = clueObj.startingIndex.answerStartingIndexI;
        let answerStartingIndexJ = clueObj.startingIndex.answerStartingIndexJ;
        
        // Loop through each character in the answer
        for (let i = 0; i < answer.length; i++) {
          // Calculate current position based on orientation and iteration
          let currentIndexI = answerStartingIndexI + (clueObj.orientation === "COLUMN" ? i : 0);
          let currentIndexJ = answerStartingIndexJ + (clueObj.orientation === "ROW" ? i : 0);
  
          // Skip creating or updating cells beyond the puzzle boundary
          if (currentIndexI >= gridLimit || currentIndexJ >= gridLimit) {
            continue;
          }
  
          const cellKey = `${currentIndexI},${currentIndexJ}`;
          
          if (!cells[cellKey]) {
            cells[cellKey] = {
              content: answer[i],
              status: "FILLED",
              clueNumbers: [clueObj.clueNumber.toString()],
              isCircled: false,
              type: "",
              index: { x: currentIndexI, y: currentIndexJ },
              indicator: {
                isStartingIndex: i === 0,
                type: clueObj.directionFlow,
              },
              cellValue: 0,
              easyIndex: cellKey,
              actualContent: answer[i],
            };
          } else {
            if (!cells[cellKey].clueNumbers.includes(clueObj.clueNumber.toString())) {
              cells[cellKey].clueNumbers.push(clueObj.clueNumber.toString());
            }
          }
          
          // console.log('cellKey', cellKey, 'clueNumbers', cells[cellKey].clueNumbers, 'content: ',cells[cellKey].content);
        }
      });
    });
    
    return Object.values(cells);
  }

  function generateNullCellObjects(gridSnapshot) {
    const nullCells = [];
  
    for (let i = 0; i < gridSnapshot.length; i++) {
      for (let j = 0; j < gridSnapshot[i].length; j++) {
        
        if (gridSnapshot[i][j] === null) {
          console.log(`gridSnapshot[${i}][${j}]`, gridSnapshot[i][j])
          const cellObject = {
            "easyIndex": `${i},${j}`,
            "content": "!",
            "actualContent": "!",
            "status": "BLOCKED",
            "clueNumbers": null,
            "isCircled": false,
            "type": "",
            "index": {
              "x": i,
              "y": j
            },
            "indicator": null,
            "cellValue": null
          };
          nullCells.push(cellObject);
        }
      }
    }
  
    return nullCells;
  }
  

// 

const fetchLargeWordOptionsAgainstXLWord = async (clueDiaryObj) => {
  let usedColumnsArr = [];
  let usedRowsArr = [];
  let largeWordsBranchedFromThisAnchorword;
  console.log("Lets find Large word options agaisnt",clueDiaryObj.clueObject.answer,getLineNumber());
  console.log(colors.yellow(clueDiaryObj));
  let largeWordsConnectedToCurrentXLWord = [];
  if (clueDiary.xl.length === 1) {
    // this will allocate 50% of large sized words quota to this anchor word
    largeWordsBranchedFromThisAnchorword = Math.ceil(
      NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE / 2
    );
  } else {
    // this will allocate 30% of large sized words quota to this anchor word
    largeWordsBranchedFromThisAnchorword = Math.ceil(
      NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE * 0.3
    );
  }
  console.log("NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE ",NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE,getLineNumber());
  console.log(colors.green("largeWordsBranchedFromThisAnchorword",largeWordsBranchedFromThisAnchorword));
  let totalWordsAccomodated;
  switch (clueDiaryObj.orientation) {
    case "ROW":
      console.log("since orientation for ",clueDiaryObj.clueObject.answer,"is ",clueDiaryObj.orientation,"we will fetch possible vertical Large Sized Placements",getLineNumber());
      totalWordsAccomodated = 0;
      while (totalWordsAccomodated != largeWordsBranchedFromThisAnchorword) {
        // totalWordsAccomodated++;
        //pick suitable length of Large sized word:
        let currentClueLength = getRandomizedClueLengthAgainstType("L");
        let clueStartIndex = {
          indexI: null,
          indexJ: null,
        };
        // pick new word startingIndexI and startingIndexJ
        // pick possible Columns, which can be inserted in
        // pick suitable Rows can be inserted in,
        if (clueDiaryObj.startingIndex.answerStartingIndexI === 0) {
          clueStartIndex.indexI = 1;
          let clueIndexJRangeStartingPoint = clueDiaryObj.startingIndex.answerStartingIndexJ;
          let clueIndexJRangeEndingPoint = clueDiaryObj.startingIndex.answerStartingIndexJ + clueDiaryObj.clueObject.answer.length;
          let flag = false;
          let clueIndexJ;
          do {
            clueIndexJ = randomIntBetweenRange(clueIndexJRangeStartingPoint, clueIndexJRangeEndingPoint);
            if (gridSnapshot[1][clueIndexJ] === null) {
              flag = true;
            }
          } while (flag === false);
          console.log(colors.green("OUR SELECTED STARTING I,J FOR LARGE WORD 1 IS",1,clueIndexJ,gridSnapshot[1][clueIndexJ]));

        } else if (clueDiaryObj.startingIndex.answerStartingIndexI === 8) {
          clueStartIndex.indexI = 9 - currentClueLength;
          //
          let clueIndexJRangeStartingPoint = clueDiaryObj.startingIndex.answerStartingIndexJ;
          let clueIndexJRangeEndingPoint = clueDiaryObj.startingIndex.answerStartingIndexJ + clueDiaryObj.clueObject.answer.length;
          let flag = false;
          let clueIndexJ;
          do {
            clueIndexJ = randomIntBetweenRange(clueIndexJRangeStartingPoint,clueIndexJRangeEndingPoint);
            if (gridSnapshot[clueStartIndex.indexI][clueIndexJ] === null) {
              flag = true;
            }
          } while (flag === false);
          console.log("currentClueLength", currentClueLength);
          console.log(colors.green("OUR SELECTED STARTING I,J FOR LARGE WORD: ",clueDiaryObj.clueObject.answer,clueStartIndex.indexI,clueIndexJ,gridSnapshot[clueStartIndex.indexI][clueIndexJ]));
          //
        } else {
          console.log("lets get XL words pre and post lengths now: ");
          console.log("clueDiaryObj.startingIndex.answerStartingIndexI",clueDiaryObj.startingIndex.answerStartingIndexI);
          let post = 8 - clueDiaryObj.startingIndex.answerStartingIndexI;
          let pre = clueDiaryObj.startingIndex.answerStartingIndexI;
          console.log("pre: ",pre,"post",post,"currentClueLength",currentClueLength);
          //
          // first choose jIndex. Then scan it on xIndex w.r.t clueLenth and if if its clean and include
          // intersection word. If so, choose it. Use DoWhile Loop for selection.

          let clueIndexJRangeStartingPoint = clueDiaryObj.startingIndex.answerStartingIndexJ;
          let clueIndexJRangeEndingPoint = clueDiaryObj.startingIndex.answerStartingIndexJ + (clueDiaryObj.clueObject.answer.length - 1);
          let flag = false;
          let clueIndexI;
          let clueIndexJ;
          //// for indexI, determine possible path w.r.t clueLength. Randomly pick a path.
          // determin iStartingIndex, iEndingIndex
          do {
            clueIndexJ = randomIntBetweenRange(clueIndexJRangeStartingPoint,clueIndexJRangeEndingPoint);
            if(usedColumnsArr.includes(clueIndexJ)){
              continue;
            }
            // if(gridSnapshot[clueStartIndex.indexI][clueIndexJ] === null){
            if (true) {
              
              clueStartIndex.indexJ = clueIndexJ;
              let flag2 = false;
              do {
                
                //randomIntBetweenRange(0, (pre-1));
                let startIndexIRange = randomIntBetweenRange(0, (9 - currentClueLength - 1));
                console.log('trying to fetch with clueStartIndex.indexJ', clueStartIndex.indexJ, 'inside fetchLargeWordOptionsAgainstXLWord ** startIndexIRange, ', startIndexIRange, 'currentClueLength', currentClueLength);;
                let sum = startIndexIRange + currentClueLength;
                let wordStructure = "";
                console.log(colors.yellow('sum: ',sum));
                if (sum < 9) {
                  let alphabetsCounts = 0;
                  for (let i = startIndexIRange; i < sum; i++) {
                    if(gridSnapshot[i][clueIndexJ] !== null && gridSnapshot[i][clueIndexJ] != '*' && gridSnapshot[i][clueIndexJ] != '#'){
                      alphabetsCounts++
                    }
                    if (gridSnapshot[i][clueIndexJ] === null) {
                      wordStructure += "-";
                    } else {
                      wordStructure += gridSnapshot[i][clueIndexJ];
                    }
                    
                  }
                  // check if the wordStructure is not clean, contains many alphabets already, it should be ignored.
                  if(alphabetsCounts > 1){
                    console.log(colors.bgYellow('inside alphabetsCount > 1 CONTINUUE BLOCK'))
                    // continue;
                    break;
                  }
                  
                  if(wordStructure.includes('*') ||wordStructure.includes('#')){
                    console.log(colors.bgYellow('inside wordStructure.includes(*# CONTINUUE BLOCK'));
                    // continue;
                    break;
                  }
                  console.log("wordStructure ", wordStructure);
                  wordStructureObj = await analyzeString(wordStructure);
                  console.log(wordStructureObj);
                  if (wordStructureObj.nonDashCharacters.length > 0) {
                    const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
                    if (obj === null) {
                      continue;
                    }
                    console.log("**********************");
                    console.log(obj);
                    console.log("**********************");
                    let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("COLUMN",startIndexIRange,clueIndexJ);
                    console.log("clueStartingIndexDetails",clueStartingIndexDetails);
                    
                    if (typeof clueStartingIndexDetails === "object" && clueStartingIndexDetails !== null) {
                      let newLargeClue = {
                        clueObject: obj,
                        orientation:'COLUMN',
                        answerStartingIndex: {
                          indexI: startIndexIRange,
                          indexJ: clueIndexJ,
                        },
                        clueIndex: clueStartingIndexDetails.clueIndex,
                        directionFlow: clueStartingIndexDetails.directionFlow,
                      };
                      largeWordsConnectedToCurrentXLWord.push(newLargeClue);
                      usedColumnsArr.push(clueIndexJ);
                      totalWordsAccomodated++;
                    } else if (clueStartingIndexDetails === false) {
                      continue;
                    }
                  } else {
                    continue;
                  }
                } else {
                  continue;
                }
                flag2 = true;
              } while (!flag2);
              // flag = true;
            }
            flag = true;
          } while (flag === false);
          console.log("currentClueLength", currentClueLength);
          // console.log(colors.green('OUR SELECTED STARTING I,J FOR LARGE WORD: ',clueDiaryObj.clueObject.answer, clueStartIndex.indexI,clueIndexJ, gridSnapshot[clueStartIndex.indexI][clueIndexJ]));
          //
        }
        // choose on i,j pair as starting point, choose ending i,j pair,
        // pick intersection, prepare am object to that can be sent to DB for a new clue

        // scan for required intersection and a clean path
        // query database for required clue
        // if clue found, determin new clue placement indexes
        // place new clue on gridSnapshot
        // add the counter and move while loop ahead.
      }

      break;
      case "COLUMN":
        console.log("since orientation for ", clueDiaryObj.clueObject.answer, "is ", clueDiaryObj.orientation, "we will fetch possible Horizontal Large Sized Placements");

        totalWordsAccomodated = 0;
        let count = 0;
        while (totalWordsAccomodated != largeWordsBranchedFromThisAnchorword) {
          count++;
          console.log(colors.bgRed('Outerwhile Ietration# ', count));
          let currentClueLength = getRandomizedClueLengthAgainstType("L");
          let firstPossibleRow = clueDiaryObj.startingIndex.answerStartingIndexI;
          let lastPossibleRow = clueDiaryObj.startingIndex.answerStartingIndexI + (clueDiaryObj.clueObject.answer.length - 1);
          let currentClueIndexI = null;
          let currentClueIndexJ = null;
          let correctRowFlag = false;
          console.log('inside outerwhile loop..')
          do {
            currentClueIndexI = randomIntBetweenRange(firstPossibleRow, lastPossibleRow);
            console.log('currentClueIndexI', currentClueIndexI)
            if(usedRowsArr.includes(currentClueIndexI)){
              console.log('usedRowsArr', usedRowsArr, 'currentClueIndexI', currentClueIndexI)
              console.log('userdRows continue ;')
              continue;
            }
            console.log('**inside dowhile currentClueIndexI', currentClueIndexI)
            let wordStructure = '';
            for (let j = 0; j <= 8; j++) {
                if (gridSnapshot[currentClueIndexI][j] === undefined) {
                  break;
                }
                if (gridSnapshot[currentClueIndexI][j] === null) {
                  wordStructure += '-';
                } else {
                  wordStructure += gridSnapshot[currentClueIndexI][j];
                }
              }
              if(wordStructure.includes('#') || wordStructure.includes('*')){
                continue;
              }
              
              // if(!checkWordStructureStringForMultipleNonDashCharacters(wordStructure)){
              //   continue;
              // }

              if(clueDiary.xl[0].orientation === 'ROW' && clueDiary.xl[0].startingIndex.answerStartingIndexI === currentClueIndexI){
                console.log(colors.bgRed('clueIndexI is same as XL Row Word IndexI, continue;'))
                continue;
              }
              

              //analyze this row for clues, clean space otherwise continue;
              let temp = await findSuitableCluePlacement(wordStructure, 'ROW', currentClueIndexI, CLUE_LENGTH_L, true);
              
              
              if (!temp && !temp.selectedOption) {
                // console.log('findSuitableCluePlacement continue ;')
                continue;
              }
              
              if (typeof (temp) === 'object') {
                console.log(colors.blue('wordStructure', wordStructure))
                console.log(colors.bgRed(temp.selectedOption))
                returnWordStructure = temp.selectedOption.wordStructure;
                wordStructureObj = await analyzeString(returnWordStructure);
                console.log(wordStructureObj);
                if (wordStructureObj.nonDashCharacters.length > 0) {
                  const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
                  if(obj === null){
                    console.log('obj === null continuie')
                    continue;
                  }
                  // console.log("********INSDIE THE CURRENT TASK CODE**********");
                  // console.log(colors.red(obj));
                  let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("ROW",temp.selectedOption.answerStartingIndex.answerStartingIndexI,temp.selectedOption.answerStartingIndex.answerStartingIndexJ);
                  currentClueIndexJ = temp?.startingIndex;
                  let newLargeClue = {
                      clueObject: obj,
                      orientation:'ROW',
                      answerStartingIndex: {
                        indexI: temp.selectedOption.answerStartingIndex.answerStartingIndexI,
                        indexJ: temp.selectedOption.answerStartingIndex.answerStartingIndexJ,
                      },
                      //the clueIndex returned from findSuitableCluePlacement is incorrect so we will call getClueIndexAgainstAnswerStartingIndex to get clueIndex
                      // clueIndex: temp.selectedOption.clueIndex,
                      clueIndex: clueStartingIndexDetails?.clueIndex,
                      // directionFlow: temp.selectedOption.directionFlow,
                      directionFlow: clueStartingIndexDetails?.directionFlow
                    };
                    largeWordsConnectedToCurrentXLWord.push(newLargeClue);
                    usedRowsArr.push(currentClueIndexI);
                    totalWordsAccomodated++;
                  
                  // console.log("*********@@@@@@********");
                  
                }
              }
              correctRowFlag = true;
            
          } while (!correctRowFlag);
          // totalWordsAccomodated = largeWordsBranchedFromThisAnchorword;
        }
        console.log(colors.bgCyan('/////////////////////////////////////'))
        break;
      
    default:
      break;
  }
  console.log(colors.yellow(largeWordsConnectedToCurrentXLWord));
  console.log("###");
  return largeWordsConnectedToCurrentXLWord;
  
};


function generateWordStructure(i, j, directionFlow) {
  let wordStructure = "";
  const height = gridSnapshot.length;
  const width = gridSnapshot[0].length;

  function addCellToWordStructure(x, y) {
      if (x >= 0 && x < height && y >= 0 && y < width) {
          if (gridSnapshot[x][y] === "*" || gridSnapshot[x][y] === "#") {
              return false; // Encounters a clue marker, halt.
          }
          wordStructure += gridSnapshot[x][y] === null ? "-" : gridSnapshot[x][y];
      } else {
          return false; // Stop if out of bounds
      }
      return true;
  }

  switch (directionFlow) {
      case "RIGHT":
          for (let col = j + 1; col < width; col++) {
              if (!addCellToWordStructure(i, col)) break;
          }
          break;
      case "DOWN":
          for (let row = i + 1; row < height; row++) {
              if (!addCellToWordStructure(row, j)) break;
          }
          break;
          case "DOWN_RIGHT":
            x = i + 1; // Start from one cell down
            if (gridSnapshot[x] && gridSnapshot[x][j] != "*" && gridSnapshot[x][j] != "#") {
                wordStructure += gridSnapshot[x][j] === null ? "-" : gridSnapshot[x][j]; // Include first cell
                for (y = j + 1; y < gridSnapshot[0].length && gridSnapshot[x][y] != "*" && gridSnapshot[x][y] != "#"; y++) {
                    wordStructure += gridSnapshot[x][y] === null ? "-" : gridSnapshot[x][y];
                }
            }
            break;
            case "RIGHT_DOWN":
              y = j + 1; // Start from one cell right
              if (gridSnapshot[i][y] != "*" && gridSnapshot[i][y] != "#") {
                  wordStructure += gridSnapshot[i][y] === null ? "-" : gridSnapshot[i][y]; // Include first cell
                  for (x = i + 1; x < gridSnapshot.length && gridSnapshot[x][y] != "*" && gridSnapshot[x][y] != "#"; x++) {
                      wordStructure += gridSnapshot[x][y] === null ? "-" : gridSnapshot[x][y];
                  }
              }
              break;
        case "UP_RIGHT":
          x = i - 1; // Move one cell up
          if (x >= 0 && gridSnapshot[x][j] != "*" && gridSnapshot[x][j] != "#") { // Ensure x is within bounds and not starting on a clue marker
              wordStructure += gridSnapshot[x][j] === null ? "-" : gridSnapshot[x][j]; // Include the cell directly above
              for (y = j + 1; y < gridSnapshot[x].length && gridSnapshot[x][y] != "*" && gridSnapshot[x][y] != "#"; y++) {
                  wordStructure += gridSnapshot[x][y] === null ? "-" : gridSnapshot[x][y];
              }
          }
          break;
          case "LEFT_DOWN":
            y = j - 1; // Start from one cell to the left
            if (y >= 0 && gridSnapshot[i][y] != "*" && gridSnapshot[i][y] != "#") { // Ensure y is within bounds and not starting on a clue marker
                wordStructure += gridSnapshot[i][y] === null ? "-" : gridSnapshot[i][y]; // Include the cell directly to the left
                for (x = i + 1; x < gridSnapshot.length && gridSnapshot[x][y] != "*" && gridSnapshot[x][y] != "#"; x++) {
                    wordStructure += gridSnapshot[x][y] === null ? "-" : gridSnapshot[x][y];
                }
            }
            break;
  }

  return wordStructure.length > 0 && wordStructure.includes('-') ? wordStructure : null;
}

function getOrientationFromDirectionFlow(directionFlow) {
  const rowFlows = ['RIGHT', 'UP_RIGHT', 'DOWN_RIGHT'];
  const columnFlows = ['DOWN', 'RIGHT_DOWN', 'LEFT_DOWN'];
  
  if (rowFlows.includes(directionFlow)) {
      return 'ROW';
  } else if (columnFlows.includes(directionFlow)) {
      return 'COLUMN';
  } else {
      throw new Error('Invalid directionFlow');
  }
}

const scanAndFillRemainingCavities = async () => {
  const directionFlows = ['RIGHT', 'UP_RIGHT', 'DOWN_RIGHT', 'DOWN', 'RIGHT_DOWN', 'LEFT_DOWN'];
  for (let i = 0; i < gridSnapshot.length; i++) {
    for (let j = 0; j < gridSnapshot[i].length; j++) {
      if(gridSnapshot[i][j] !== null){
        continue;
      }
      let availableWordStructuresForThisSpaceArr = [];
      for(const flow of directionFlows){
        let wordStructure = generateWordStructure(i, j, flow);
        if(wordStructure !== null){
          availableWordStructuresForThisSpaceArr.push({directionFlow: flow, wordStructure});
          // console.log(colors.bgBlue(`${i},${j} = ${gridSnapshot[i][j]} : ${flow} => `, wordStructure));
        }
      }
      let sortedArr = availableWordStructuresForThisSpaceArr.sort((a, b) => {
        const dashCountA = (a.wordStructure.match(/-/g) || []).length;
        const dashCountB = (b.wordStructure.match(/-/g) || []).length;
        return dashCountB - dashCountA; // Sort in descending order of dash counts
    });
      // console.log(colors.bgMagenta(sortedArr))
      for(const item of sortedArr){
        let wordStructureObj = await analyzeString(item.wordStructure);
          const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
          // console.log("**********************");
          // console.log(obj);
          // console.log("**********************");
          if (typeof obj === "object" && obj !== null) {
               gridSnapshotFillerUtil(getOrientationFromDirectionFlow(item.directionFlow), obj, i, j, item.directionFlow);
               let clueMarker = getOrientationFromDirectionFlow(item.directionFlow) === 'ROW' ? '#':'*';
               gridSnapshot[i][j] = clueMarker;

               break;
               printGrid();
          }
      }
    }
  }
};

function isSurroundedByClueMarkers(i, j) {
  const clueMarkers = ['*', '#'];
  const maxRow = gridSnapshot.length - 1;
  const maxCol = gridSnapshot[0].length - 1;
  
  // Check left
  if (j > 0 && !clueMarkers.includes(gridSnapshot[i][j - 1])) return false;
  
  // Check right
  if (j < maxCol && !clueMarkers.includes(gridSnapshot[i][j + 1])) return false;
  
  // Check top
  if (i > 0 && !clueMarkers.includes(gridSnapshot[i - 1][j])) return false;
  
  // Check bottom
  if (i < maxRow && !clueMarkers.includes(gridSnapshot[i + 1][j])) return false;
  
  // Check top-left
  if (i > 0 && j > 0 && !clueMarkers.includes(gridSnapshot[i - 1][j - 1])) return false;
  
  // Check top-right
  if (i > 0 && j < maxCol && !clueMarkers.includes(gridSnapshot[i - 1][j + 1])) return false;
  
  // Check bottom-left
  if (i < maxRow && j > 0 && !clueMarkers.includes(gridSnapshot[i + 1][j - 1])) return false;
  
  // Check bottom-right
  if (i < maxRow && j < maxCol && !clueMarkers.includes(gridSnapshot[i + 1][j + 1])) return false;
  
  // If none of the conditions to return false are met, then the cell is surrounded by clue markers.
  return true;
}

async function processNullCellsAndFillClues() {
  
  console.log(colors.bgBlue('processNullCellsAndFillClues'));
  const directionFlows = ['RIGHT', 'LEFT_DOWN', 'DOWN', 'UP_RIGHT', 'DOWN_RIGHT']; // Assuming 'LEFT_DOWN' as a valid direction for your case
  const blockedCellsArr = [];
  const potentiallyFillableCells = [];

  // Iterate through each cell in the grid
  for (let i = 0; i < gridSnapshot.length; i++) {
    for (let j = 0; j < gridSnapshot[i].length; j++) {
      // Skip non-null cells
      if (gridSnapshot[i][j] !== null) continue;

      // Check if surrounded by clue markers
      if (isSurroundedByClueMarkers(i, j)) {
        blockedCellsArr.push({ i, j, content: '!' });
        continue;
      }

      // Attempt to find a word structure and clue for each direction
      for (const flow of directionFlows) {
        const wordStructure = generateWordStructureAroundNull(i, j, flow);
        if (!wordStructure) continue; // Skip if no word structure was generated
        console.log(colors.bgRed('i, j, flow, ', i, j, flow, wordStructure));
        const clue = await getClueForFilledWordStructure (wordStructure);
        if (clue) {
          potentiallyFillableCells.push({ clueIndex: {clueIndexI: i, clueIndexJ: j}, directionFlow: flow, wordStructure, clue });
          break; // Stop checking other directions if a clue has been found
        }
      }
    }
  }

  // Now process potentiallyFillableCells to update the grid
  // potentiallyFillableCells.map(cell => {
    for(const cell of potentiallyFillableCells){
      let orientation = getOrientationFromDirectionFlow(cell?.directionFlow);
      cell.answerStartingIndex = getAnswerCoordinatesAgainstClue(orientation, cell.clueIndex.clueIndexI, cell.clueIndex.clueIndexJ, cell?.directionFlow, cell.clue);
      console.log('cell.answerStartingIndex', cell.answerStartingIndex)
      gridSnapshotFillerUtil(orientation, cell.clue, cell.clueIndex.clueIndexI, cell.clueIndex.clueIndexJ, cell?.directionFlow);
      gridSnapshot[cell.clueIndex.clueIndexI][cell.clueIndex.clueIndexJ] = orientation === 'ROW' ? '#':'*';
    };
  

  // Optionally handle blockedCellsArr
  // ...

  console.log('Blocked cells:', blockedCellsArr);
  console.log('Potentially fillable cells:', potentiallyFillableCells);
  console.log('finishing processNullCellsAndFillClues task..')
}

// Example placeholder function, to be replaced with your actual database query logic
async function findClueInDatabase(wordStructure) {
  console.log('findClueInDatabase', wordStructure)
  // Simulate database query with a placeholder
  // Return null or clue object based on your database query result
  return null; // Placeholder: always returns null in this example
}

function generateWordStructureAroundNull(i, j, directionFlow) {
  let wordStructure = "";
  const height = gridSnapshot.length;
  const width = gridSnapshot[0].length;

  // Helper function to check and add a cell to the word structure
  function addCellToWordStructure(x, y) {
      if (x < 0 || x >= height || y < 0 || y >= width || gridSnapshot[x][y] === "*" || gridSnapshot[x][y] === "#") {
          return false; // Boundary or block check
      }
      wordStructure += gridSnapshot[x][y] ?? "-";
      return true;
  }

  // Adjust to ensure null cell is not part of any word structure
  switch (directionFlow) {
      case "RIGHT":
          // Start from the next cell to the right
          for (let col = j + 1; col < width; col++) {
              if (!addCellToWordStructure(i, col)) break;
          }
          break;
      case "UP_RIGHT":
          // Start from the cell above the null cell, moving horizontally right
          if (i > 0) {
              for (let col = j; col < width; col++) {
                  if (!addCellToWordStructure(i - 1, col)) break;
              }
          }
          break;
      case "DOWN_RIGHT":
          // Start from the cell below the null cell, moving horizontally right
          if (i < height - 1) {
              for (let col = j; col < width; col++) {
                  if (!addCellToWordStructure(i + 1, col)) break;
              }
          }
          break;
      case "DOWN":
          // Start from the next cell down
          for (let row = i + 1; row < height; row++) {
              if (!addCellToWordStructure(row, j)) break;
          }
          break;
      case "LEFT_DOWN":
          // Start from the cell to the left of the null cell, moving vertically down
          if (j > 0) {
              for (let row = i; row < height; row++) {
                  if (!addCellToWordStructure(row, j - 1)) break;
              }
          }
          break;
      case "RIGHT_DOWN":
          // Start from the cell to the right of the null cell, moving vertically down
          if (j < width - 1) {
              for (let row = i; row < height; row++) {
                  if (!addCellToWordStructure(row, j + 1)) break;
              }
          }
          break;
  }

  return wordStructure.length > 0 ? wordStructure : null;
}






const scanGridForPossibleClues = async (orientation) => {
  let str = '';
  switch(orientation){
    case 'ROW':
      for(let i  = 0 ; i < 9 ; i++){
        str = '';
        for(let j = 0; j < 9 ; j++){
          //get full row wordStructure and make break it into possible clue options:
          if(gridSnapshot[i][j] === null){
            str += '-';
          }else{
            str += gridSnapshot[i][j];  
          }
          
        }
        console.log(str);
      }
      break;
    case 'COLUMN':
      break;
    default:
      break;
  }
};

function identifyEmptySpaces(gridSnapshot) {
  const potentialPlacements = {
      rows: [],
      columns: []
  };

  // Row-wise analysis
  gridSnapshot.forEach((row, rowIndex) => {
      const rowString = row.join('');
      let match;
      const regex = /\.{2,}/g; // Regex to find sequences of two or more dots
      while ((match = regex.exec(rowString)) !== null) {
          potentialPlacements.rows.push({
              start: match.index,
              length: match[0].length,
              rowIndex: rowIndex
          });
      }
  });

  // Column-wise analysis
  const columnCount = gridSnapshot[0].length;
  for (let colIndex = 0; colIndex < columnCount; colIndex++) {
      let columnString = '';
      for (let rowIndex = 0; rowIndex < gridSnapshot.length; rowIndex++) {
          columnString += gridSnapshot[rowIndex][colIndex];
      }
      let match;
      const regex = /\.{2,}/g; // Regex to find sequences of two or more dots
      while ((match = regex.exec(columnString)) !== null) {
          potentialPlacements.columns.push({
              start: match.index,
              length: match[0].length,
              colIndex: colIndex
          });
      }
  }

  return potentialPlacements;
}

// function analyzeWordStructureAndSuggestClue(wordStructure) {
//   const sizeRanges = {
//       XL: { min: 8, max: 9 },
//       L: { min: 5, max: 7 },
//       M: { min: 4, max: 4 },
//       S: { min: 1, max: 3 },
//   };

//   let bestSegment = '';
//   let bestSegmentIndex = -1; // Position of best segment within the word structure
//   let totalIntersections = 0;
//   let startingIndex = -1;

//   // Split the wordStructure on clue markers to handle segments separately
//   const segments = wordStructure.split(/[*#]/);
//   segments.forEach((segment, index) => {
//       const intersectionCount = (segment.match(/[A-Z]/gi) || []).length;
//       if (intersectionCount > 0 && segment.length > bestSegment.length) {
//           bestSegment = segment;
//           bestSegmentIndex = index;
//           totalIntersections = intersectionCount;
//           startingIndex = wordStructure.indexOf(segment);
//       }
//   });

//   const determineClueSize = (length) => {
//       for (const [size, range] of Object.entries(sizeRanges)) {
//           if (length >= range.min && length <= range.max) {
//               return size;
//           }
//       }
//       return 'S'; // Default to S if no range is matched
//   };

//   const clueAnswerLength = bestSegment.length;
//   const clueSize = determineClueSize(clueAnswerLength);

//   return {
//       clueAnswerStructure: bestSegment,
//       clueAnswerLength: clueAnswerLength,
//       intersections: totalIntersections,
//       clueSize: clueSize,
//       startingIndex: startingIndex // Include starting index of the clue
//   };
// }

// function analyzeWordStructureAndSuggestClue(wordStructure, orientation, index, gridSnapshot) {
//   const sizeRanges = {
//       XL: { min: 8, max: 9 },
//       L: { min: 5, max: 7 },
//       M: { min: 4, max: 4 },
//       S: { min: 1, max: 3 },
//   };

//   let bestSegment = '';
//   let totalIntersections = 0;
//   let startingIndex = -1;
//   let clueIndex = { indexI: -1, indexJ: -1 }; // Adjusted for consistency

//   // Identify the longest segment that includes at least one letter (intersection)
//   const segments = wordStructure.split(/[*#]/);
//   segments.forEach((segment, segmentIndex) => {
//       const intersectionCount = (segment.match(/[A-Z]/gi) || []).length;
//       if (intersectionCount > 0 && segment.length > bestSegment.length) {
//           bestSegment = segment;
//           totalIntersections = intersectionCount;
//           startingIndex = wordStructure.indexOf(segment, startingIndex + 1); // Update starting index for next search
//       }
//   });

//   const clueAnswerLength = bestSegment.length;
//   const clueSize = Object.keys(sizeRanges).find(size => clueAnswerLength >= sizeRanges[size].min && clueAnswerLength <= sizeRanges[size].max) || 'S';

//   // Determine clue placement based on orientation and constraints
//   const determineClueIndex = () => {
//       if (orientation === 'ROW') {
//           // For ROW orientation, check for valid placements around the start of the segment
//           if (startingIndex > 0 && gridSnapshot[index][startingIndex - 1] === '.') {
//               return { indexI: index, indexJ: startingIndex - 1 };
//           } else if (index > 0 && gridSnapshot[index - 1][startingIndex] === '.') {
//               return { indexI: index - 1, indexJ: startingIndex };
//           } else if (index < gridSnapshot.length - 1 && gridSnapshot[index + 1][startingIndex] === '.') {
//               return { indexI: index + 1, indexJ: startingIndex };
//           }
//       } else if (orientation === 'COLUMN') {
//           // For COLUMN orientation, check for valid placements around the start of the segment
//           if (index > 0 && gridSnapshot[index - 1][startingIndex] === '.') {
//               return { indexI: index - 1, indexJ: startingIndex };
//           } else if (startingIndex > 0 && gridSnapshot[index][startingIndex - 1] === '.') {
//               return { indexI: index, indexJ: startingIndex - 1 };
//           } else if (startingIndex < gridSnapshot[index].length - 1 && gridSnapshot[index][startingIndex + 1] === '.') {
//               return { indexI: index, indexJ: startingIndex + 1 };
//           }
//       }
//       return null; // No valid clue index found
//   };

//   clueIndex = determineClueIndex();

//   if (clueIndex) {
//       return {
//           clueAnswerStructure: bestSegment,
//           clueAnswerLength: clueAnswerLength,
//           intersections: totalIntersections,
//           clueSize: clueSize,
//           startingIndex: startingIndex,
//           clueIndex: clueIndex // Now includes indexI and indexJ
//       };
//   } else {
//       // No valid placement found
//       return null;
//   }
// }


const analyzeWordStructureAndSuggestClue1 = async (wordStructure, orientation, index, gridSnapshot) => {
  const sizeRanges = {
    XL: { min: 8, max: 9 },
    L: { min: 5, max: 7 },
    M: { min: 4, max: 4 },
    S: { min: 1, max: 3 },
  };

  // Immediately return null if wordStructure is fully occupied without placeholders
  if (!wordStructure.includes('.')) {
    return null;
  }

  let bestSegment = '';
  let totalIntersections = 0;
  let startingIndex = -1;
  let clueIndex = { indexI: -1, indexJ: -1 };

  // Adjustments for correctly identifying segments
  const segments = wordStructure.split(/[*#]/).filter(Boolean);
  segments.forEach((segment, segmentIndex) => {
    const intersectionCount = (segment.match(/[A-Z]/gi) || []).length;
    if (intersectionCount > 0 && segment.length > bestSegment.length) {
      bestSegment = segment;
      totalIntersections = intersectionCount;
      // Find the actual starting index of this segment within the full word structure
      startingIndex = wordStructure.indexOf(segment);
    }
  });

  if (!bestSegment) {
    return null; // No valid segment found
  }

  const clueAnswerLength = bestSegment.length;
  const clueSize = Object.keys(sizeRanges).find(size =>
    clueAnswerLength >= sizeRanges[size].min && clueAnswerLength <= sizeRanges[size].max) || 'S';

  // Correctly determining clueIndex based on the grid's representation
  const determineClueIndex = () => {
    if (orientation === 'ROW') {
      // Additional logic for ROW orientation
    } else if (orientation === 'COLUMN') {
      // Additional logic for COLUMN orientation
    }
    return null; // No valid clue index found
  };

  clueIndex = determineClueIndex();

  if (clueIndex) {
    return {
      clueAnswerStructure: bestSegment,
      clueAnswerLength: clueAnswerLength,
      intersections: totalIntersections,
      clueSize: clueSize,
      startingIndex: startingIndex,
      clueIndex: clueIndex // Includes indexI and indexJ
    };
  } else {
    // No valid placement found
    return null;
  }
};

const analyzeWordStructureAndSuggestClue_ = (wordStructure, orientation, index, gridSnapshot) => {
  const sizeRanges = {
    XL: { min: 8, max: 9 },
    L: { min: 5, max: 7 },
    M: { min: 4, max: 4 },
    S: { min: 1, max: 3 },
  };

  // Check for full occupancy without any placeholders; return null if detected
  if (!wordStructure.includes('-') && wordStructure.match(/[A-Z]/gi).length === wordStructure.length) {
    return null; // No room for additional clues
  }

  let bestSegment = '';
  let totalIntersections = 0;
  let startingIndex = -1;
  let clueIndex = { indexI: -1, indexJ: -1 };

  // Adjustments for correctly identifying segments
  const segments = wordStructure.split(/[*#]/).filter(Boolean);
  segments.forEach(segment => {
    const intersectionCount = (segment.match(/[A-Z]/gi) || []).length;
    if (intersectionCount > 0 && segment.length > bestSegment.length) {
      bestSegment = segment;
      totalIntersections = intersectionCount;
      startingIndex = wordStructure.indexOf(segment); // Update starting index
    }
  });

  if (!bestSegment) {
    return null; // No valid segment found
  }

  const clueAnswerLength = bestSegment.length;
  const clueSize = Object.keys(sizeRanges).find(size =>
    clueAnswerLength >= sizeRanges[size].min && clueAnswerLength <= sizeRanges[size].max) || 'S';

  // Determine clue placement based on orientation and constraints
  const determineClueIndex = () => {
    if (orientation === 'ROW') {
      // Check left, above, and below the starting index for a suitable clue index placement
      if (startingIndex > 0 && gridSnapshot[index][startingIndex - 1] === null) {
        return { indexI: index, indexJ: startingIndex - 1 };
      } else if (index > 0 && gridSnapshot[index - 1][startingIndex] === null) {
        return { indexI: index - 1, indexJ: startingIndex };
      } else if (index < gridSnapshot.length - 1 && gridSnapshot[index + 1][startingIndex] === null) {
        return { indexI: index + 1, indexJ: startingIndex };
      }
    } else if (orientation === 'COLUMN') {
      // Check above, left, and right of the starting index for a suitable clue index placement
      if (index > 0 && gridSnapshot[index - 1][startingIndex] === null) {
        return { indexI: index - 1, indexJ: startingIndex };
      } else if (startingIndex > 0 && gridSnapshot[index][startingIndex - 1] === null) {
        return { indexI: index, indexJ: startingIndex - 1 };
      } else if (startingIndex < gridSnapshot[index].length - 1 && gridSnapshot[index][startingIndex + 1] === null) {
        return { indexI: index, indexJ: startingIndex + 1 };
      }
    }
    return null; // No valid clue index found
  };

  clueIndex = determineClueIndex();

  if (clueIndex) {
    return {
      clueAnswerStructure: bestSegment,
      clueAnswerLength: clueAnswerLength,
      intersections: totalIntersections,
      clueSize: clueSize,
      startingIndex: startingIndex,
      clueIndex: clueIndex, // Includes indexI and indexJ
      orientation: orientation // Adding orientation as requested
    };
  } else {
    // No valid placement found
    return null;
  }
};





const analyzeWordStructureAndSuggestClue__ = (wordStructure, orientation, index, gridSnapshot) => {
  const sizeRanges = {
    XL: { min: 8, max: 9 },
    L: { min: 5, max: 7 },
    M: { min: 4, max: 4 },
    S: { min: 1, max: 3 },
  };

  // Check for full occupancy without any placeholders; return null if detected
  if (!wordStructure.includes('-') && wordStructure.match(/[A-Z]/gi).length === wordStructure.length) {
    return null; // No room for additional clues
  }

  let segments = wordStructure.split(/[*#]/).map((segment, i) => {
    // Calculate segment's start index considering previous markers and segments
    let start = wordStructure.slice(0, wordStructure.indexOf(segment)).replace(/[A-Z]/g, '-').length;
    return { segment, start, intersections: (segment.match(/[A-Z]/gi) || []).length };
  }).filter(s => s.intersections <= 2); // Filter out segments with more than 2 intersections

  if (segments.length === 0) {
    return null;
  }

  // Sort segments by potential size (longest first) and by fewer intersections
  segments.sort((a, b) => b.segment.length - a.segment.length || a.intersections - b.intersections);

  // Choose the best segment
  let best = segments[0];

  // Determine clue size
  let clueSize = Object.keys(sizeRanges).find(size => 
    best.segment.length >= sizeRanges[size].min && best.segment.length <= sizeRanges[size].max) || 'S';

  // Determine startingIndex and clueIndex based on orientation
  let startingIndex = orientation === 'ROW' ? { indexI: index, indexJ: best.start } : { indexI: best.start, indexJ: index };
  let clueIndex = { indexI: startingIndex.indexI, indexJ: startingIndex.indexJ };

  // Adjust clueIndex for ROW orientation, considering left side for the marker
  if (orientation === 'ROW' && startingIndex.indexJ > 0) {
    clueIndex.indexJ -= 1;
  } else if (orientation === 'COLUMN' && startingIndex.indexI > 0) {
    // Adjust for COLUMN orientation, considering above for the marker
    clueIndex.indexI -= 1;
  }

  // Adjust clue size based on marker placement and actual segment length
  let actualLength = best.segment.length;
  if (orientation === 'ROW' && wordStructure[startingIndex.indexJ] === '-') actualLength--;
  else if (orientation === 'COLUMN' && wordStructure[startingIndex.indexI] === '-') actualLength--;

  clueSize = Object.keys(sizeRanges).find(size => 
    actualLength >= sizeRanges[size].min && actualLength <= sizeRanges[size].max) || 'S';

  return {
    clueAnswerStructure: best.segment,
    clueAnswerLength: actualLength,
    intersections: best.intersections,
    clueSize: clueSize,
    startingIndex,
    clueIndex,
    orientation
  };
};

const analyzeWordStructureAndSuggestClue = (wordStructure, orientation, index, gridSnapshot) => {
  const sizeRanges = {
    XL: { min: 8, max: 9 },
    L: { min: 5, max: 7 },
    M: { min: 4, max: 4 },
    S: { min: 1, max: 3 },
  };

  // Exclude segments fully occupied by letters or empty segments
  if (!wordStructure.includes('-') || wordStructure.match(/^[A-Z]*$/) || wordStructure === '') {
    return null;
  }

  let segments = wordStructure.split(/[*#]/).map(segment => {
    let start = wordStructure.indexOf(segment);
    return { segment, start, intersections: (segment.match(/[A-Z]/gi) || []).length };
  }).filter(s => s.segment !== '' && s.intersections <= 2); // Ensure non-empty segments and limit intersections

  if (segments.length === 0) {
    return null;
  }

  // Prioritize by segment length and fewer intersections
  segments.sort((a, b) => b.segment.length - a.segment.length || a.intersections - b.intersections);

  let best = segments[0];

  // Determine clue size based on the best segment's length
  let clueSize = Object.keys(sizeRanges).find(size => 
    best.segment.length >= sizeRanges[size].min && best.segment.length <= sizeRanges[size].max) || 'S';

  // Calculate startingIndex based on orientation and the best segment's start
  let startingIndex = orientation === 'ROW' ? { indexI: index, indexJ: best.start } : { indexI: best.start, indexJ: index };

  // Exclude '-' from the clueAnswerLength if it's the first character of a segment
  let actualLength = best.segment.length - (best.segment[0] === '-' ? 1 : 0);

  clueSize = Object.keys(sizeRanges).find(size => 
    actualLength >= sizeRanges[size].min && actualLength <= sizeRanges[size].max) || 'S';

  // Return the clue information, excluding clueIndex as per your request
  return {
    clueAnswerStructure: best.segment,
    clueAnswerLength: actualLength,
    intersections: best.intersections,
    clueSize: clueSize,
    startingIndex,
    orientation
  };
};





const letsAddMoreFillers = async (orientation, clueSize) => {
  console.log(colors.bgMagenta(`letsAddMoreFillers ${clueSize} ${orientation}`));
  // const orientation = randomlyPickBetweenRowAndColumn();
  let wordStructure;
  let nextPossibleClues = {};
  nextPossibleClues.xl = [];
  nextPossibleClues.l = [];
  nextPossibleClues.m = [];
  nextPossibleClues.s = [];
  const arr = [];

  
  switch(orientation){
    case 'ROW':
      
      for(let i  = 0 ; i < 9 ; i++){
        wordStructure = '';
        for(let j = 0 ; j < 9 ; j++){
          if(gridSnapshot[i][j] === null){
            wordStructure += '-';
          }else{
            wordStructure += gridSnapshot[i][j];
          }
        }
        
        const clueSpecs = await analyzeWordStructureAndSuggestClue(wordStructure, 'ROW', i, gridSnapshot)
        // console.log('wordstructure:', wordStructure)  
        //   console.log('clueSpecs',clueSpecs);
        //   console.log(colors.blue('######################################'));
          if(clueSpecs?.clueSize === clueSize){
            arr.push(clueSpecs);
          }
      }
      break;
    case 'COLUMN':
      for(let i  = 0 ; i < 9 ; i++){
        wordStructure = '';
        for(let j = 0 ; j < 9 ; j++){
          if(gridSnapshot[j][i] === null){
            wordStructure += '-';
          }else{
            wordStructure += gridSnapshot[j][i];
          }
        }
        
        const clueSpecs = await analyzeWordStructureAndSuggestClue(wordStructure, 'COLUMN', i, gridSnapshot)
        // console.log('wordstructure:', wordStructure)  
        //   console.log('clueSpecs',clueSpecs);
        //   console.log(colors.blue('#############COLUMN CASE################'));
          if(clueSpecs?.clueSize === clueSize){
            arr.push(clueSpecs);
          }
          // printGrid();
      }
      
      break;
  }
  
  return arr;
}



const scanAndFillLastBorders = async () => {
  // this function tries to fill last row and column with XL sized word if possible. if these lines already contain a clue marker, it will not fil that line.
  
    // let lastRowStr = '';
    // let lastColumnStr = '';
    // for(let j = 0; j < 9 ; j++){
    //   //get full row wordStructure and make break it into possible clue options:
    //   if(gridSnapshot[8][j] === null){
    //     lastRowStr += '-';
    //   }else{
    //     lastRowStr += gridSnapshot[8][j];  
    //   }
    // }
    // if(!(lastRowStr.includes('#') || lastRowStr.includes('*'))){
    //   let temp = await findSuitableCluePlacement(lastRowStr, 'ROW', 8, CLUE_LENGTH_XL, true);
    //   console.log(colors.bgGreen(temp))
    // }
    

      

    //   for(let j = 0; j < 9 ; j++){
    //     //get full row wordStructure and make break it into possible clue options:
    //     if(gridSnapshot[j][8] === null){
    //       lastColumnStr += '-';
    //     }else{
    //       lastColumnStr += gridSnapshot[j][8];  
    //     }
    //   }

    // console.log('lastRowStr',lastRowStr);
    // console.log('lastColumnStr', lastColumnStr);
    // if(!(lastColumnStr.includes('#') || lastColumnStr.includes('*'))){
    //   temp = await findSuitableCluePlacement(lastColumnStr, 'COLUMN', 8, CLUE_LENGTH_XL, true);
    //   console.log(colors.bgGreen(temp))
    // }
    
    // Assuming letsAddMoreFillers is a function that returns a list of clues to be filled
    await processClueFilling();
    

}

const processClueFilling = async ()=>{
  console.log('inside processClueFilling')
  letsAddMoreFillers('ROW', 'XL').then(async res => {
    console.log(colors.bgBlue(res));
    for(const clue of res){
      let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("ROW", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
      console.log('clueStartingIndexDetails', clueStartingIndexDetails)
  
      if (!clueStartingIndexDetails) { // No suitable clue index found
        continue;
        console.log(colors.bgRed('No suitable clue index found, checking if adjustment is needed'));
        
        // Check if the first character of the clueAnswerStructure is not '-'
        if (clue.clueAnswerStructure[0] !== '-') {
          // The first character is already filled, adjust accordingly
          console.log(colors.bgRed('First character is already filled, adjusting clue index and answer structure'));
          // Adjust the clue's answer structure by trimming the first character and adjusting the starting index
          let adjustedClueAnswerStructure = clue.clueAnswerStructure.substring(1);
          // Adjust starting index for ROW orientation - increment indexJ for ROW (or indexI for COLUMN if implementing for COLUMN)
          let adjustedStartingIndexJ = clue.startingIndex.indexJ + 1;
          
          console.log(colors.bgRed('Adjusted clue answer structure:', adjustedClueAnswerStructure));
          // Proceed with adjusted clue details
          // Ensure you adjust the clue object and handling as needed here
          clue.clueAnswerStructure = adjustedClueAnswerStructure;
          clue.startingIndex.indexJ = adjustedStartingIndexJ;
          clue.clueAnswerLength = adjustedClueAnswerStructure.length;
          // 
          let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
          console.log('wordStructureObj', wordStructureObj);
          const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
          console.log("**********************");
          console.log(obj);
          console.log("**********************");
          if (typeof clueStartingIndexDetails === "object" && clueStartingIndexDetails !== null) {
              gridSnapshotFillerUtil('ROW', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
              
          }
          // 
          
  
        } else {
          // Proceed with the clue as is, since the first character is '-' and no suitable index was found
          console.log(colors.bgRed('Proceeding with original clue details as no adjustment is required.'));
        }
      } else {
        // Suitable clue index found, proceed as normal
        console.log(colors.bgRed('Suitable clue index found:', clueStartingIndexDetails));
        let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
        console.log('wordStructureObj', wordStructureObj);
        const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
        console.log("**********************");
        console.log(obj);
        console.log("**********************");
        if (typeof clueStartingIndexDetails === "object" && clueStartingIndexDetails !== null) {
            gridSnapshotFillerUtil('ROW', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
        }
      }
      printGrid();
    };
    console.log(colors.bgMagenta('letsAddMoreFillers XL COLUMN'));
    // Handling XL clues for COLUMN orientation
  letsAddMoreFillers('COLUMN', 'XL').then(async res => {
    console.log(colors.bgBlue(res));
    for (const clue of res) {
      let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("COLUMN", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
      console.log('clueStartingIndexDetails', clueStartingIndexDetails);
  
      if (!clueStartingIndexDetails) { // No suitable clue index found
        continue;
        console.log(colors.bgRed('No suitable clue index found, checking if adjustment is needed'));
  
        // Check if the first character of the clueAnswerStructure is not '-'
        if (clue.clueAnswerStructure[0] !== '-') {
          // The first character is already filled, adjust accordingly
          console.log(colors.bgRed('First character is already filled, adjusting clue index and answer structure'));
          // Adjust the clue's answer structure by trimming the first character and adjusting the starting index
          let adjustedClueAnswerStructure = clue.clueAnswerStructure.substring(1);
          // Adjust starting index for COLUMN orientation - increment indexI for COLUMN
          let adjustedStartingIndexI = clue.startingIndex.indexI + 1;
  
          console.log(colors.bgRed('Adjusted clue answer structure:', adjustedClueAnswerStructure));
          // Proceed with adjusted clue details
          clue.clueAnswerStructure = adjustedClueAnswerStructure;
          clue.startingIndex.indexI = adjustedStartingIndexI;
          clue.clueAnswerLength = adjustedClueAnswerStructure.length;
          // 
          let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
          console.log('wordStructureObj', wordStructureObj);
          const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
          console.log("**********************");
          console.log(obj);
          console.log("**********************");
          if (typeof clueStartingIndexDetails === "object" && clueStartingIndexDetails !== null) {
              gridSnapshotFillerUtil('COLUMN', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
              printGrid();
          }
        } else {
          // Proceed with the clue as is, since the first character is '-' and no suitable index was found
          console.log(colors.bgRed('Proceeding with original clue details as no adjustment is required.'));
        }
      } else {
        // Suitable clue index found, proceed as normal
        console.log(colors.bgRed('Suitable clue index found:', clueStartingIndexDetails));
        let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
        console.log('wordStructureObj', wordStructureObj);
        const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
        console.log("**********************");
        console.log(obj);
        console.log("**********************");
        if (typeof clueStartingIndexDetails === "object" && clueStartingIndexDetails !== null) {
            gridSnapshotFillerUtil('COLUMN', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
        }
      }
    }
  
    // Handling Large clues: COLUMN
  letsAddMoreFillers('COLUMN', 'L').then(async res => {
    console.log(colors.bgBlue(res));
    for (const clue of res) {
      let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("COLUMN", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
      console.log('clueStartingIndexDetails', clueStartingIndexDetails)
  
      if (!clueStartingIndexDetails) {
        continue;
        console.log(colors.bgRed('No suitable clue index found for L size in COLUMN, checking if adjustment is needed'));
  
        if (clue.clueAnswerStructure[0] !== '-') {
          let adjustedClueAnswerStructure = clue.clueAnswerStructure.substring(1);
          let adjustedStartingIndexI = clue.startingIndex.indexI + 1;
  
          console.log(colors.bgRed('Adjusted clue answer structure:', adjustedClueAnswerStructure));
          clue.clueAnswerStructure = adjustedClueAnswerStructure;
          clue.startingIndex.indexI = adjustedStartingIndexI;
          clue.clueAnswerLength = adjustedClueAnswerStructure.length;
          clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("COLUMN", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
          let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
          console.log('wordStructureObj', wordStructureObj);
          const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
          console.log("**********************");
          console.log(obj);
          console.log("**********************");
          if (obj) {
            gridSnapshotFillerUtil('COLUMN', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
            printGrid();
          }
        } else {
          console.log(colors.bgRed('Proceeding with original clue details as no adjustment is required.'));
        }
      } else {
        console.log(colors.bgRed('Suitable clue index found:', clueStartingIndexDetails));
        let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
        console.log('wordStructureObj', wordStructureObj);
        const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
        console.log("**********************");
        console.log(obj);
        console.log("**********************");
        if (obj) {
          gridSnapshotFillerUtil('COLUMN', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
        }
      }
    }
  
    // Handling Large clues: ROW
  letsAddMoreFillers('ROW', 'L').then(async res => {
    console.log(colors.bgBlue(res));
    for (const clue of res) {
      let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("ROW", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
      console.log('clueStartingIndexDetails', clueStartingIndexDetails)
  
      if (!clueStartingIndexDetails) {
        continue;
        console.log(colors.bgRed('No suitable clue index found for L size in ROW, checking if adjustment is needed'));
  
        if (clue.clueAnswerStructure[0] !== '-') {
          let adjustedClueAnswerStructure = clue.clueAnswerStructure.substring(1);
          let adjustedStartingIndexJ = clue.startingIndex.indexJ + 1;
  
          console.log(colors.bgRed('Adjusted clue answer structure:', adjustedClueAnswerStructure));
          clue.clueAnswerStructure = adjustedClueAnswerStructure;
          clue.startingIndex.indexJ = adjustedStartingIndexJ;
          clue.clueAnswerLength = adjustedClueAnswerStructure.length;
          clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("ROW", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
          if(!clueStartingIndexDetails){
            continue;
          }
          console.log('clueStartingIndexDetails', clueStartingIndexDetails)
          let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
          console.log('wordStructureObj', wordStructureObj);
          const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
          console.log("**********************");
          console.log(obj);
          console.log("**********************");
          if (obj) {
            gridSnapshotFillerUtil('ROW', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
            printGrid();
          }
        } else {
          console.log(colors.bgRed('Proceeding with original clue details as no adjustment is required.'));
        }
      } else {
        console.log(colors.bgRed('Suitable clue index found:', clueStartingIndexDetails));
        let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
        console.log('wordStructureObj', wordStructureObj);
        const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
        console.log("**********************");
        console.log(obj);
        console.log("**********************");
        if (obj) {
          gridSnapshotFillerUtil('ROW', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
        }
      }
    }
  
    // Handling Medium clues: ROW
  letsAddMoreFillers('ROW', 'M').then(async res => {
    console.log(colors.bgBlue(res));
    for (const clue of res) {
      let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("ROW", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
      console.log('clueStartingIndexDetails', clueStartingIndexDetails)
  
      if (!clueStartingIndexDetails) {
        continue;
        console.log(colors.bgRed('No suitable clue index found for M size in ROW'));
  
        // Adjust if the first character is not a placeholder
        if (clue.clueAnswerStructure[0] !== '-') {
          let adjustedClueAnswerStructure = clue.clueAnswerStructure.substring(1);
          let adjustedStartingIndexJ = clue.startingIndex.indexJ + 1;
  
          console.log(colors.bgRed('Adjusted clue answer structure:', adjustedClueAnswerStructure));
          clue.clueAnswerStructure = adjustedClueAnswerStructure;
          clue.startingIndex.indexJ = adjustedStartingIndexJ;
          clue.clueAnswerLength = adjustedClueAnswerStructure.length;
          clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("ROW", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
          if(!clueStartingIndexDetails){
            continue;
          }
          console.log('clueStartingIndexDetails', clueStartingIndexDetails)
          let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
          console.log('wordStructureObj', wordStructureObj);
          const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
          console.log("**********************");
          console.log(obj);
          console.log("**********************");
          if (obj) {
            gridSnapshotFillerUtil('ROW', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
            printGrid();
          }
        }
      } else {
        let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
        console.log('wordStructureObj', wordStructureObj);
        const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
        console.log("**********************");
        console.log(obj);
        console.log("**********************");
        if (obj) {
          gridSnapshotFillerUtil('ROW', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
        }
      }
    }
  
    // Handling Medium clues: COLUMN
  letsAddMoreFillers('COLUMN', 'M').then(async res => {
    console.log(colors.bgBlue(res));
    for (const clue of res) {
      let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("COLUMN", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
      console.log('clueStartingIndexDetails', clueStartingIndexDetails)
  
      if (!clueStartingIndexDetails) {
        continue;
        console.log(colors.bgRed('No suitable clue index found for M size in COLUMN'));
  
        // Adjust if the first character is not a placeholder
        if (clue.clueAnswerStructure[0] !== '-') {
          let adjustedClueAnswerStructure = clue.clueAnswerStructure.substring(1);
          let adjustedStartingIndexI = clue.startingIndex.indexI + 1;
  
          console.log(colors.bgRed('Adjusted clue answer structure:', adjustedClueAnswerStructure));
          clue.clueAnswerStructure = adjustedClueAnswerStructure;
          clue.startingIndex.indexI = adjustedStartingIndexI;
          clue.clueAnswerLength = adjustedClueAnswerStructure.length;
          clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("COLUMN", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
          console.log('clueStartingIndexDetails', clueStartingIndexDetails)
          let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
          console.log('wordStructureObj', wordStructureObj);
          const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
          console.log("**********************");
          console.log(obj);
          console.log("**********************");
          if (obj) {
            gridSnapshotFillerUtil('COLUMN', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
            printGrid();
          }
        }
      } else {
        let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
        console.log('wordStructureObj', wordStructureObj);
        const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
        console.log("**********************");
        console.log(obj);
        console.log("**********************");
        if (obj) {
          gridSnapshotFillerUtil('COLUMN', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
        }
      }
    }
  
    // Handling Small clues: ROW with adjustments
  letsAddMoreFillers('ROW', 'S').then(async res => {
    console.log(colors.bgBlue(res));
    for (const clue of res) {
      let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("ROW", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
      console.log('clueStartingIndexDetails', clueStartingIndexDetails);
  
      if (!clueStartingIndexDetails) {
        continue;
        console.log(colors.bgRed('No suitable clue index found, checking if adjustment is needed'));
        
        if (clue.clueAnswerStructure[0] !== '-') {
          console.log(colors.bgRed('First character is already filled, adjusting clue index and answer structure'));
          let adjustedClueAnswerStructure = clue.clueAnswerStructure.substring(1);
          let adjustedStartingIndexJ = clue.startingIndex.indexJ + 1;
  
          clue.clueAnswerStructure = adjustedClueAnswerStructure;
          clue.startingIndex.indexJ = adjustedStartingIndexJ;
          clue.clueAnswerLength = adjustedClueAnswerStructure.length;
          clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("ROW", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
          if(!clueStartingIndexDetails){
            continue;
          }
          let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
          const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (obj) {
            gridSnapshotFillerUtil('ROW', obj, clue.startingIndex.indexI, adjustedStartingIndexJ, "RIGHT");
          }
        }
      } else {
        let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
        const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
        if (obj) {
          gridSnapshotFillerUtil('ROW', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
        }
      }
    }
  
    // Handling Small clues: COLUMN with adjustments
  letsAddMoreFillers('COLUMN', 'S').then(async res => {
    console.log(colors.bgBlue(res));
    for (const clue of res) {
      let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("COLUMN", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
      console.log('clueStartingIndexDetails', clueStartingIndexDetails);
  
      if (!clueStartingIndexDetails) {
        continue;
        console.log(colors.bgRed('No suitable clue index found, checking if adjustment is needed'));
        
        if (clue.clueAnswerStructure[0] !== '-') {
          console.log(colors.bgRed('First character is already filled, adjusting clue index and answer structure'));
          let adjustedClueAnswerStructure = clue.clueAnswerStructure.substring(1);
          let adjustedStartingIndexI = clue.startingIndex.indexI + 1;
  
          clue.clueAnswerStructure = adjustedClueAnswerStructure;
          clue.startingIndex.indexI = adjustedStartingIndexI;
          clue.clueAnswerLength = adjustedClueAnswerStructure.length;
          clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("COLUMN", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
          if(!clueStartingIndexDetails){
            continue;
          }
          let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
          const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (obj) {
            gridSnapshotFillerUtil('COLUMN', obj, adjustedStartingIndexI, clue.startingIndex.indexJ, "DOWN");
          }
        }
      } else {
        let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
        const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
        if (obj) {
          gridSnapshotFillerUtil('COLUMN', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
        }
      }
    }
    printGrid();
    console.log(colors.bgGreen('NOW CALLING: scanAndFillRemainingCavities'))
    await scanAndFillRemainingCavities();
    const date = new Date();
    const formattedDate = [
      ('0' + date.getDate()).slice(-2), // Add leading zero and slice last 2 digits
      ('0' + (date.getMonth() + 1)).slice(-2), // Months are 0-indexed, add 1 to get correct month
      date.getFullYear()
    ].join('-'); // Join the components with dashes
    
    // letsAddMoreFillers('COLUMN', 'S').then(async res => {
    //   console.log(colors.bgBlue('letsAddMoreFillers S COLUMN', res));
    // });
    // letsAddMoreFillers('ROW', 'S').then(async res => {
    //   console.log('colors.bgBlueletsAddMoreFillers S ROW',(res));
    // });
    await processNullCellsAndFillClues();
    let puzzleObj = new Object();
    puzzleObj.crosswordId = uuidv4();
    puzzleObj.title = 'Puzzle '+formattedDate;
    puzzleObj.date = formattedDate;
    puzzleObj.gridSize = 9;
    puzzleObj.clues = generateCrosswordFromDiary(clueDiary);
    puzzleObj.cells = generateCellsArrayFromDiary(clueDiary);
    puzzleObj.nullCells = generateNullCellObjects(gridSnapshot)
    console.log('generateNullCellObjects',JSON.stringify(generateNullCellObjects(gridSnapshot)))
    console.log('calling savePuzzleToFile...')
    savePuzzleToFile(puzzleObj, counter, formattedDate);
    const newPuzzle = new PuzzleModel({
      puzzleData: puzzleObj,
      clueDiary: clueDiary,
      totalClues: puzzleObj.clues['across'].length + puzzleObj.clues['down'].length,
      deadCells: puzzleObj.nullCells.length,
    });
    newPuzzle.save().then(()=>{
      console.log(colors.bgGreen('PUZZLE SAVE TO DB~!'))
    });
    
  });
  
  });
  
  });
  
  });
  
  });
  
  });
  
  });
   
  })
  
}

function generateCrosswordImage(jsonData) {
  const gridSize = jsonData.gridSize;
  const canvasSize = 450; // Change as needed
  const cellSize = canvasSize / gridSize;
  const canvas = createCanvas(canvasSize, canvasSize + 100); // Extra space for text
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasSize, canvasSize + 100);

  // Setup text properties
  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';

  // Draw title and date above the grid
  ctx.fillText(jsonData.title, 10, 30);
  ctx.fillText(jsonData.date, 10, 50);

  // Draw grid
  jsonData.cells.forEach(cell => {
      const { content, index, status, actualContent } = cell;
      const x = index.x * cellSize;
      const y = (index.y * cellSize) + 60; // Offset for title and date

      // Draw cell background
      if (status === 'BLOCKED') {
          ctx.fillStyle = '#D3D3D3'; // Light Gray for blocked cells
      } else {
          ctx.fillStyle = 'white';
      }
      ctx.fillRect(x, y, cellSize, cellSize);

      // Draw border
      ctx.strokeStyle = 'black';
      ctx.strokeRect(x, y, cellSize, cellSize);

      // Fill cell with content
      if (status !== 'BLOCKED') {
          ctx.fillStyle = 'black';
          ctx.fillText(actualContent, x + (cellSize / 3), y + (2 * cellSize / 3), cellSize);
      }
  });

  // Save to file
  const outputFile = './crossword.png';
  const out = fs.createWriteStream(outputFile);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  out.on('finish', () => console.log(`Crossword puzzle image saved to ${outputFile}`));
}


function savePuzzleToFile(puzzleObj, counter, formattedDate) {
  const dirPath = path.join(__dirname, 'mockedPuzzles'); // Directory path for saving files
  // Ensure the "mockedPuzzles" directory exists, create it if not
  if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
  }

  const fileName = `puzzle-${uuidv4().slice(0,5)}-${formattedDate}.json`;
  const filePath = path.join(dirPath, fileName);

  fs.writeFile(filePath, JSON.stringify(puzzleObj, null, 2), (err) => {
      if (err) {
          console.error('Error saving the puzzle:', err);
      } else {
          console.log(`Puzzle saved successfully as ${fileName} in "mockedPuzzles" directory`);
      }
  });
}

// Example usage
const puzzleObj = {/* your puzzle object here */};
let counter = 1; // Increment this based on your logic
const formattedDate = new Date().toISOString().slice(0, 10).replace(/-/g, '-');

// Update the counter based on the files already present in the directory to avoid overwriting
const dirPath = path.join(__dirname, 'mockedPuzzles');
if (fs.existsSync(dirPath)) {
  const files = fs.readdirSync(dirPath);
  const puzzleFiles = files.filter(file => file.startsWith('puzzle-') && file.endsWith('.json'));
  counter = puzzleFiles.length + 1; // Set counter to next available number
}

function checkWordStructureStringForMultipleNonDashCharacters(wordStructure) {
  let nonDashCount = 0;
  for (let i = 0; i < wordStructure.length; i++) {
      if (wordStructure[i] !== '-') {
          nonDashCount += 1;
          if (nonDashCount > 1) {
              return false; // More than one non-dash character found
          }
      }
  }
  return true; // Suitable word structure (0 or 1 non-dash character)
}
// 
async function findAllPossibleCluePaths(orientation) {
  const clueSizeRanges = {
      XL: { min: 7, max: 9 }, // Adjust these ranges as necessary
      L: { min: 5, max: 6 },
      M: { min: 3, max: 4 },
      S: { min: 1, max: 2 }
  };

  // Initialize result structure
  const result = {
      XL: [],
      L: [],
      M: [],
      S: []
  };

  // Iterate through the grid to find suitable paths
  gridSnapshot.forEach((row, i) => {
      row.forEach((cell, j) => {
          // Only consider empty cells as starting points
          if (cell === null) {
              Object.entries(clueSizeRanges).forEach(([size, {min, max}]) => {
                  for (let length = min; length <= max; length++) {
                      let isSuitable = true;
                      let wordStructure = '';
                      for (let offset = 0; offset < length; offset++) {
                          const checkI = orientation === 'ROW' ? i : i + offset;
                          const checkJ = orientation === 'COLUMN' ? j : j + offset;

                          // Ensure within bounds and path is clear
                          if (checkI >= gridSnapshot.length || checkJ >= gridSnapshot[0].length || gridSnapshot[checkI][checkJ] !== null) {
                              isSuitable = false;
                              break;
                          }

                          // Simulate word structure based on intersections
                          wordStructure += gridSnapshot[checkI][checkJ] === null ? '-' : gridSnapshot[checkI][checkJ];
                      }

                      if (isSuitable) {
                          result[size].push({
                              wordStructure: wordStructure,
                              clueIndex: { clueIndexI: i, clueIndexJ: j },
                              answerStartingIndex: { answerStartingIndexI: orientation === 'ROW' ? i : i, answerStartingIndexJ: orientation === 'COLUMN' ? j : j },
                              directionFlow: orientation === 'ROW' ? 'RIGHT' : 'DOWN',
                              clueLength: length
                          });
                      }
                  }
              });
          }
      });
  });

  return result;
}

// 

const fetchLargeWordOptionsAgainstXLWord_abc = async (clueDiaryObj) => {
  let usedColumnsArr = [];
  let usedRowsArr = [];
  let largeWordsConnectedToCurrentXLWord = [];

  console.log("Finding Large word options against", clueDiaryObj.clueObject.answer);

  let largeWordsBranchedFromThisAnchorword;
  if (clueDiary.xl.length === 1) {
    // Allocate 50% of large sized words quota to this anchor word
    largeWordsBranchedFromThisAnchorword = Math.ceil(NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE / 2);
  } else {
    // Allocate 30% of large sized words quota to this anchor word
    largeWordsBranchedFromThisAnchorword = Math.ceil(NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE * 0.3);
  }

  let totalWordsAccomodated = 0;

  while (totalWordsAccomodated < largeWordsBranchedFromThisAnchorword) {
    console.log('fetchLargeWordOptionsAgainstXLWord : while...')
    let currentClueLength = getRandomizedClueLengthAgainstType("L");
    let flag = false;

    do {
      let startIndexI, startIndexJ;
      let orientation = clueDiaryObj.orientation === "ROW" ? "COLUMN" : "ROW"; // Switch orientation for branching
      let directionFlow = orientation === "ROW" ? "RIGHT" : "DOWN";

      if (orientation === "ROW") {
        startIndexI = randomIntBetweenRange(0, gridSnapshot.length - 1);
        startIndexJ = randomIntBetweenRange(0, gridSnapshot[0].length - currentClueLength);
      } else {
        startIndexI = randomIntBetweenRange(0, gridSnapshot.length - currentClueLength);
        startIndexJ = randomIntBetweenRange(0, gridSnapshot[0].length - 1);
      }

      // Check if the path is clear and does not intersect with existing words beyond the initial character
      let isPathClear = true;
      for (let offset = 0; offset < currentClueLength; offset++) {
        let checkI = orientation === "ROW" ? startIndexI : startIndexI + offset;
        let checkJ = orientation === "ROW" ? startIndexJ + offset : startIndexJ;
        if (gridSnapshot[checkI][checkJ] !== null && !(usedRowsArr.includes(checkI) || usedColumnsArr.includes(checkJ))) {
          isPathClear = false;
          break;
        }
      }

      if (isPathClear) {
        // Generate word structure based on the chosen orientation and starting indexes
        let wordStructure = new Array(currentClueLength).fill('-').join('');
        let wordStructureObj = await analyzeString(wordStructure);
        const clue = await getClueWithSpecificAnswerPattern(wordStructureObj);

        if (clue) {
          largeWordsConnectedToCurrentXLWord.push({
            clueObject: clue,
            orientation: orientation,
            answerStartingIndex: { indexI: startIndexI, indexJ: startIndexJ },
            clueIndex: orientation === "ROW" ? { clueIndexI: startIndexI, clueIndexJ: startIndexJ - 1 } : { clueIndexI: startIndexI - 1, clueIndexJ: startIndexJ },
            directionFlow: directionFlow
          });
          totalWordsAccomodated++;
          flag = true;
        }
      }
    } while (!flag && totalWordsAccomodated < largeWordsBranchedFromThisAnchorword);

    if (!flag) {
      console.log(`Unable to find suitable placement for large words branching from ${clueDiaryObj.clueObject.answer}`);
      break; // Break the loop if unable to find suitable placement
    }
  }

  return largeWordsConnectedToCurrentXLWord;
};



const findSuitableCluePlacement = (wordStructure, scanOrientation, pathIndex, desiredClueSize, intersectionPreferred) => {
  const [lowerLimit, upperLimit] = desiredClueSize.split('-').map(Number);
  let potentialPlacements = [];
  let selectedOption = null;

  for (let i = 0; i < wordStructure.length; i++) {
    if (wordStructure[i] === '-' || (intersectionPreferred && wordStructure[i].match(/[A-Z]/i))) {
      for (let j = i; j < wordStructure.length && (j - i + 1) <= upperLimit; j++) {
        if (wordStructure[j] !== '-' && !wordStructure[j].match(/[A-Z]/i)) break;

        if ((j - i + 1) >= lowerLimit) {
          let segment = wordStructure.substring(i, j + 1);
          let hasIntersection = /[A-Z]/i.test(segment);
          if (!intersectionPreferred && hasIntersection) continue;

          let placement = {
            wordStructure: segment,
            clueIndex: { clueIndexI: pathIndex, clueIndexJ: i },
            answerStartingIndex: { answerStartingIndexI: pathIndex, answerStartingIndexJ: i },
            directionFlow: scanOrientation === 'ROW' ? 'RIGHT' : 'DOWN',
            clueLength: j - i + 1
          };

          // Check if the clueIndex cell is empty (assuming access to gridSnapshot or similar mechanism)
          if (gridSnapshot && gridSnapshot[placement.clueIndex.clueIndexI] && gridSnapshot[placement.clueIndex.clueIndexI][placement.clueIndex.clueIndexJ] === null) {
            potentialPlacements.push(placement);
            // Prioritize selection based on intersection presence and the criteria defined
            if (!selectedOption || (intersectionPreferred && hasIntersection && !selectedOption.hasIntersection)) {
              selectedOption = placement;
            }
          }
        }
      }
    }
  }

  // Return both all options and a selected option
  return {
    options: potentialPlacements,
    selectedOption: selectedOption ? selectedOption : potentialPlacements.length > 0 ? potentialPlacements[0] : null // Select the first option as fallback
  };
};


let largeSizedWordsPlacementObject = {
  anchorBranchingLargeClues: {
    ROW: [],
    COLUMN: [],
  },
  nonBranchedLargeClues: {
    ROW: [],
    COLUMN: [],
  },
};






const isPathSuitableForGivenClueSizeAndStrcture = (wordStructure, scanOrientation, pathIndex, desiredClueSize)=> {
  
  let lowerLimit = desiredClueSize.split('-')[0];
  let upperrLimit = desiredClueSize.split('-')[1];
  switch(scanOrientation){
    case 'ROW':
      console.log(wordStructure);

      break;
    case 'COLUMN':
      break;
  }
};

const scanLineForPossibleClue = (orientation, desiredClueSize) => {
  return {
    clueObject: {},
    startingIndex: {},
    clueIndex: {}
  };
}

const randomlyPickBetweenRowAndColumn = () => {
  return randomIntBetweenRange(1, 2) === 1 ? "ROW" : "COLUMN";
};

const fetchSuitableClueFromDB = async (
  orientation,
  answerLength,
  clueIndexI,
  clueIndexJ,
  answerDirectionFlow
) => {
  console.log(
    colors.green(
      "inside fetchSuitableClueFromDB, orientation, answerLength, clueIndexI, clueIndexJ, answerDirectionFlow : ",
      orientation,
      answerLength,
      clueIndexI,
      clueIndexJ,
      answerDirectionFlow
    )
  );
  //check all cells and find if there are any already filled/ intersection characters and their position.
  let answerStartingIndexObj = getAnswerStartingIndex(orientation,answerLength,clueIndexI,clueIndexJ,answerDirectionFlow);
  console.log("answerStartingIndexObj", answerStartingIndexObj, getLineNumber());
  let answerStartingIndexI = answerStartingIndexObj.answerStartingIndexI;
  let answerStartingIndexJ = answerStartingIndexObj.answerStartingIndexJ;
  let wordStructure = "";
  let totalIntersections = 0;
  switch (orientation) {
    case "ROW":
      wordStructure = "";
      for (let i = 0; i < answerLength; i++) {
        if (
          gridSnapshot[answerStartingIndexI][answerStartingIndexJ + i] === null
        ) {
          wordStructure += "-"; // HERE - IS USED AS A SYMBOL OF INTERSECTION which will help us fetch a related clue word from the DB
          console.log(
            "wordStructure",
            "I :",
            answerStartingIndexI,
            "J : ",
            answerStartingIndexJ + i,
            wordStructure
          );
        } else {
          wordStructure +=
            gridSnapshot[answerStartingIndexI][answerStartingIndexJ + i];
          console.log(
            "wordStructure",
            "I :",
            answerStartingIndexI,
            "J : ",
            answerStartingIndexJ + i,
            wordStructure
          );
          totalIntersections++;
        }
      }
      break;
    case "COLUMN":
      wordStructure = "";
      for (let i = 0; i < answerLength; i++) {
        if (
          gridSnapshot[answerStartingIndexI + i][answerStartingIndexJ] === null
        ) {
          wordStructure += "-";
        } else {
          wordStructure +=
            gridSnapshot[answerStartingIndexI + i][answerStartingIndexJ];
          totalIntersections++;
        }
      }
      break;
  }

  console.log(colors.red("wordStructure", wordStructure));
  wordStructureObj = analyzeString(wordStructure);
  console.log(wordStructureObj);
  if (wordStructureObj.nonDashCharacters.length > 0) {
    const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
    console.log("**********************");
    console.log(obj);
    console.log("**********************");
    return obj;
  } else {
    return {};
  }
};

const analyzeString = async (str) => {
  let nonDashCharacters = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== "-") {
      nonDashCharacters.push({ position: i, character: str[i] });
    }
  }
  return {
    totalLength: str.length,
    nonDashCharacters,
  };
};

function getLineNumber() {
  const e = new Error();
  const stackLines = e.stack.split("\n");
  // The first line in the stack is the Error message itself, the second line is this function call, 
  // so we start from the third line
  const callerLine = stackLines[3]; 
  // Match the pattern that captures the function name, filename, line number, and column number
  const regex = /at (.*) \((.*):(\d+):(\d+)\)/;
  const match = regex.exec(callerLine);

  if (match && match.length === 5) {
    // Extract the function name, filename, and line number from the match array
    const functionName = match[1];
    const filename = match[2].split('/').pop(); // Get only the filename without the full path
    const lineNumber = match[3];
    return `${functionName}, ${filename}:${lineNumber}`;
  } else {
    return 'unknown';
  }
}


const scanPathForAnyCharacter = (
  currentOrientation,
  answerLength,
  answerStartingIndexI,
  answerStartingIndexJ,
  searchCharacter
) => {
  console.log(
    colors.green(
      "inside scanPathForAnyCharacter currentOrientation, answerLength, answerStartingIndexI, answerStartingIndexJ,searchCharacter",
      currentOrientation,
      answerLength,
      answerStartingIndexI,
      answerStartingIndexJ,
      searchCharacter
    )
  );
  let flag = false;
  switch (currentOrientation) {
    case "ROW":
      for (let i = 0; i < answerLength; i++) {
        if (
          gridSnapshot[answerStartingIndexI][answerStartingIndexJ + i] ===
          searchCharacter
        ) {
          flag = true;
        }
      }
      break;
    case "COLUMN":
      for (let i = 0; i < answerLength; i++) {
        if (gridSnapshot[answerStartingIndexI + i][answerStartingIndexJ] === searchCharacter) {
          flag = true;
        }
      }
      break;
  }
  return flag;
};

const clueCellInPathScan = (
  currentOrientation,
  answerLength,
  clueIndexI,
  clueIndexJ,
  answerDirectionFlow
) => {
  let redFlag = false;
  let answerStartingIndexObj = getAnswerStartingIndex(currentOrientation,answerLength,clueIndexI,clueIndexJ,answerDirectionFlow);
  let test1 = scanPathForAnyCharacter(currentOrientation,answerLength,answerStartingIndexObj.answerStartingIndexI,answerStartingIndexObj.answerStartingIndexJ,"*");
  let test2 = scanPathForAnyCharacter(currentOrientation,answerLength,answerStartingIndexObj.answerStartingIndexI,answerStartingIndexObj.answerStartingIndexJ,"#");
  console.log(colors.red("#######inside clueCellInPathScan, returning ",test1 && test2,"#####"));
  return test1 || test2;
};

const determineCluePlacement = async (SIZE, clueObj, orderInSize) => {
  console.log(
    colors.red(
      "inside determineCluePlacement for XL",
      orderInSize,
      clueObj.answer,
      clueObj.answer.length
    )
  );
  switch (SIZE) {
    case "XL":
      let flag = false;
      // console.log(clueObj);
      do {
        let currentOrientation =
          randomIntBetweenRange(1, 2) === 1 ? "ROW" : "COLUMN";
        //
        console.log(colors.green("clueDiary.xl.length", clueDiary.xl.length));
        if (clueDiary.xl.length === 0) {
          currentOrientation = "ROW";
        } else {
          currentOrientation = "COLUMN";
        }
        //
        console.log(
          "Inside DoWhile Loop in the function determineCluePlacement, currentOrientation is : ",
          currentOrientation
        );
        if (clueObj.answer.length === 8) {
          let clueIndexI = 0; //  shows the row
          let clueIndexJ = 0;

          if (currentOrientation === "COLUMN") {
            clueIndexJ = randomIntBetweenRange(0, 8); // shows the column
            console.log(
              "COLUMN",
              clueIndexI,
              clueIndexJ,
              "clueObj.answer.length ",
              clueObj.answer.length
            );
            //
            if (gridSnapshot[clueIndexI][clueIndexJ] === null) {
              //check if the selected path doesnt have a clue cell somewhere with in it.
              let redFlag = clueCellInPathScan(
                currentOrientation,
                clueObj.answer.length,
                clueIndexI,
                clueIndexJ,
                "DOWN"
              );
              if (redFlag) {
                console.log(
                  colors.red(
                    "*******ENCOUNTED CLUE IN PATH, trying another coordinates***********"
                  )
                );
                continue;
              }

              // gridSnapshot[clueIndexI][clueIndexJ] = "*";
              let newClueObject = await fetchSuitableClueFromDB(
                currentOrientation,
                clueObj.answer.length,
                clueIndexI,
                clueIndexJ,
                "DOWN"
              );
              // gridSnapshopFillerUtil(currentOrientation, clueObj, clueIndexI, clueIndexJ, "DOWN");
              if (newClueObject) {
                gridSnapshot[clueIndexI][clueIndexJ] = "*";
                gridSnapshotFillerUtil(
                  currentOrientation,
                  newClueObject,
                  clueIndexI,
                  clueIndexJ,
                  "DOWN"
                );
              } else {
                console.log(
                  colors.red(
                    "#### THE ELSE PART, WHERE WE ARE UNABLE TO FIND A SUITABLE CLUE FROM DB"
                  )
                );
                continue;
              }

              flag = true;
              // clueDiary.xl.push({...clueObj, orientation: currentOrientation})
              // clueDiary.xl.push({
              //   clueNumber: clueDiary.xl.length + 1,
              //   clueObject: clueObj,
              //   orientation: currentOrientation,
              //   startingIndex: getAnswerStartingIndex(
              //     currentOrientation,
              //     clueObj.answer.length,
              //     clueIndexI,
              //     clueIndexJ,
              //     "DOWN"
              //   ),
              //   directionFlow:"DOWN"
              // });
            }
          } else {
            // HANDLING XL WORD IN ROW WITH SIZE 8
            clueIndexI = randomIntBetweenRange(0, 8);
            console.log(
              "************ROW*******************",
              "clue Index : ",
              clueIndexI,
              clueIndexJ
            );

            if (gridSnapshot[clueIndexI][clueIndexJ] === null) {
              let redFlag = clueCellInPathScan(
                currentOrientation,
                clueObj.answer.length,
                clueIndexI,
                clueIndexJ,
                "RIGHT"
              );
              if (redFlag) {
                console.log(
                  colors.red(
                    "*******ENCOUNTED CLUE IN PATH, trying another coordinates***********"
                  )
                );
                continue;
              }

              // clueDiary.xl.push({...clueObj, orientation: currentOrientation});

              let newClueObject = await fetchSuitableClueFromDB(
                currentOrientation,
                clueObj.answer.length,
                clueIndexI,
                clueIndexJ,
                "RIGHT"
              );
              console.log(newClueObject);
              console.log(
                colors.yellow(
                  "newClueObject in row case length 8:",
                  JSON.stringify(newClueObject)
                )
              );
              if (newClueObject) {
                gridSnapshot[clueIndexI][clueIndexJ] = "#";
                flag = true;
                gridSnapshotFillerUtil(
                  currentOrientation,
                  clueObj,
                  clueIndexI,
                  clueIndexJ,
                  "RIGHT"
                );
                // clueDiary.xl.push({
                //   clueNumber: clueDiary.xl.length + 1,
                //   clueObject: clueObj,
                //   orientation: currentOrientation,
                //   startingIndex: getAnswerStartingIndex(
                //     currentOrientation,
                //     clueObj.answer.length,
                //     clueIndexI,
                //     clueIndexJ,
                //     "RIGHT"
                //   ),
                //   directionFlow:"RIGHT"
                // });
              } else {
                continue;
              }
            }
          }
        } else {
          //this case handles clue with answer of length 9
          let clueIndexI = 0;
          let clueIndexJ = 0;
          // randomIntBetweenRange(0,9);

          if (currentOrientation === "COLUMN") {
            clueIndexJ = randomIntBetweenRange(0, 8);
            //check edge cases
            // left edge case
            if (clueIndexJ === 0) {
              if (gridSnapshot[0][1] === null) {
                let redFlag = clueCellInPathScan(currentOrientation,clueObj.answer.length,0,0,"LEFT_DOWN");
                if (redFlag) {console.log(colors.red("*******ENCOUNTED CLUE IN PATH, trying another coordinates***********", getLineNumber()));
                  continue;
                }

                //use this coordinate as clue cell of current clueObject
                console.log("SETTING COLUMN LEFT edge case, SETTING CLUE AT [0][1]");

                // gridSnapshot[0][1] = "Cc" + orderInSize;
                gridSnapshot[0][1] = "*";
                gridSnapshotFillerUtil(currentOrientation,clueObj,0,1,"LEFT_DOWN");
                // clueDiary.xl.push({
                //   clueNumber: clueDiary.xl.length + 1,
                //   clueObject: clueObj,
                //   orientation: currentOrientation,
                //   startingIndex: getAnswerStartingIndex(
                //     currentOrientation,
                //     clueObj.answer.length,
                //     clueIndexI,
                //     clueIndexJ,
                //     "LEFT_DOWN"
                //   ),
                //   directionFlow:"LEFT_DOWN"
                // });
                flag = true;
              } else {
                continue;
              }
            } // right edge case:
            else if (clueIndexJ === 8) {
              if (gridSnapshot[0][7] === null) {
                let redFlag = clueCellInPathScan(currentOrientation,clueObj.answer.length,0,7,"RIGHT_DOWN");
                if (redFlag) {
                  console.log(colors.red("*******ENCOUNTED CLUE IN PATH, trying another coordinates***********", getLineNumber()));
                  continue;
                }
                //use this coordinate as clue cell of current clueObject
                console.log(
                  "SETTING COLUMN RIGHT edge case, SETTING CLUE AT [0][7]"
                );
                // gridSnapshot[0][7] = "Cc" + orderInSize;
                gridSnapshot[0][7] = "*";
                flag = true;
                // clueDiary.xl.push({...clueObj, orientation: currentOrientation})
                // clueDiary.xl.push({
                //   clueNumber: clueDiary.xl.length + 1,
                //   clueObject: clueObj,
                //   orientation: currentOrientation,
                //   startingIndex: getAnswerStartingIndex(
                //     currentOrientation,
                //     clueObj.answer.length,
                //     0,
                //     7,
                //     "RIGHT_DOWN"
                //   ),
                //   directionFlow:'RIGHT_DOWN'
                // });
                gridSnapshotFillerUtil(
                  currentOrientation,
                  clueObj,
                  0,
                  7,
                  "RIGHT_DOWN"
                );
              } else {
                continue;
              }
            }
            // non edge cases in column orientation
            else {
              if (gridSnapshot[0][clueIndexJ - 1] === null) {
                let redFlag = clueCellInPathScan(
                  currentOrientation,
                  clueObj.answer.length,
                  0,
                  clueIndexJ - 1,
                  "RIGHT_DOWN"
                );
                if (redFlag) {
                  console.log(
                    colors.red(
                      "*******ENCOUNTED CLUE IN PATH, trying another coordinates***********"
                    )
                  );
                  continue;
                }
                //use this coordinate as clue cell of current clueObject
                // gridSnapshot[0][clueIndexJ - 1] = "Cc" + orderInSize;
                gridSnapshot[0][clueIndexJ - 1] = "*";
                console.log(
                  `SETTING COLUMN INBETWEEN case, SETTING CLUE AT [0][${
                    clueIndexJ - 1
                  }]`
                );
                gridSnapshotFillerUtil(
                  currentOrientation,
                  clueObj,
                  0,
                  clueIndexJ - 1,
                  "RIGHT_DOWN"
                );
                flag = true;
                // clueDiary.xl.push({...clueObj, orientation: currentOrientation})
                // clueDiary.xl.push({
                //   clueNumber: clueDiary.xl.length + 1,
                //   clueObject: clueObj,
                //   orientation: currentOrientation,
                //   startingIndex: getAnswerStartingIndex(
                //     currentOrientation,
                //     clueObj.answer.length,
                //     0,
                //     clueIndexJ - 1,
                //     "RIGHT_DOWN"
                //   ),
                //   directionFlow:'RIGHT_DOWN',
                // });
              } else if (gridSnapshot[0][clueIndexJ + 1] === null) {
                let redFlag = clueCellInPathScan(
                  currentOrientation,
                  clueObj.answer.length,
                  0,
                  clueIndexJ + 1,
                  "LEFT_DOWN"
                );
                if (redFlag) {
                  console.log(
                    colors.red(
                      "*******ENCOUNTED CLUE IN PATH, trying another coordinates***********"
                    )
                  );
                  continue;
                }

                //use this coordinate as clue cell of current clueObject
                // gridSnapshot[0][clueIndexJ + 1] = "Cc" + orderInSize;
                gridSnapshot[0][clueIndexJ + 1] = "*";
                console.log(
                  `SETTING COLUMN INBETWEEN case, SETTING CLUE AT [0][${
                    clueIndexJ + 1
                  }]`
                );
                flag = true;
                // clueDiary.xl.push({...clueObj, orientation: currentOrientation})
                // clueDiary.xl.push({
                //   clueNumber: clueDiary.xl.length + 1,
                //   clueObject: clueObj,
                //   orientation: currentOrientation,
                //   startingIndex: getAnswerStartingIndex(
                //     currentOrientation,
                //     clueObj.answer.length,
                //     0,
                //     clueIndexJ + 1,
                //     "LEFT_DOWN"
                //   ),
                //   directionFlow:'LEFT_DOWN'
                // });
                gridSnapshotFillerUtil(
                  currentOrientation,
                  clueObj,
                  0,
                  clueIndexJ + 1,
                  "LEFT_DOWN"
                );
              } else {
                continue;
              }
            }
            //
            // console.log('COLUMN', clueIndexI, clueIndexJ)
            // gridSnapshot[clueIndexI][clueIndexJ] = clueObj.clue;
          } else {
            let clueIndexI = randomIntBetweenRange(0, 8);
            // Top Row Case
            if (clueIndexI === 0) {
              console.log("Top Row Case");
              if (gridSnapshot[1][0] === null) {
                let redFlag = clueCellInPathScan(
                  currentOrientation,
                  clueObj.answer.length,
                  clueIndexI + 1,
                  clueIndexJ,
                  "DOWN_RIGHT"
                );
                if (redFlag) {
                  console.log(
                    colors.red(
                      "*******ENCOUNTED CLUE IN PATH, trying another coordinates***********"
                    )
                  );
                  continue;
                }
                // console.log()
                // gridSnapshot[1][0] = "Cr" + orderInSize;
                // gridSnapshot[1][0] = "TOP ROW UP RIGHT";
                gridSnapshot[1][0] = "#";

                gridSnapshotFillerUtil(
                  currentOrientation,
                  clueObj,
                  clueIndexI + 1,
                  clueIndexJ,
                  "DOWN_RIGHT"
                );
                flag = true;
                // clueDiary.xl.push({...clueObj, orientation: currentOrientation});
                // clueDiary.xl.push({
                //   clueNumber: clueDiary.xl.length + 1,
                //   clueObject: clueObj,
                //   orientation: currentOrientation,
                //   startingIndex: getAnswerStartingIndex(
                //     currentOrientation,
                //     clueObj.answer.length,
                //     clueIndexI + 1,
                //     clueIndexJ,
                //     "DOWN_RIGHT"
                //   ),
                //   directionFlow: 'DOWN_RIGHT'
                // });
              } else {
                continue;
              }
            }
            // Bottom Row Case
            else if (clueIndexI === 8) {
              if (gridSnapshot[7][0] === null) {
                let redFlag = clueCellInPathScan(
                  currentOrientation,
                  clueObj.answer.length,
                  clueIndexI - 1,
                  clueIndexJ,
                  "UP_RIGHT"
                );
                if (redFlag) {
                  console.log(
                    colors.red(
                      "*******ENCOUNTED CLUE IN PATH, trying another coordinates***********"
                    )
                  );
                  continue;
                }
                // gridSnapshot[7][0] = "Cr" + orderInSize;
                // gridSnapshot[7][0] = "BOTTOM ROW DOWN RIGHT";
                gridSnapshotFillerUtil(
                  currentOrientation,
                  clueObj,
                  clueIndexI - 1,
                  clueIndexJ,
                  "UP_RIGHT"
                );
                gridSnapshot[7][0] = "#";
                flag = true;
                // clueDiary.xl.push({...clueObj, orientation: currentOrientation})
                // clueDiary.xl.push({
                //   clueNumber: clueDiary.xl.length + 1,
                //   clueObject: clueObj,
                //   orientation: currentOrientation,
                //   startingIndex: getAnswerStartingIndex(
                //     currentOrientation,
                //     clueObj.answer.length,
                //     clueIndexI - 1,
                //     clueIndexJ,
                //     "UP_RIGHT"
                //   ),
                //   directionFlow: 'UP_RIGHT'
                // });
              } else {
                continue;
              }
            }
            // Inbetween Row Case
            else {
              console.log("Inbetween Row Case");
              if (gridSnapshot[clueIndexI - 1][0] === null) {
                let redFlag = clueCellInPathScan(
                  currentOrientation,
                  clueObj.answer.length,
                  clueIndexI - 1,
                  clueIndexJ,
                  "UP_RIGHT"
                );
                if (redFlag) {
                  console.log(
                    colors.red(
                      "*******ENCOUNTED CLUE IN PATH, trying another coordinates***********"
                    )
                  );
                  continue;
                }

                // gridSnapshot[clueIndexI - 1][0] = 'Cr'+orderInSize;
                // gridSnapshot[clueIndexI - 1][0] = 'DOWN RIGHT';
                gridSnapshot[clueIndexI - 1][0] = "#";
                gridSnapshotFillerUtil(
                  currentOrientation,
                  clueObj,
                  clueIndexI - 1,
                  clueIndexJ,
                  "UP_RIGHT"
                );
                flag = true;
                // clueDiary.xl.push({...clueObj, orientation: currentOrientation});
                // clueDiary.xl.push({
                //   clueNumber: clueDiary.xl.length + 1,
                //   clueObject: clueObj,
                //   orientation: currentOrientation,
                //   startingIndex: getAnswerStartingIndex(
                //     currentOrientation,
                //     clueObj.answer.length,
                //     clueIndexI - 1,
                //     clueIndexJ,
                //     "UP_RIGHT"
                //   ),
                //   directionFlow: 'UP_RIGHT'
                // });
              } else if (gridSnapshot[clueIndexI + 1][0] === null) {
                let redFlag = clueCellInPathScan(
                  currentOrientation,
                  clueObj.answer.length,
                  clueIndexI + 1,
                  clueIndexJ,
                  "DOWN_RIGHT"
                );
                if (redFlag) {
                  console.log(
                    colors.red(
                      "*******ENCOUNTED CLUE IN PATH, trying another coordinates***********"
                    )
                  );
                  continue;
                }
                // gridSnapshot[clueIndexI + 1][0] = 'Cr'+orderInSize;
                // gridSnapshot[clueIndexI + 1][0] = 'UP RIGHT';
                gridSnapshot[clueIndexI + 1][0] = "#";
                gridSnapshotFillerUtil(
                  currentOrientation,
                  clueObj,
                  clueIndexI + 1,
                  clueIndexJ,
                  "DOWN_RIGHT"
                );
                flag = true;
                // clueDiary.xl.push({...clueObj, orientation: currentOrientation});
                // clueDiary.xl.push({
                //   clueNumber: clueDiary.xl.length + 1,
                //   clueObject: clueObj,
                //   orientation: currentOrientation,
                //   startingIndex: getAnswerStartingIndex(
                //     currentOrientation,
                //     clueObj.answer.length,
                //     clueIndexI + 1,
                //     clueIndexJ,
                //     "DOWN_RIGHT"
                //   ),
                //   directionFlow: 'DOWN_RIGHT'
                // });
              } else {
                continue;
              }
            }
          }
        }
      } while (!flag);

      printGrid();
      return true;
      break;
    case "L":
      break;
    case "M":
      break;
    case "S":
      break;
  }
};

const getClueIndexAgainstAnswerStartingIndex_working_backup = (orientation, answerStartingIndexI, answerStartingIndexJ) => {
  let obj = {
    clueIndex: {
      clueIndexI: null,
      clueIndexJ: null,
    },
    directionFlow: "",
  };

  // Common function to check if adjacent cell is suitable for clue index
  const isCellSuitable = (i, j) => {
    return gridSnapshot[i] && gridSnapshot[i][j] === null;
  };

  switch (orientation) {
    case "ROW":
      // For ROW, check for right and diagonal directions but ensure it does not overlap or go out of bounds
      if (answerStartingIndexJ > 0 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ - 1)) {
        obj.clueIndex = { clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ - 1 };
        obj.directionFlow = "RIGHT";
      } else if (answerStartingIndexI > 0 && isCellSuitable(answerStartingIndexI - 1, answerStartingIndexJ)) {
        obj.clueIndex = { clueIndexI: answerStartingIndexI - 1, clueIndexJ: answerStartingIndexJ };
        obj.directionFlow = "DOWN_RIGHT";
      } else if (answerStartingIndexI < gridSnapshot.length - 1 && isCellSuitable(answerStartingIndexI + 1, answerStartingIndexJ)) {
        obj.clueIndex = { clueIndexI: answerStartingIndexI + 1, clueIndexJ: answerStartingIndexJ };
        obj.directionFlow = "UP_RIGHT";
      }
      break;
    case "COLUMN":
      // For COLUMN, adjust logic to account for top row special case
      if (answerStartingIndexI === 0) {
        // If at the top, only consider RIGHT_DOWN or LEFT_DOWN if possible
        if (answerStartingIndexJ > 0 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ - 1)) {
          obj.clueIndex = { clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ - 1 };
          obj.directionFlow = "RIGHT_DOWN";
        } else if (answerStartingIndexJ < gridSnapshot[0].length - 1 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ + 1)) {
          obj.clueIndex = { clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ + 1 };
          obj.directionFlow = "LEFT_DOWN";
        }
      } else {
        // For other rows, consider DOWN, RIGHT_DOWN, and LEFT_DOWN if not at the top
        if (answerStartingIndexI < gridSnapshot.length - 1 && isCellSuitable(answerStartingIndexI + 1, answerStartingIndexJ)) {
          obj.clueIndex = { clueIndexI: answerStartingIndexI - 1, clueIndexJ: answerStartingIndexJ };
          obj.directionFlow = "DOWN";
        } else if (answerStartingIndexJ > 0 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ - 1)) {
          obj.clueIndex = { clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ - 1 };
          obj.directionFlow = "RIGHT_DOWN";
        } else if (answerStartingIndexJ < gridSnapshot[0].length - 1 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ + 1)) {
          obj.clueIndex = { clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ + 1 };
          obj.directionFlow = "LEFT_DOWN";
        }
      }
      break;
  }

  if (obj.clueIndex.clueIndexI === null || obj.clueIndex.clueIndexJ === null) {
    console.log('No suitable starting index found for the clue.');
    return false; // No suitable starting index was found
  }

  console.log(`Suggested clue index: ${JSON.stringify(obj)}`);
  return obj;
};

function getClueIndexAgainstAnswerStartingIndex_backup_050324(orientation, answerStartingIndexI, answerStartingIndexJ) {
  let obj = {
    clueIndex: {
      clueIndexI: null,
      clueIndexJ: null,
    },
    directionFlow: "",
  };

  // Function to check if a cell is suitable for placing a clue index
  const isCellSuitable = (i, j) => gridSnapshot[i] && gridSnapshot[i][j] === null;

  if (orientation === "ROW") {
    if (answerStartingIndexJ > 0 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ - 1)) {
      // Directly to the left of the starting index for RIGHT flow
      obj.clueIndex = { clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ - 1 };
      obj.directionFlow = "RIGHT";
    } else if (answerStartingIndexI > 0 && isCellSuitable(answerStartingIndexI - 1, answerStartingIndexJ)) {
      // One cell above for DOWN_RIGHT flow
      obj.clueIndex = { clueIndexI: answerStartingIndexI - 1, clueIndexJ: answerStartingIndexJ };
      obj.directionFlow = "DOWN_RIGHT";
    } else if (answerStartingIndexI < gridSnapshot.length - 1 && isCellSuitable(answerStartingIndexI + 1, answerStartingIndexJ)) {
      // One cell below for UP_RIGHT flow
      obj.clueIndex = { clueIndexI: answerStartingIndexI + 1, clueIndexJ: answerStartingIndexJ };
      obj.directionFlow = "UP_RIGHT";
    }
  } else if (orientation === "COLUMN") {
    if (isCellSuitable(answerStartingIndexI - 1, answerStartingIndexJ)) {
      // Directly above the starting index for DOWN flow
      obj.clueIndex = { clueIndexI: answerStartingIndexI - 1, clueIndexJ: answerStartingIndexJ };
      obj.directionFlow = "DOWN";
    } else if (answerStartingIndexJ > 0 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ - 1)) {
      // One cell to the left for RIGHT_DOWN flow
      obj.clueIndex = { clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ - 1 };
      obj.directionFlow = "RIGHT_DOWN";
    } else if (answerStartingIndexJ < gridSnapshot[0].length - 1 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ + 1)) {
      // One cell to the right for LEFT_DOWN flow
      obj.clueIndex = { clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ + 1 };
      obj.directionFlow = "LEFT_DOWN";
    }
  }

  // Validate the generated clue index and direction flow
  if (obj.clueIndex.clueIndexI === null || obj.clueIndex.clueIndexJ === null) {
    console.error('No suitable starting index found for the clue.');
    return null; // Indicate failure to find a suitable clue index
  }

  // Return the generated clue index and direction flow
  return obj;
}

function getClueIndexAgainstAnswerStartingIndex(orientation, answerStartingIndexI, answerStartingIndexJ) {
  let obj = {
    clueIndex: {
      clueIndexI: null,
      clueIndexJ: null,
    },
    directionFlow: "",
  };

  // Updated to exclude cells with clues or part of another answer.
  const isCellSuitable = (i, j) => {
    const isValid = i >= 0 && i < gridSnapshot.length && j >= 0 && j < gridSnapshot[i].length;
    // Exclude cells with any content (assuming null means empty)
    return isValid && gridSnapshot[i][j] === null;
  };

  if (orientation === "ROW") {
    // Left of the starting index
    if (answerStartingIndexJ > 0 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ - 1)) {
      obj.clueIndex = { clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ - 1 };
      obj.directionFlow = "RIGHT";
    } 
    // Above the starting index
    else if (answerStartingIndexI > 0 && isCellSuitable(answerStartingIndexI - 1, answerStartingIndexJ)) {
      obj.clueIndex = { clueIndexI: answerStartingIndexI - 1, clueIndexJ: answerStartingIndexJ };
      obj.directionFlow = "DOWN_RIGHT";
    } 
    // Below the starting index
    else if (answerStartingIndexI < gridSnapshot.length - 1 && isCellSuitable(answerStartingIndexI + 1, answerStartingIndexJ)) {
      obj.clueIndex = { clueIndexI: answerStartingIndexI + 1, clueIndexJ: answerStartingIndexJ };
      obj.directionFlow = "UP_RIGHT";
    }
  } else if (orientation === "COLUMN") {
    // Directly above the starting index
    if (isCellSuitable(answerStartingIndexI - 1, answerStartingIndexJ)) {
      obj.clueIndex = { clueIndexI: answerStartingIndexI - 1, clueIndexJ: answerStartingIndexJ };
      obj.directionFlow = "DOWN";
    } 
    // To the left of the starting index
    else if (answerStartingIndexJ > 0 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ - 1)) {
      obj.clueIndex = { clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ - 1 };
      obj.directionFlow = "RIGHT_DOWN";
    } 
    // To the right of the starting index
    else if (answerStartingIndexJ < gridSnapshot[0].length - 1 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ + 1)) {
      obj.clueIndex = { clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ + 1 };
      obj.directionFlow = "LEFT_DOWN";
    }
  }
  console.log(JSON.stringify(obj));

  if(obj.clueIndex.clueIndexI === null || obj.clueIndex.clueIndexJ === null ){
    return null;
  }
  console.log(colors.bgRed('gridSnapshot[obj.clueIndex.clueIndexI][obj.clueIndex.clueIndexJ]', gridSnapshot[obj.clueIndex.clueIndexI][obj.clueIndex.clueIndexJ]))
  // if (obj.clueIndex.clueIndexI === null || obj.clueIndex.clueIndexJ === null) {
    // if (gridSnapshot[obj.clueIndex.clueIndexI][obj.clueIndex.clueIndexJ] !== null ){
      if (gridSnapshot[obj.clueIndex.clueIndexI] &&
        obj.clueIndex.clueIndexJ >= 0 &&
        obj.clueIndex.clueIndexJ < gridSnapshot[obj.clueIndex.clueIndexI].length &&
        gridSnapshot[obj.clueIndex.clueIndexI][obj.clueIndex.clueIndexJ] !== null) {
          console.log(colors.bgRed('No suitable starting index found for the clue.'));
          return null;
    }
    
  

  return obj;
}







const getClueIndexAgainstAnswerStartingIndex_0702_0 = (orientation, answerStartingIndexI, answerStartingIndexJ, answerLength) => {
  let obj = {
    clueIndex: {
      clueIndexI: null,
      clueIndexJ: null,
    },
    directionFlow: "",
  };

  console.log(colors.yellow('getClueIndexAgainstAnswerStartingIndex  orientation,answerStartingIndexI,answerStartingIndexJ',  orientation, answerStartingIndexI, answerStartingIndexJ));

  switch (orientation) {
    case "ROW":
      // RIGHT - UP_RIGHT - DOWN_RIGHT
      if (answerStartingIndexJ > 0 && gridSnapshot[answerStartingIndexI][answerStartingIndexJ - 1] === null) {
        obj.clueIndex.clueIndexI = answerStartingIndexI;
        obj.clueIndex.clueIndexJ = answerStartingIndexJ - 1;
        obj.directionFlow = "RIGHT";
      }
      if (answerStartingIndexI > 0 && gridSnapshot[answerStartingIndexI - 1][answerStartingIndexJ] === null) {
        obj.clueIndex.clueIndexI = answerStartingIndexI - 1;
        obj.clueIndex.clueIndexJ = answerStartingIndexJ;
        obj.directionFlow = "DOWN_RIGHT";
      }
      if (answerStartingIndexI < gridSnapshot.length - 1 && gridSnapshot[answerStartingIndexI + 1][answerStartingIndexJ] === null) {
        obj.clueIndex.clueIndexI = answerStartingIndexI + 1;
        obj.clueIndex.clueIndexJ = answerStartingIndexJ;
        obj.directionFlow = "UP_RIGHT";
      }
      break;
    case "COLUMN":
      // DOWN - LEFT_DOWN - RIGHT_DOWN
      if (answerStartingIndexI < (gridSnapshot.length - 1) && gridSnapshot[answerStartingIndexI + 1][answerStartingIndexJ] === null) {
        obj.clueIndex.clueIndexI = answerStartingIndexI + 1;
        obj.clueIndex.clueIndexJ = answerStartingIndexJ;
        obj.directionFlow = "DOWN";
      }
      if (answerStartingIndexJ < (gridSnapshot[0].length - 1) && gridSnapshot[answerStartingIndexI][answerStartingIndexJ + 1] === null) {
        obj.clueIndex.clueIndexI = answerStartingIndexI;
        obj.clueIndex.clueIndexJ = answerStartingIndexJ + 1;
        obj.directionFlow = "LEFT_DOWN";
      }
      if (answerStartingIndexJ > 0 && gridSnapshot[answerStartingIndexI][answerStartingIndexJ - 1] === null) {
        obj.clueIndex.clueIndexI = answerStartingIndexI;
        obj.clueIndex.clueIndexJ = answerStartingIndexJ - 1;
        obj.directionFlow = "RIGHT_DOWN";
      }
      break;
  }

  if (obj.clueIndex.clueIndexI === null || obj.clueIndex.clueIndexJ === null) {
    return false; // Return false if no valid clue index was found
  }

  return obj;
};


const getClueIndexAgainstAnswerStartingIndex_backup = (
  orientation,
  answerStartingIndexI,
  answerStartingIndexJ
) => {
  let obj = {
    clueIndex: {
      clueIndexI: null,
      clueIndexJ: null,
    },
    directionFlow: "",
  };
  console.log(colors.yellow('getClueIndexAgainstAnswerStartingIndex  orientation,answerStartingIndexI,answerStartingIndexJ',  orientation,
  answerStartingIndexI,
  answerStartingIndexJ));
  switch (orientation) {
    case "ROW":
      //RIGHT - UP_RIGHT - DOWN_RIGHT
      if (gridSnapshot[answerStartingIndexI][answerStartingIndexJ - 1] && gridSnapshot[answerStartingIndexI][answerStartingIndexJ - 1] === null) {
        obj.clueIndex.clueIndexI = answerStartingIndexI;
        obj.clueIndex.clueIndexJ = answerStartingIndexJ - 1;
        obj.directionFlow = "RIGHT";
      } else if (
        gridSnapshot[answerStartingIndexI - 1][answerStartingIndexJ] &&
        gridSnapshot[answerStartingIndexI - 1][answerStartingIndexJ] === null
      ) {
        obj = {
          clueIndex: {
            clueIndexI: answerStartingIndexI - 1,
            clueIndexJ: answerStartingIndexJ,
          },
          directionFlow: "DOWN_RIGHT",
        };
      } else if (
        gridSnapshot[answerStartingIndexI + 1][answerStartingIndexJ] &&
        gridSnapshot[answerStartingIndexI + 1][answerStartingIndexJ] === null
      ) {
        obj = {
          clueIndex: {
            clueIndexI: answerStartingIndexI + 1,
            clueIndexJ: answerStartingIndexJ,
          },
          directionFlow: "UP_RIGHT",
        };
      } else {
        // continue;
      }
      return obj;
      break;
    case "COLUMN":
      // - DOWN - LEFT_DOWN - RIGHT_DOWN
      console.log("inside getClueIndexAgainstAnswerStartingIndex",orientation,answerStartingIndexI,answerStartingIndexJ);
      console.log(colors.yellow("answerStartingIndexI > 0", answerStartingIndexI > 0));
      // console.log(colors.yellow("gridSnapshot[answerStartingIndexI-1][answerStartingIndexJ]",gridSnapshot[answerStartingIndexI - 1][answerStartingIndexJ]));
      // console.log(colors.yellow("gridSnapshot[answerStartingIndexI-1][answerStartingIndexJ] === null",gridSnapshot[answerStartingIndexI - 1][answerStartingIndexJ] === null));
      // console.log(colors.yellow(answerStartingIndexI > 0 && gridSnapshot[answerStartingIndexI - 1][answerStartingIndexJ] !== undefined && gridSnapshot[answerStartingIndexI - 1][answerStartingIndexJ] === null ));
      if (answerStartingIndexI > 0 && gridSnapshot[answerStartingIndexI - 1][answerStartingIndexJ] !== undefined && gridSnapshot[answerStartingIndexI - 1][answerStartingIndexJ] === null) {
        obj.clueIndex.clueIndexI = answerStartingIndexI - 1;
        obj.clueIndex.clueIndexJ = answerStartingIndexJ;
        obj.directionFlow = "DOWN";
        console.log(colors.blue("INSIDE if ", obj));
      } else if (
        gridSnapshot[answerStartingIndexI][answerStartingIndexJ + 1] !==
          undefined &&
        gridSnapshot[answerStartingIndexI][answerStartingIndexJ + 1] === null
      ) {
        console.log(colors.blue("INSIDE ELSE 1", obj));
        obj.clueIndex.clueIndexI = answerStartingIndexI;
        obj.clueIndex.clueIndexJ = answerStartingIndexJ + 1;
        obj.directionFlow = "LEFT_DOWN";
        console.log(colors.blue("INSIDE ELSE 1", obj));
      } else if (
        gridSnapshot[answerStartingIndexI][answerStartingIndexJ - 1] !==
          undefined &&
        gridSnapshot[answerStartingIndexI][answerStartingIndexJ - 1] === null
      ) {
        obj.clueIndex.clueIndexI = answerStartingIndexI;
        obj.clueIndex.clueIndexJ = answerStartingIndexJ - 1;
        obj.directionFlow = "RIGHT_DOWN";
        console.log(colors.blue("INSIDE ELSE 2", obj));
      } else {
        return false;
      }

      return obj;
      break;
  }
};

const getAnswerCoordinatesAgainstClue_backup = (
  orientation,
  clueIndexI,
  clueIndexJ,
  directionFlow,
  clueObject
) => {
  let obj;
  switch (orientation) {
    case "ROW":
      switch (directionFlow) {
        case "RIGHT":
          obj = new Object();
          obj.answerStartingIndexI = clueIndexI;
          obj.answerStartingIndexJ = clueIndexJ + 1;
          obj.answerEndingIndexI = obj.answerStartingIndexI;
          obj.answerEndingIndexJ = obj.answerStartingIndexJ + (clueObject.answer.length - 1);
          break;

        case "UP_RIGHT":
          obj = new Object();
          obj.answerStartingIndexI = clueIndexI - 1;
          obj.answerStartingIndexJ = clueIndexJ;
          obj.answerEndingIndexI = obj.answerStartingIndexI;
          obj.answerEndingIndexJ =
            obj.answerStartingIndexJ + (clueObject.answer.length - 1);
          break;
        case "DOWN_RIGHT":
          obj = new Object();
          obj.answerStartingIndexI = clueIndexI + 1;
          obj.answerStartingIndexJ = clueIndexJ;
          obj.answerEndingIndexI = obj.answerStartingIndexI;
          obj.answerEndingIndexJ =
            obj.answerStartingIndexJ + (clueObject.answer.length - 1);
          break;
        default:
          break;
      }
      break;
    case "COLUMN":
      switch (directionFlow) {
        case "DOWN":
          obj = new Object();
          obj.answerStartingIndexI = clueIndexI + 1;
          obj.answerStartingIndexJ = clueIndexJ;
          obj.answerEndingIndexI =
            obj.answerStartingIndexI + (clueObject.answer.length - 1);
          obj.answerEndingIndexJ = obj.answerStartingIndexJ;
          break;
        case "LEFT_DOWN":
          obj = new Object();
          obj.answerStartingIndexI = clueIndexI;
          obj.answerStartingIndexJ = clueIndexJ - 1;
          obj.answerEndingIndexI =
          obj.answerStartingIndexI + (clueObject.answer.length - 1);
          obj.answerEndingIndexJ = obj.answerStartingIndexJ;
          break;
        case "RIGHT_DOWN":
          obj = new Object();
          obj.answerStartingIndexI = clueIndexI;
          obj.answerStartingIndexJ = clueIndexJ + 1;
          obj.answerEndingIndexI =
            obj.answerStartingIndexI + (clueObject.answer.length - 1);
          obj.answerEndingIndexJ = obj.answerStartingIndexJ;
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
  if(obj.answerEndingIndexI >= 9 ){
    obj.answerEndingIndexI = 8;
  }

  if(obj.answerEndingIndexJ >= 9 ){
    obj.answerEndingIndexJ = 8;
  }
  return obj;
  
};

const getAnswerCoordinatesAgainstClue = (
  orientation,
  clueIndexI,
  clueIndexJ,
  directionFlow,
  clueObject
) => {
  console.log(' orientation,clueIndexI,clueIndexJ,directionFlow,clueObject',  orientation,
  clueIndexI,
  clueIndexJ,
  directionFlow,
  clueObject)
  let obj;
  switch (orientation) {
    case "ROW":
      switch (directionFlow) {
        case "RIGHT":
          obj = new Object();
          obj.answerStartingIndexI = clueIndexI;
          obj.answerStartingIndexJ = clueIndexJ + 1;
          obj.answerEndingIndexI = obj.answerStartingIndexI;
          obj.answerEndingIndexJ = obj.answerStartingIndexJ + (clueObject.answer.length - 1);
          break;

        case "UP_RIGHT":
          obj = new Object();
          obj.answerStartingIndexI = clueIndexI - 1;
          obj.answerStartingIndexJ = clueIndexJ;
          obj.answerEndingIndexI = obj.answerStartingIndexI;
          obj.answerEndingIndexJ =
            obj.answerStartingIndexJ + (clueObject.answer.length - 1);
          break;

        case "DOWN_RIGHT":
          obj = new Object();
          obj.answerStartingIndexI = clueIndexI + 1;
          obj.answerStartingIndexJ = clueIndexJ;
          obj.answerEndingIndexI = obj.answerStartingIndexI;
          obj.answerEndingIndexJ =
            obj.answerStartingIndexJ + (clueObject.answer.length - 1);
          break;

        default:
          console.log("Unsupported direction flow in ROW orientation.");
          break;
      }
      break;

    case "COLUMN":
      switch (directionFlow) {
        case "DOWN":
          obj = new Object();
          obj.answerStartingIndexI = clueIndexI + 1;
          obj.answerStartingIndexJ = clueIndexJ;
          obj.answerEndingIndexI =
            obj.answerStartingIndexI + (clueObject.answer.length - 1);
          obj.answerEndingIndexJ = obj.answerStartingIndexJ;
          break;

        case "LEFT_DOWN":
          obj = new Object();
          obj.answerStartingIndexI = clueIndexI;
          obj.answerStartingIndexJ = clueIndexJ - 1;
          obj.answerEndingIndexI =
            obj.answerStartingIndexI + (clueObject.answer.length - 1);
          obj.answerEndingIndexJ = obj.answerStartingIndexJ;
          break;

        case "RIGHT_DOWN":
          obj = new Object();
          obj.answerStartingIndexI = clueIndexI;
          obj.answerStartingIndexJ = clueIndexJ + 1;
          obj.answerEndingIndexI =
            obj.answerStartingIndexI + (clueObject.answer.length - 1);
          obj.answerEndingIndexJ = obj.answerStartingIndexJ;
          break;

        default:
          console.log("Unsupported direction flow in COLUMN orientation.");
          break;
      }
      break;

    default:
      console.log("Unsupported orientation.");
      break;
  }

  // Ensure the answer does not exceed the grid boundaries
  if (obj.answerEndingIndexI >= 9) {
    obj.answerEndingIndexI = 8;
  }
  if (obj.answerEndingIndexJ >= 9) {
    obj.answerEndingIndexJ = 8;
  }

  // Check for clue markers at the starting index
  if (['#', '*'].includes(gridSnapshot[obj.answerStartingIndexI][obj.answerStartingIndexJ])) {
    console.log("Starting index contains a clue marker. Clue placement is invalid.");
    return null;
  }

  return obj;
};



const gridSnapshotFillerUtil = (orientation,clueObject,clueIndexI,clueIndexJ,directionFlow
) => {
  console.log("inside gridSnapshopFillerUtil",orientation,clueIndexI,clueIndexJ,directionFlow);
  console.log(colors.bgRed(clueObject))

  // Mark the clue cell on the grid
  

  // Get the starting coordinates for the answer based on the clue placement
  let answerStartingCordinates = getAnswerCoordinatesAgainstClue(
    orientation,
    clueIndexI,
    clueIndexJ,
    directionFlow,
    clueObject
  );
  if (!answerStartingCordinates){
    console.log(colors.bgRed('received an invalid answerStartingCordinates, exiting to callee'))
    return false;
  }
  console.log(colors.bgBlue('inside gridsnapshotfillerutil , answerStaringCordinates', ))
  console.log("answerStartingCordinates", answerStartingCordinates);
  gridSnapshot[clueIndexI][clueIndexJ] = orientation === 'ROW' ? '#' : '*';
  // Fill the grid with the answer based on the orientation and direction flow
  let j = 0;
  switch (orientation) {
    case "ROW":
      console.log("***ROW****");
      j = 0;
      // for (var i = 0; i < clueObject.answer.length; i++) {
      for (var i = answerStartingCordinates["answerStartingIndexJ"]; i <= answerStartingCordinates["answerEndingIndexJ"]; i++) {
        gridSnapshot[answerStartingCordinates["answerStartingIndexI"]][answerStartingCordinates["answerStartingIndexJ"] + j] = clueObject.answer[j];
        j++;
      }
      break;
    case "COLUMN":
      console.log("***COLUMN****");
      // for (var i = 0; i < clueObject.answer.length; i++) {
       j = 0;
      for (var i = answerStartingCordinates.answerStartingIndexI; i <= answerStartingCordinates.answerEndingIndexI; i++) {
        gridSnapshot[answerStartingCordinates.answerStartingIndexI + j][answerStartingCordinates["answerStartingIndexJ"]] = clueObject.answer[j];
        j++;
        
      }
      break;
    default:
      break;
  }

  // Print the current state of the grid to the console
  printGrid();
  addToDiary( orientation, {clueIndexI,clueIndexJ},directionFlow,answerStartingCordinates,clueObject);
  console.log(colors.bgBrightMagenta(JSON.stringify(clueDiary)));
};

const addToDiary_backup = (orientation, clueIndex, directionFlow,answerStartingCordinates,clueObject) => {
  let size = getClueSize(clueObject.answer);
  clueDiary[size].push({
    clueNumber: clueDiary[`${getClueSize(clueObject.answer)}`].length + 1,
    clueObject,
    orientation,
    startingIndex: {...answerStartingCordinates},
    clueIndex,
    directionFlow,
  })
}

const addToDiary = (orientation, clueIndex, directionFlow, answerStartingCordinates, clueObject) => {
  let size = getClueSize(clueObject.answer);

  // Calculate total number of clues across all sizes
  let totalClues = 0;
  Object.keys(clueDiary).forEach(sizeKey => {
    totalClues += clueDiary[sizeKey].length;
  });

  // Add new clue with the clueNumber being totalClues + 1
  clueDiary[size].push({
    clueNumber: totalClues + 1,
    clueObject,
    orientation,
    startingIndex: {...answerStartingCordinates},
    clueIndex,
    directionFlow,
  });
}


const setCluesForActivePuzzleOfAnyType = async (type) => {
  switch (type) {
    case "XL":
      //
      let startingIndexI = null;
      let startingIndexJ = null;
      let currentClueLength;
      let wordStructure = '';
      let counterArr = [];
      console.log(colors.yellow('NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE', NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE));
      for (let i = 0; i < NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE; i++) {
        counterArr.push(i);
      }
      
      for(counter of counterArr){
        if(counter === 0){
          let currentOrientation = 'ROW';
          let currentClueLength = getRandomizedClueLengthAgainstType("XL");
          // startingIndexI = randomIntBetweenRange(0,8);
          startingIndexI = randomIntBetweenRange(0,5);
          startingIndexJ = randomIntBetweenRange(0, (9 -  currentClueLength));
          
          for(let i = 0 ; i < currentClueLength; i++){
            if(gridSnapshot[startingIndexI][startingIndexJ+i] === null){
              wordStructure += '-'
            }else{
              wordStructure += gridSnapshot[startingIndexI][startingIndexJ+i];
            }
          }
          console.log('wordStructure', wordStructure)
          let wordStructureObj = await analyzeString(wordStructure);
          const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
           
            if (obj === null) {
              continue;
            }
            let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("ROW",startingIndexI,startingIndexJ, currentClueLength);
           
          let clueObj = await getClueAgainstAnswerLength(currentClueLength);
          let newXLClue = {
            clueObject: clueObj,
            orientation:'ROW',
            answerStartingIndex: {
              indexI: startingIndexI,
              indexJ: startingIndexJ,
            },
            clueIndex: clueStartingIndexDetails.clueIndex,
            directionFlow: clueStartingIndexDetails.directionFlow,
          };
          gridSnapshotFillerUtil(newXLClue.orientation, newXLClue.clueObject, newXLClue.clueIndex.clueIndexI, newXLClue.clueIndex.clueIndexJ, newXLClue.directionFlow)
         
        }else{
          // this case if for a handling column of XL size once the row has been setup.
          
          let mainFlagForXLWord1Placement = false;
          let previousXLWordIIndex = clueDiary.xl[0].startingIndex.answerStartingIndexI;
          while(!mainFlagForXLWord1Placement){
            wordStructure = '';
            let startingIndexJFlag = false;
            currentClueLength = getRandomizedClueLengthAgainstType("XL");
            if(clueDiary.xl.length > 0){
              
              if(previousXLWordIIndex === 0){
                currentClueLength = 8;
                startingIndexI = 1;
              }else{
                currentClueLength = 9;
                startingIndexI = 0;
              }
            }else{
              currentClueLength = 9;
              startingIndexI = 0;
            }
            do{
              // startingIndexJ = randomIntBetweenRange(0,8);
              startingIndexJ = randomIntBetweenRange(0,5);
              if(gridSnapshot[startingIndexI][startingIndexJ] === null){
                startingIndexJFlag = true;
              }
            }while(!startingIndexJFlag)
            for(let i = 0 ; i < currentClueLength; i++){
              if(gridSnapshot[startingIndexI+i][startingIndexJ] === null){
                wordStructure += '-'
              }else{
                wordStructure += gridSnapshot[startingIndexI+i][startingIndexJ];
              }
            }
            if(wordStructure.includes('*') ||wordStructure.includes('#')){
              continue;
            }
            console.log('wordStructure', wordStructure)
            let wordStructureObj = await analyzeString(wordStructure);
            console.log(wordStructureObj)
            const clueObj = await getClueWithSpecificAnswerPattern(wordStructureObj);
            if (clueObj === null) {
              continue;
            }
            console.log(colors.red(clueObj))
            let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex("COLUMN",startingIndexI,startingIndexJ);
            // let clueObj = await getClueAgainstAnswerLength(currentClueLength);
            
            let newXLClue = {
              clueObject: clueObj,
              orientation:'COLUMN',
              answerStartingIndex: {
                indexI: startingIndexI,
                indexJ: startingIndexJ,
              },
              clueIndex: clueStartingIndexDetails.clueIndex,
              directionFlow: clueStartingIndexDetails.directionFlow,
            };
            gridSnapshotFillerUtil(newXLClue.orientation, newXLClue.clueObject, newXLClue.clueIndex.clueIndexI, newXLClue.clueIndex.clueIndexJ, newXLClue.directionFlow)
         
          mainFlagForXLWord1Placement = true;
          }
          }
      }
      console.log(colors.yellow(JSON.stringify(clueDiary)));
      await generateAndPlaceALargeWord();
      findPotentialPlacements();
      scanAndFillLastBorders();
      // scanGridForPossibleClues('ROW');
      // console.log(colors.red( await findAllPossibleCluePaths('COLUMN')))
      
      
      break;
    case "L":
      // console.log(colors.blue('Adding Large Size Word Now.'));
      // for (let i = 0; i < NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE; i++) {
      //   let currentClueLength = getRandomizedClueLengthAgainstType("L");
      // }
      // console.log(cluesObj);
      break;
    case "M":
      for (let i = 0; i < NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE; i++) {
        let currentClueLength = getRandomizedClueLengthAgainstType("M");
        let obj = await getClueAgainstAnswerLength(currentClueLength);
        // console.log('CurrentClueLength: ', currentClueLength, obj);
        // console.log('currentClueLength', currentClueLength, 'Clue', obj.clue, 'Answer', obj.answer);
        cluesObj.m.push(obj);
        // console.log('currentClueLength', currentClueLength, 'Clue', obj.clue, 'Answer', obj.answer);
      }
      // console.log(cluesObj);
      break;
    case "S":
      break;
    default:
      break;
  }
};

const insertClueInDB = async (clueObject) => {
  try {
    const answersArr = clueObject.answers
      .split(";")
      .map((answer) => answer.trim());
    const clue = new Clue({
      question: clueObject.question,
      answers: answersArr,
    });
    await clue.save();
    console.log(`Clue Saved: ${clue.question}`);
  } catch (error) {
    console.log("Error saving clue in the DB", error);
  }
};


const readXLSXFile = (filePath) => {
  const workbook = xlsx.readFile(filePath);

  // Get the name of the first work sheet
  const sheetName = workbook.SheetNames[0];

  // Convert the worksheet to JSON
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  return jsonData;
};


module.exports = {
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
  gridSnapshopFillerUtil: gridSnapshotFillerUtil,
  setCluesForActivePuzzleOfAnyType,
  scanLineForPossibleClue,  
  readXLSXFile,
  scanGridForPossibleClues
};
