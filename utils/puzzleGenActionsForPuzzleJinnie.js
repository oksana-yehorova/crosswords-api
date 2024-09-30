const {getRandomLosuing} = require('../controllers/losuingController');
const colors = require("colors");
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const {createCanvas, loadImage} = require('canvas');
const path = require('path');
const xlsx = require("xlsx");
const Clue = require("../models/clue.js");
const PuzzleModel = require('../models/puzzle');
const {placeNextClue, findPotentialCluePlacements} = require('./b2bCluesUtil')
const {
  BATCH_SIZE,
  MAX_NUMBER_OF_CLUES,
  MIN_NUMBER_OF_CLUES,
  PERCENTAGE_NUMBER_OF_XL_CLUES,
  PERCENTAGE_NUMBER_OF_L_CLUES,
  PERCENTAGE_NUMBER_OF_M_CLUES,
  PERCENTAGE_NUMBER_OF_S_CLUES,
  CLUE_LENGTH_XL,
  CLUE_LENGTH_L,
  CLUE_LENGTH_M,
  CLUE_LENGTH_S
} = require('../constants');

const ORIENTATION_ENUM = {
  ROW: 'ROW',
  COLUMN: 'COLUMN'
}
const {generatePZHTemplte1} = require('./templates/crossword_template1');

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

const setNumberOfCluesForActivePuzzle = (puzzleState) => {
  puzzleState.NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE = randomIntBetweenRange(
    MIN_NUMBER_OF_CLUES,
    MAX_NUMBER_OF_CLUES
  );
  console.log(
    "NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE",
    puzzleState.NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE
  );
  // NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE = getNumberOfCluesAgainstPercentage("XL");
  //hardcoded temporarily
  puzzleState.NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE = 2;
  puzzleState.NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE = getNumberOfCluesAgainstPercentage(puzzleState, "L");
  puzzleState.NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE = getNumberOfCluesAgainstPercentage(puzzleState, "M");
  // NUMBER_OF_S_CLUES_FOR_ACTIVE_PUZZLE = getNumberOfCluesAgainstPercentage('S');
  puzzleState.NUMBER_OF_S_CLUES_FOR_ACTIVE_PUZZLE =
    puzzleState.NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE - (puzzleState.NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE + puzzleState.NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE +
    puzzleState.NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE);
  console.log(
    "NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE",
    puzzleState.NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE
  );
  console.log(
    "NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE",
    puzzleState.NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE
  );
  console.log(
    "NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE",
    puzzleState.NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE
  );
  console.log(
    "NUMBER_OF_S_CLUES_FOR_ACTIVE_PUZZLE",
    puzzleState.NUMBER_OF_S_CLUES_FOR_ACTIVE_PUZZLE
  );
  console.log(
    "TOTAL OF SPLITTED CLUES",
    puzzleState.NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE +
    puzzleState.NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE +
    puzzleState.NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE +
    puzzleState.NUMBER_OF_S_CLUES_FOR_ACTIVE_PUZZLE
  );
};


const printGrid = (gridSnapshot) => {
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

const getNumberOfCluesAgainstPercentage = (puzzleState, type) => {
  switch (type) {
    case "XL":
      return calculateShare(
        PERCENTAGE_NUMBER_OF_XL_CLUES,
        puzzleState.NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE
      );
    // break;
    case "L":
      return calculateShare(
        PERCENTAGE_NUMBER_OF_L_CLUES,
        puzzleState.NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE
      );
    // break;
    case "M":
      return calculateShare(
        PERCENTAGE_NUMBER_OF_M_CLUES,
        puzzleState.NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE
      );
    // break;
    case "S":
      return calculateShare(
        PERCENTAGE_NUMBER_OF_S_CLUES,
        puzzleState.NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE
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

// const getClueWithSpecificAnswerPattern = async (pattern) => {
//   try {
//     const { totalLength, nonDashCharacters } = pattern;
//     let matchStage;

//     if (nonDashCharacters.length === 0) {
//       matchStage = { $expr: { $eq: [{ $strLenCP: "$answers.text" }, totalLength] } };
//     } else {
//       let regexPattern = nonDashCharacters.reduce((acc, { position, character }) => {
//         acc[position] = character;
//         return acc;
//       }, Array(totalLength).fill('.')).join('');

//       matchStage = { "answers.text": { $regex: `^${regexPattern}$` } };
//     }

//     const clues = await Clue.aggregate([
//       { $unwind: "$answers" },
//       { $match: matchStage },
//       { $project: { question: 1, 'answers.text': 1 } },
//       { $sample: { size: 1 } }
//     ]);

//     return clues.length ? { clue: clues[0].question, answer: clues[0].answers.text } : null;
//   } catch (error) {
//     console.error("Error fetching clue from the database:", error);
//     throw error;
//   }
// };

const getClueWithSpecificAnswerPattern = async (pattern, commonAlphabets = true) => {
  try {
    const {totalLength, nonDashCharacters} = pattern;
    let matchStage;

    if (nonDashCharacters.length === 0) {
      // If commonAlphabets is true, adjust the regex to favor common letters in the first half
      const regexForCommonLetters = commonAlphabets ? `^[ETAOINS]{${Math.ceil(totalLength / 2)}}` : '^';
      matchStage = {
        $expr: {
          $and: [
            {$eq: [{$strLenCP: "$answers.text"}, totalLength]},
            {$regexMatch: {input: "$answers.text", regex: new RegExp(regexForCommonLetters), options: 'i'}}
          ]
        }
      };
    } else {
      let regexPattern = nonDashCharacters.reduce((acc, {position, character}) => {
        acc[position] = character;
        return acc;
      }, Array(total = totalLength).fill('.')).join('');

      // If commonAlphabets is true, modify the regex to incorporate common letters dynamically
      if (commonAlphabets) {
        const halfLength = Math.ceil(totalLength / 2);
        for (let i = 0; i < halfLength; i++) {
          if (regexPattern[i] === '.') {
            regexPattern[i] = '[ETAOINS]';
          }
        }
      }

      matchStage = {"answers.text": {$regex: `^${regexPattern}$`, $options: 'i'}};
    }

    const clues = await Clue.aggregate([
      {$unwind: "$answers"},
      {$match: matchStage},
      {$project: {question: 1, 'answers.text': 1}},
      {$sample: {size: 1}}
    ]);

    return clues.length ? {clue: clues[0].question, answer: clues[0].answers.text.toUpperCase()} : null;
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
      {$unwind: "$answers"}, // Deconstruct the answers array
      {
        $match: {
          $and: [
            {"answers.text": {$regex: regexPattern, $options: 'i'}}, // Match the pattern
            {"answers.text": {$regex: `^.{0,${maxLength}}$`}}, // Check the length does not exceed maxLength
          ]
        }
      },
      {$sample: {size: 1}} // Randomly select one matching clue
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
    const {totalLength, nonDashCharacters} = pattern;

    // If there are no specific characters to match (all dashes),
    // fetch any clue of the appropriate length.
    if (nonDashCharacters.length === 0) {
      return await getClueAgainstAnswerLength(totalLength);
    }

    // Use aggregation to match the answers array elements that have the correct length
    const clues = await Clue.aggregate([
      {$match: {"answers.length": totalLength}},
      {$unwind: "$answers"},
      {$match: {"answers.length": totalLength}},
      {$sample: {size: 10}}, // Get a sample of documents to manually filter later
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
  const largeWordLengthRange = {min: 5, max: 7}; // For example, L-sized words

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
        potentialPlacements.push({orientation: "ROW", index: i});
      }
    }

    // Check each column
    for (let j = 0; j < gridSize; j++) {
      const column = gridSnapshot.map((row) => row[j]);
      if (hasEnoughSpace(column, length)) {
        potentialPlacements.push({orientation: "COLUMN", index: j});
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
    const {totalLength, nonDashCharacters} = pattern;

    // Building the query to match the answer pattern
    let answerPatternQuery = {"answers.length": totalLength};
    nonDashCharacters.forEach((ndc) => {
      const positionKey = `answers.text.${ndc.position}`;
      answerPatternQuery[positionKey] = ndc.character;
    });

    // Use aggregation to match the clues with the specific answer pattern
    const clues = await Clue.aggregate([
      {$unwind: "$answers"}, // Unwind the answers array to treat each answer as a separate document
      {$match: answerPatternQuery}, // Match clues with specific answer pattern
      {$sample: {size: 1}}, // Randomly select one document that matches the query
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
      {$match: {"answers.length": answerLength}}, // Match clues with an answer of the correct length
      {$sample: {size: 1}}, // Randomly select one document that matches the query
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

const getAnswerStartingIndex = (orientation, answerLength, clueIndexI, clueIndexJ, answerDirectionFlow) => {
  let answerStartingIndexI;
  let answerStartingIndexJ;
  console.log('getAnswerStartingIndex: ');
  console.log('orientation, answerLength, clueIndexI, clueIndexJ, answerDirectionFlow', orientation, answerLength, clueIndexI, clueIndexJ, answerDirectionFlow)
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

const generateAndPlaceALargeWord = async (puzzleState) => {
  console.log(colors.blue("Adding Large Size Word Now."));
  let nextB2BClue;
  // clueDiary.xl.map( async (xlClue) => {
  for (const xlClue of puzzleState.clueDiary.xl) {
    console.log(colors.bgBrightMagenta('PROCESSING FOR XL:', xlClue.clueObject.answer, xlClue.orientation))
    let arr = await fetchLargeWordOptionsAgainstXLWord(puzzleState, xlClue);
    // arr.map( (largeWord)=> {
    for (const largeWord of arr) {
      console.log(colors.yellow('now running gridSnapshopFillerUtil for LARGE WORD: ', xlClue.clueObject.answer, xlClue.orientation));
      gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, largeWord.orientation, largeWord.clueObject, largeWord.clueIndex.clueIndexI, largeWord.clueIndex.clueIndexJ, largeWord.directionFlow)
      // 
      let answerCordinates = getAnswerCoordinatesAgainstClue(
        puzzleState.gridSnapshot,
        largeWord.orientation,
        largeWord.clueIndex.clueIndexI,
        largeWord.clueIndex.clueIndexJ,
        largeWord.directionFlow,
        largeWord.clueObject
      );
      nextB2BClue = placeNextClue(puzzleState.gridSnapshot, {
        answerEndingIndexI: answerCordinates.answerEndingIndexI,
        answerEndingIndexJ: answerCordinates.answerEndingIndexJ,
        orientation: getOrientationFromDirectionFlow(xlClue.directionFlow)
      })
      console.log('nextB2BClue', nextB2BClue)
      nextB2BClue ? await generateClueAgainstB2BClueIndex(puzzleState, nextB2BClue) : null;
      // 
    }


  }
  ;

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
        clueIndex: {x: clueObj.clueIndex.clueIndexI, y: clueObj.clueIndex.clueIndexJ},
        startPosition: {x: clueObj.startingIndex.answerStartingIndexI, y: clueObj.startingIndex.answerStartingIndexJ},
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

      const {answer} = clueObj.clueObject;
      let {answerStartingIndexI, answerStartingIndexJ} = clueObj.startingIndex;

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
            index: {x: answerStartingIndexJ, y: answerStartingIndexI},
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

      const {answer} = clueObj.clueObject;
      let {answerStartingIndexI, answerStartingIndexJ} = clueObj.startingIndex;

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
            index: {x: answerStartingIndexI, y: answerStartingIndexJ},
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
      const {answer} = clueObj.clueObject;
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
            index: {x: currentIndexI, y: currentIndexJ},
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

// function updateCellsWithCounter(cells, counter) {
//     // Ensure cells is actually an array
//     if (!Array.isArray(cells)) {
//       console.error('Input is not an array:', cells);
//       return cells; // or handle this situation appropriately
//     }

//     // First, filter cells with exactly two clueNumbers
//     let eligibleCells = cells.filter(cell => cell.clueNumbers.length === 2);

//     // If there aren't enough, add cells with one clueNumber to fill up to 8
//     if (eligibleCells.length < 8) {
//       const backupCells = cells.filter(cell => cell.clueNumbers.length === 1);
//       const needed = 8 - eligibleCells.length;
//       eligibleCells = eligibleCells.concat(backupCells.slice(0, needed));
//     }

//     // Randomly select up to 8 cells if there are more than 8 eligible cells
//     const selectedCells = eligibleCells.length <= 8 ? eligibleCells : eligibleCells.sort(() => 0.5 - Math.random()).slice(0, 8);

//     // Update the cell values and mark as circled
//     selectedCells.forEach((cell, index) => {
//       cell.cellValue = index + 1; // Start cellValue from 1 to 8
//       cell.isCircled = true;
//     });

//     return cells; // Return the full array with updated cells
// }

function updateCellsWithCounter(cells) {
  // Ensure cells is actually an array
  if (!Array.isArray(cells)) {
    console.error('Input is not an array:', cells);
    return cells; // or handle this situation appropriately
  }

  // Shuffle the entire array of cells and pick the first 8
  const shuffledCells = cells.sort(() => 0.5 - Math.random()).slice(0, 8);

  // Update the cell values and mark as circled
  shuffledCells.forEach((cell, index) => {
    cell.cellValue = index + 1; // Start cellValue from 1 to 8
    cell.isCircled = true;
  });

  return cells; // Return the full array with updated cells
}

// async function updateCellsWithLousing(cells) {
//   let attempts = 0;
//   let lousingWord = undefined;
//   while (attempts < 10) {
//     const lousingObject = await getRandomLosuing();
//     lousingWord = lousingObject.Aasseite;  // Double-check the property name
//     console.log('lousingWord', lousingWord);

//     if (!lousingWord) {
//       console.error('Lousing word is undefined:', lousingObject);
//       attempts++;
//       continue;  // Skip this iteration if lousingWord is undefined
//     }

//     const lousingChars = lousingWord.split('');
//     console.log('lousingChars', lousingChars)
//     const matchedCells = [];

//     lousingChars.forEach(char => {
//       const cell = cells.find(c => c.actualContent.toUpperCase() === char.toUpperCase() && (!matchedCells.includes(c)));

//       if (cell) {
//         matchedCells.push(cell);
//       }
//     });

//     if (matchedCells.length === 8) {
//       matchedCells.forEach((cell, index) => {
//         cell.cellValue = index + 1;
//         cell.isCircled = true;
//       });
//       return {cells, lousingWord};
//     }

//     attempts++;
//   }

//   console.error('Failed to find a suitable losuing word after 10 attempts');
//   return false;
// }

async function updateCellsWithLousing_backup250624(cells) {
  console.log('inside updateCellsWithLousing')
  let attempts = 0;
  let lousingWord = undefined;
  let attemptsLimit = 100;


  while (attempts < attemptsLimit) {
    const lousingObject = await getRandomLosuing();
    lousingWord = lousingObject.Aasseite;
    if (!lousingWord) {
      console.error('Lousing word is undefined:', lousingObject);
      attempts++;
      continue;  // Skip this iteration if lousingWord is undefined
    }

    const lousingChars = lousingWord.split('');
    // console.log('lousingChars', lousingChars);
    const matchedCells = [];
    let cluesWithCircledCell = new Set(); // To track clues that already have a circled cell
    lousingChars.forEach(char => {
      // Select non-intersection cells (those belonging to exactly one clue)
      const cell = cells.find(c =>

        c.actualContent.toUpperCase() === char.toUpperCase() &&
        // c.clueNumbers.length === 1 &&
        !cluesWithCircledCell.has(c.clueNumbers[0]) &&
        (!matchedCells.includes(c))
      );
      // console.log(colors.bgRed('c.clueNumbers.length', c.clueNumbers.length))

      if (cell) {
        // console.log(colors.bgRed('inside cell if', cell))
        matchedCells.push(cell);
        cluesWithCircledCell.add(cell.clueNumbers[0]); // Add clue number to the set
      }
    });
    // console.log(colors.bgRed(matchedCells, matchedCells.length))
    if (matchedCells.length === 8) {
      matchedCells.forEach((cell, index) => {
        cell.cellValue = index + 1;
        cell.isCircled = true;
      });

      return {cells, lousingWord: lousingWord.toUpperCase()};
    }

    attempts++;
  }

  console.error(`Failed to find a suitable lousing word after ${attemptsLimit} attempts`);
  return false;
}

async function updateCellsWithLousing(cells) {
  console.log('inside updateCellsWithLousing');
  let attempts = 0;
  let lousingWord = undefined;
  const attemptsLimit = 100;
  const maxCircledPerClue = 1; // Ensuring no more than one circled cell per clue

  while (attempts < attemptsLimit) {
    const lousingObject = await getRandomLosuing();
    lousingWord = lousingObject.Aasseite;

    if (!lousingWord) {
      console.error('Lousing word is undefined:', lousingObject);
      attempts++;
      continue; // Skip this iteration if lousingWord is undefined
    }

    const lousingChars = lousingWord.split('');
    const matchedCells = [];
    const cluesWithCircledCell = new Set(); // Tracks clues with circled cells

    for (const char of lousingChars) {
      // Shuffle cells to ensure randomness in selection
      const shuffledCells = cells.sort(() => Math.random() - 0.5);
      const cell = shuffledCells.find(c =>
        c.actualContent.toUpperCase() === char.toUpperCase() &&
        c.clueNumbers.every(clueNumber => !cluesWithCircledCell.has(clueNumber))
      );

      if (cell) {
        matchedCells.push(cell);
        cell.clueNumbers.forEach(clueNumber => cluesWithCircledCell.add(clueNumber));
        if (matchedCells.length === 8) break; // Stop if enough cells are matched
      }
    }

    if (matchedCells.length === 8) {
      matchedCells.forEach((cell, index) => {
        cell.cellValue = index + 1;
        cell.isCircled = true;
      });

      return {cells, lousingWord: lousingWord.toUpperCase()};
    }

    attempts++;
  }

  console.error(`Failed to find a suitable lousing word after ${attemptsLimit} attempts`);
  return false;
}


function generateCellsArrayFromDiary(clueDiary) {

  const gridLimit = 9; // Assuming a 9x9 grid, adjust as necessary
  const cells = {};

  // Loop through each clue size category
  Object.keys(clueDiary).forEach(sizeKey => {
    clueDiary[sizeKey].forEach(clueObj => {

      const {answer} = clueObj.clueObject;
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
            // content: answer[i],
            content: '',
            status: "UNFILLED",
            clueNumbers: [clueObj.clueNumber.toString()],
            isCircled: false,
            type: "",
            index: {x: currentIndexI, y: currentIndexJ},
            indicator: [{
              isStartingIndex: i === 0,
              type: clueObj.directionFlow,
            }],
            cellValue: 0,
            easyIndex: cellKey,
            actualContent: answer[i],
          };
        } else {
          if (!cells[cellKey].clueNumbers.includes(clueObj.clueNumber.toString())) {
            cells[cellKey].clueNumbers.push(clueObj.clueNumber.toString());
          }
          if (i === 0) {
            // cells[cellKey].indicator.push({isStartingIndex: true, type: clueObj.directionFlow});
            if (!cells[cellKey].indicator.some(ind => ind.isStartingIndex === true && ind.type === clueObj.directionFlow)) {
              cells[cellKey].indicator.push({isStartingIndex: true, type: clueObj.directionFlow});
            }
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

const fetchLargeWordOptionsAgainstXLWord = async (puzzleState, clueDiaryObj) => {
  let usedColumnsArr = [];
  let usedRowsArr = [];
  let largeWordsBranchedFromThisAnchorword;
  // console.log("Lets find Large word options agaisnt",clueDiaryObj.clueObject.answer,);
  // console.log(colors.yellow(clueDiaryObj));
  let largeWordsConnectedToCurrentXLWord = [];
  if (puzzleState.clueDiary.xl.length === 1) {
    // this will allocate 50% of large sized words quota to this anchor word
    largeWordsBranchedFromThisAnchorword = Math.ceil(
      puzzleState.NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE / 2
    );
  } else {
    // this will allocate 30% of large sized words quota to this anchor word
    largeWordsBranchedFromThisAnchorword = Math.ceil(
      puzzleState.NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE * 0.3
    );
  }
  console.log("NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE ", puzzleState.NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE);
  console.log(colors.green("largeWordsBranchedFromThisAnchorword", largeWordsBranchedFromThisAnchorword));
  let totalWordsAccomodated;
  let totalAttempts;
  // switch (clueDiaryObj.orientation) {
  switch (clueDiaryObj.orientation) {
    case "ROW":
      console.log("since orientation for ", clueDiaryObj.clueObject.answer, "is ", clueDiaryObj.orientation, "we will fetch possible vertical Large Sized Placements");
      totalWordsAccomodated = 0;
      totalAttempts = 0;
      while (totalWordsAccomodated != largeWordsBranchedFromThisAnchorword &&
      totalAttempts <= 10) {
        console.log(colors.bgGreen('Attempt# ', totalAttempts));
        totalAttempts++;
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
            if (usedColumnsArr.includes(clueIndexJ)) {
              continue;
            }

            if (puzzleState.gridSnapshot[1][clueIndexJ] === null) {
              flag = true;
              clueStartIndex.indexJ = clueIndexJ;
            } else {
              continue;
            }

          } while (flag === false);
          console.log(colors.green("OUR SELECTED STARTING I,J FOR LARGE WORD 1 IS", 1, clueIndexJ, puzzleState.gridSnapshot[1][clueIndexJ]));
          let wordStructure = "";
          let isSpaceAvailable = true;
          // Check if there is enough space for the Large word vertically
          for (let i = clueStartIndex.indexI; i < clueStartIndex.indexI + currentClueLength && i < puzzleState.gridSnapshot.length; i++) {
            if (puzzleState.gridSnapshot[i][clueStartIndex.indexJ] === null) {
              wordStructure += "-"
              // isSpaceAvailable = false;
              // break;
            } else if (puzzleState.gridSnapshot[i][clueStartIndex.indexJ] !== '*' || puzzleState.gridSnapshot[i][clueStartIndex.indexJ] !== '#' || puzzleState.gridSnapshot[i][clueIndexJ] !== undefined) {
              wordStructure += puzzleState.gridSnapshot[i][clueStartIndex.indexJ];
            } else {
              isSpaceAvailable = false;
              break;
            }

          }
          console.log('wordStructure', wordStructure)
          if (isSpaceAvailable) {
            let wordStructureObj = await analyzeString(wordStructure);
            console.log(wordStructureObj);
            const clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
            if (clue === null) {
              continue;
            }
            console.log("**********************");
            console.log(clue);
            console.log("**********************");

            if (clue) {
              // If a suitable clue is found, fill the grid and update the arrays
              let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex(puzzleState.gridSnapshot, "COLUMN", clueStartIndex.indexI, clueStartIndex.indexJ);
              console.log("clueStartingIndexDetails", clueStartingIndexDetails);
              if (typeof clueStartingIndexDetails === "object" && clueStartingIndexDetails !== null) {
                let newLargeClue = {
                  clueObject: clue,
                  orientation: 'COLUMN',
                  answerStartingIndex: {
                    indexI: clueStartIndex.indexI,
                    indexJ: clueStartIndex.indexJ,
                  },
                  clueIndex: clueStartingIndexDetails.clueIndex,
                  directionFlow: clueStartingIndexDetails.directionFlow,
                };
                let redFlag = false;
                largeWordsConnectedToCurrentXLWord.forEach(largeWord => {
                  if (clueStartingIndexDetails.clueIndex.clueIndexJ === largeWord.answerStartingIndex.indexJ) {
                    redFlag = true;
                  }
                })
                if (redFlag) {
                  console.log(colors.bgRed('************************'));
                  console.log(colors.bgRed('************************'));
                  console.log(colors.bgRed('RED FLAG ENCOUNTERED ...'));
                  console.log(colors.bgRed('************************'));
                  console.log(colors.bgRed('************************'));
                  continue;
                }
                largeWordsConnectedToCurrentXLWord.push(newLargeClue);
                usedColumnsArr.push(clueIndexJ);
                totalWordsAccomodated++;
              } else if (clueStartingIndexDetails === false) {
                continue;
              }


            }
          }

        } else if (clueDiaryObj.startingIndex.answerStartingIndexI === 8) {
          let currentClueLength = getRandomizedClueLengthAgainstType("L");
          // Attempting to start from just above the bottom-most position to ensure intersection
          let potentialStartingIndexI = 8 - currentClueLength + 1; // Adjust to allow for intersection

          let clueIndexJRangeStartingPoint = clueDiaryObj.startingIndex.answerStartingIndexJ;
          let clueIndexJRangeEndingPoint = clueIndexJRangeStartingPoint + clueDiaryObj.clueObject.answer.length - 1;
          let flag = false;
          let clueIndexJ;

          do {
            clueIndexJ = randomIntBetweenRange(clueIndexJRangeStartingPoint, clueIndexJRangeEndingPoint);
            if (usedColumnsArr.includes(clueIndexJ)) {
              continue;
            }

            // Ensure the last row (where XL word is placed) can serve as an intersection point
            if (puzzleState.gridSnapshot[8][clueIndexJ] !== null && puzzleState.gridSnapshot[8][clueIndexJ] !== '*' && puzzleState.gridSnapshot[8][clueIndexJ] !== '#') {
              flag = true;
            } else {
              continue;
            }
          } while (!flag);

          console.log(colors.green("OUR SELECTED STARTING I,J FOR LARGE WORD INTERSECTING WITH XL IS", potentialStartingIndexI, clueIndexJ, puzzleState.gridSnapshot[potentialStartingIndexI][clueIndexJ]));

          // let wordStructure = "-" + puzzleState.gridSnapshot[8][clueIndexJ]; // Starting with '-' to include the rest of the clue structure with intersection at the end
          let wordStructure = '';
          let isSpaceAvailable = true;

          // Check if there is enough space for the Large word vertically above and includes the intersection
          for (let i = potentialStartingIndexI; i < 8; i++) { // Stop before the last row
            if (puzzleState.gridSnapshot[i][clueIndexJ] === null) {
              wordStructure += '-';
            } else if (puzzleState.gridSnapshot[i][clueIndexJ] !== '*' || puzzleState.gridSnapshot[i][clueIndexJ] !== '#' || puzzleState.gridSnapshot[i][clueIndexJ] !== undefined) {
              wordStructure += puzzleState.gridSnapshot[i][clueIndexJ];
            } else {
              isSpaceAvailable = false;
              break;
            }
          }
          console.log(wordStructure)
          if (isSpaceAvailable) {
            let wordStructureObj = await analyzeString(wordStructure);
            const clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
            if (clue) {
              let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex(puzzleState.gridSnapshot, "COLUMN", potentialStartingIndexI - (currentClueLength - 1), clueIndexJ); // Adjust starting index for clue placement
              if (clueStartingIndexDetails) {
                let newLargeClue = {
                  clueObject: clue,
                  orientation: 'COLUMN',
                  answerStartingIndex: {
                    indexI: potentialStartingIndexI - (currentClueLength - 1), // Adjust for actual start
                    indexJ: clueIndexJ,
                  },
                  clueIndex: clueStartingIndexDetails.clueIndex,
                  directionFlow: clueStartingIndexDetails.directionFlow,
                };
                largeWordsConnectedToCurrentXLWord.push(newLargeClue);
                usedColumnsArr.push(clueIndexJ);
                totalWordsAccomodated++;
              }
            }
          }
        } else {
          // console.log("lets get XL words pre and post lengths now: ");
          // console.log("clueDiaryObj.startingIndex.answerStartingIndexI",clueDiaryObj.startingIndex.answerStartingIndexI);
          let post = 8 - clueDiaryObj.startingIndex.answerStartingIndexI;
          let pre = clueDiaryObj.startingIndex.answerStartingIndexI;
          // console.log("pre: ",pre,"post",post,"currentClueLength",currentClueLength);
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
            clueIndexJ = randomIntBetweenRange(clueIndexJRangeStartingPoint, clueIndexJRangeEndingPoint);
            if (usedColumnsArr.includes(clueIndexJ)) {
              continue;
            }
            // if(gridSnapshot[clueStartIndex.indexI][clueIndexJ] === null){
            if (true) {

              clueStartIndex.indexJ = clueIndexJ;
              let flag2 = false;
              do {

                //randomIntBetweenRange(0, (pre-1));
                let startIndexIRange = randomIntBetweenRange(0, (9 - currentClueLength - 1));
                console.log('trying to fetch with clueStartIndex.indexJ', clueStartIndex.indexJ, 'inside fetchLargeWordOptionsAgainstXLWord ** startIndexIRange, ', startIndexIRange, 'currentClueLength', currentClueLength);
                ;
                let sum = startIndexIRange + currentClueLength;
                let wordStructure = "";
                // console.log(colors.yellow('sum: ',sum));
                if (sum < 9) {
                  let alphabetsCounts = 0;
                  for (let i = startIndexIRange; i < sum; i++) {
                    if (puzzleState.gridSnapshot[i][clueIndexJ] !== null && puzzleState.gridSnapshot[i][clueIndexJ] != '*' && puzzleState.gridSnapshot[i][clueIndexJ] != '#') {
                      alphabetsCounts++
                    }
                    if (puzzleState.gridSnapshot[i][clueIndexJ] === null) {
                      wordStructure += "-";
                    } else {
                      wordStructure += puzzleState.gridSnapshot[i][clueIndexJ];
                    }

                  }
                  // check if the wordStructure is not clean, contains many alphabets already, it should be ignored.
                  if (alphabetsCounts > 1) {
                    // console.log(colors.bgYellow('inside alphabetsCount > 1 CONTINUUE BLOCK'))
                    // continue;
                    break;
                  }

                  if (wordStructure.includes('*') || wordStructure.includes('#')) {
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
                    // console.log("**********************");
                    // console.log(obj);
                    // console.log("**********************");
                    let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex(puzzleState.gridSnapshot, "COLUMN", startIndexIRange, clueIndexJ);
                    // console.log("clueStartingIndexDetails",clueStartingIndexDetails);

                    if (typeof clueStartingIndexDetails === "object" && clueStartingIndexDetails !== null) {
                      let newLargeClue = {
                        clueObject: obj,
                        orientation: 'COLUMN',
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
      totalAttempts = 0;
      let count = 0;
      while (totalWordsAccomodated != largeWordsBranchedFromThisAnchorword &&
      totalAttempts <= 10) {
        console.log(colors.bgGreen('Attempt# ', totalAttempts));
        totalAttempts++;
        count++;
        let currentClueLength = getRandomizedClueLengthAgainstType("L");
        let firstPossibleRow = clueDiaryObj.startingIndex.answerStartingIndexI;
        let lastPossibleRow = clueDiaryObj.startingIndex.answerStartingIndexI + (clueDiaryObj.clueObject.answer.length - 1);
        let currentClueIndexI = null;
        let currentClueIndexJ = null;
        let correctRowFlag = false;
        do {
          currentClueIndexI = randomIntBetweenRange(firstPossibleRow, lastPossibleRow);
          console.log('currentClueIndexI', currentClueIndexI)
          if (usedRowsArr.includes(currentClueIndexI)) {
            continue;
          }
          let wordStructure = '';
          for (let j = 0; j <= 8; j++) {
            if (puzzleState.gridSnapshot[currentClueIndexI][j] === undefined) {
              break;
            }
            if (puzzleState.gridSnapshot[currentClueIndexI][j] === null) {
              wordStructure += '-';
            } else {
              wordStructure += puzzleState.gridSnapshot[currentClueIndexI][j];
            }
          }
          if (wordStructure.includes('#') || wordStructure.includes('*')) {
            continue;
          }

          // if(!checkWordStructureStringForMultipleNonDashCharacters(wordStructure)){
          //   continue;
          // }

          if (puzzleState.clueDiary.xl[0].orientation === 'ROW' && puzzleState.clueDiary.xl[0].startingIndex.answerStartingIndexI === currentClueIndexI) {
            console.log(colors.bgRed('clueIndexI is same as XL Row Word IndexI, continue;'))
            continue;
          }


          //analyze this row for clues, clean space otherwise continue;
          let temp = await findSuitableCluePlacement(puzzleState.gridSnapshot, wordStructure, 'ROW', currentClueIndexI, CLUE_LENGTH_L, true);


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
              if (obj === null) {
                console.log('obj === null continuie')
                continue;
              }
              // console.log("********INSDIE THE CURRENT TASK CODE**********");
              // console.log(colors.red(obj));
              let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex(puzzleState.gridSnapshot, "ROW", temp.selectedOption.answerStartingIndex.answerStartingIndexI, temp.selectedOption.answerStartingIndex.answerStartingIndexJ);
              currentClueIndexJ = temp?.startingIndex;
              let newLargeClue = {
                clueObject: obj,
                orientation: 'ROW',
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
  // console.log(colors.yellow(largeWordsConnectedToCurrentXLWord));

  return largeWordsConnectedToCurrentXLWord;

};


function generateWordStructure(gridSnapshot, i, j, directionFlow) {
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

const scanAndFillRemainingCavities = async (puzzleState) => {
  const directionFlows = ['RIGHT', 'UP_RIGHT', 'DOWN_RIGHT', 'DOWN', 'RIGHT_DOWN', 'LEFT_DOWN'];
  for (let i = 0; i < puzzleState.gridSnapshot.length; i++) {
    for (let j = 0; j < puzzleState.gridSnapshot[i].length; j++) {
      if (puzzleState.gridSnapshot[i][j] !== null) {
        continue;
      }
      let availableWordStructuresForThisSpaceArr = [];
      for (const flow of directionFlows) {
        let wordStructure = generateWordStructure(puzzleState.gridSnapshot, i, j, flow);
        if (wordStructure !== null) {
          availableWordStructuresForThisSpaceArr.push({directionFlow: flow, wordStructure});
        }
      }
      let sortedArr = availableWordStructuresForThisSpaceArr.sort((a, b) => {
        const dashCountA = (a.wordStructure.match(/-/g) || []).length;
        const dashCountB = (b.wordStructure.match(/-/g) || []).length;
        return dashCountB - dashCountA; // Sort in descending order of dash counts
      });
      // console.log(colors.bgMagenta(sortedArr))
      for (const item of sortedArr) {
        let wordStructureObj = await analyzeString(item.wordStructure);
        const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
        // console.log("**********************");
        // console.log(obj);
        // console.log("**********************");
        if (typeof obj === "object" && obj !== null) {
          gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, getOrientationFromDirectionFlow(item.directionFlow), obj, i, j, item.directionFlow);
          let clueMarker = getOrientationFromDirectionFlow(item.directionFlow) === 'ROW' ? '#' : '*';
          puzzleState.gridSnapshot[i][j] = clueMarker;
          break;
          printGrid(puzzleState.gridSnapshot);
        }
      }
    }
  }
};

function isSurroundedByClueMarkers(gridSnapshot, i, j) {
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

async function processNullCellsAndFillClues(puzzleState) {

  console.log(colors.bgBlue('processNullCellsAndFillClues'));
  const directionFlows = ['RIGHT', 'LEFT_DOWN', 'DOWN', 'UP_RIGHT', 'DOWN_RIGHT']; // Assuming 'LEFT_DOWN' as a valid direction for your case
  const blockedCellsArr = [];
  const potentiallyFillableCells = [];

  // Iterate through each cell in the grid
  for (let i = 0; i < puzzleState.gridSnapshot.length; i++) {
    for (let j = 0; j < puzzleState.gridSnapshot[i].length; j++) {
      // Skip non-null cells
      if (puzzleState.gridSnapshot[i][j] !== null) continue;

      // Check if surrounded by clue markers
      if (isSurroundedByClueMarkers(puzzleState.gridSnapshot, i, j)) {
        blockedCellsArr.push({i, j, content: '!'});
        continue;
      }

      // Attempt to find a word structure and clue for each direction
      for (const flow of directionFlows) {
        const wordStructure = generateWordStructureAroundNull(puzzleState.gridSnapshot, i, j, flow);
        if (!wordStructure) continue; // Skip if no word structure was generated
        console.log(colors.bgRed('i, j, flow, ', i, j, flow, wordStructure));
        const clue = await getClueForFilledWordStructure(wordStructure);
        if (clue) {
          potentiallyFillableCells.push({
            clueIndex: {clueIndexI: i, clueIndexJ: j},
            directionFlow: flow,
            wordStructure,
            clue
          });
          break; // Stop checking other directions if a clue has been found
        }
      }
    }
  }

  // Now process potentiallyFillableCells to update the grid
  // potentiallyFillableCells.map(cell => {
  for (const cell of potentiallyFillableCells) {
    let orientation = getOrientationFromDirectionFlow(cell?.directionFlow);
    cell.answerStartingIndex = getAnswerCoordinatesAgainstClue(puzzleState.gridSnapshot, orientation, cell.clueIndex.clueIndexI, cell.clueIndex.clueIndexJ, cell?.directionFlow, cell.clue);
    console.log('cell.answerStartingIndex', cell.answerStartingIndex)
    gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, orientation, cell.clue, cell.clueIndex.clueIndexI, cell.clueIndex.clueIndexJ, cell?.directionFlow);
    puzzleState.gridSnapshot[cell.clueIndex.clueIndexI][cell.clueIndex.clueIndexJ] = orientation === 'ROW' ? '#' : '*';
  }
  ;


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

function generateWordStructureAroundNull(gridSnapshot, i, j, directionFlow) {
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
  switch (orientation) {
    case 'ROW':
      for (let i = 0; i < 9; i++) {
        str = '';
        for (let j = 0; j < 9; j++) {
          //get full row wordStructure and make break it into possible clue options:
          if (gridSnapshot[i][j] === null) {
            str += '-';
          } else {
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
    XL: {min: 8, max: 9},
    L: {min: 5, max: 7},
    M: {min: 4, max: 4},
    S: {min: 1, max: 3},
  };

  // Immediately return null if wordStructure is fully occupied without placeholders
  if (!wordStructure.includes('.')) {
    return null;
  }

  let bestSegment = '';
  let totalIntersections = 0;
  let startingIndex = -1;
  let clueIndex = {indexI: -1, indexJ: -1};

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
    XL: {min: 8, max: 9},
    L: {min: 5, max: 7},
    M: {min: 4, max: 4},
    S: {min: 1, max: 3},
  };

  // Check for full occupancy without any placeholders; return null if detected
  if (!wordStructure.includes('-') && wordStructure.match(/[A-Z]/gi).length === wordStructure.length) {
    return null; // No room for additional clues
  }

  let bestSegment = '';
  let totalIntersections = 0;
  let startingIndex = -1;
  let clueIndex = {indexI: -1, indexJ: -1};

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
        return {indexI: index, indexJ: startingIndex - 1};
      } else if (index > 0 && gridSnapshot[index - 1][startingIndex] === null) {
        return {indexI: index - 1, indexJ: startingIndex};
      } else if (index < gridSnapshot.length - 1 && gridSnapshot[index + 1][startingIndex] === null) {
        return {indexI: index + 1, indexJ: startingIndex};
      }
    } else if (orientation === 'COLUMN') {
      // Check above, left, and right of the starting index for a suitable clue index placement
      if (index > 0 && gridSnapshot[index - 1][startingIndex] === null) {
        return {indexI: index - 1, indexJ: startingIndex};
      } else if (startingIndex > 0 && gridSnapshot[index][startingIndex - 1] === null) {
        return {indexI: index, indexJ: startingIndex - 1};
      } else if (startingIndex < gridSnapshot[index].length - 1 && gridSnapshot[index][startingIndex + 1] === null) {
        return {indexI: index, indexJ: startingIndex + 1};
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
    XL: {min: 8, max: 9},
    L: {min: 5, max: 7},
    M: {min: 4, max: 4},
    S: {min: 1, max: 3},
  };

  // Check for full occupancy without any placeholders; return null if detected
  if (!wordStructure.includes('-') && wordStructure.match(/[A-Z]/gi).length === wordStructure.length) {
    return null; // No room for additional clues
  }

  let segments = wordStructure.split(/[*#]/).map((segment, i) => {
    // Calculate segment's start index considering previous markers and segments
    let start = wordStructure.slice(0, wordStructure.indexOf(segment)).replace(/[A-Z]/g, '-').length;
    return {segment, start, intersections: (segment.match(/[A-Z]/gi) || []).length};
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
  let startingIndex = orientation === 'ROW' ? {indexI: index, indexJ: best.start} : {indexI: best.start, indexJ: index};
  let clueIndex = {indexI: startingIndex.indexI, indexJ: startingIndex.indexJ};

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
    XL: {min: 8, max: 9},
    L: {min: 5, max: 7},
    M: {min: 4, max: 4},
    S: {min: 1, max: 3},
  };

  // Exclude segments fully occupied by letters or empty segments
  if (!wordStructure.includes('-') || wordStructure.match(/^[A-Z]*$/) || wordStructure === '') {
    return null;
  }

  let segments = wordStructure.split(/[*#]/).map(segment => {
    let start = wordStructure.indexOf(segment);
    return {segment, start, intersections: (segment.match(/[A-Z]/gi) || []).length};
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
  let startingIndex = orientation === 'ROW' ? {indexI: index, indexJ: best.start} : {indexI: best.start, indexJ: index};

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


const letsAddMoreFillers = async (gridSnapshot, orientation, clueSize) => {
  console.log(colors.bgMagenta(`letsAddMoreFillers ${clueSize} ${orientation}`));
  // const orientation = randomlyPickBetweenRowAndColumn();
  let wordStructure;
  let nextPossibleClues = {};
  nextPossibleClues.xl = [];
  nextPossibleClues.l = [];
  nextPossibleClues.m = [];
  nextPossibleClues.s = [];
  const arr = [];


  switch (orientation) {
    case 'ROW':

      for (let i = 0; i < 9; i++) {
        wordStructure = '';
        for (let j = 0; j < 9; j++) {
          if (gridSnapshot[i][j] === null) {
            wordStructure += '-';
          } else {
            wordStructure += gridSnapshot[i][j];
          }
        }

        const clueSpecs = await analyzeWordStructureAndSuggestClue(wordStructure, 'ROW', i, gridSnapshot)
        // console.log('wordstructure:', wordStructure)  
        //   console.log('clueSpecs',clueSpecs);
        //   console.log(colors.blue('######################################'));
        if (clueSpecs?.clueSize === clueSize) {
          arr.push(clueSpecs);
        }
      }
      break;
    case 'COLUMN':
      for (let i = 0; i < 9; i++) {
        wordStructure = '';
        for (let j = 0; j < 9; j++) {
          if (gridSnapshot[j][i] === null) {
            wordStructure += '-';
          } else {
            wordStructure += gridSnapshot[j][i];
          }
        }

        const clueSpecs = await analyzeWordStructureAndSuggestClue(wordStructure, 'COLUMN', i, gridSnapshot)
        // console.log('wordstructure:', wordStructure)  
        //   console.log('clueSpecs',clueSpecs);
        //   console.log(colors.blue('#############COLUMN CASE################'));
        if (clueSpecs?.clueSize === clueSize) {
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


}

// Finalization steps after processing all clues
const finalizePuzzle = async (puzzleState) => {
  const date = new Date();
  // const formattedDate = [
  //   date.getFullYear(),
  //   ('0' + (date.getMonth() + 1)).slice(-2), // Months are 0-indexed, add 1 to get correct month
  //   ('0' + date.getDate()).slice(-2), // Add leading zero and slice last 2 digits
  // ].join('-'); // Join the components with dashes

  let puzzleObj = new Object();
  puzzleObj.crosswordId = uuidv4();
  puzzleObj.title = 'Puzzle for ' + puzzleState.date;
  puzzleObj.date = puzzleState.date;
  puzzleObj.template = puzzleState.template;
  puzzleObj.gridSize = 9;

  puzzleObj.clues = generateCrosswordFromDiary(puzzleState.clueDiary);
  // puzzleObj.cells = generateCellsArrayFromDiary(puzzleState.clueDiary);
  let cells = generateCellsArrayFromDiary(puzzleState.clueDiary);
  // let arr = updateCellsWithCounter(cells, 8);
  let data = await updateCellsWithLousing(cells);
  console.log('inside finalizePuzzle')
  // console.log(colors.bgRed('cells', cells, 'data:', data))
  puzzleObj.losuingWord = data.lousingWord
  let arr = data.cells;

  puzzleObj.cells = arr;
  puzzleObj.nullCells = generateNullCellObjects(puzzleState.gridSnapshot)

  // savePuzzleToFile(puzzleObj, counter, formattedDate);
  const newPuzzle = new PuzzleModel({
    puzzleData: puzzleObj,
    clueDiary: puzzleState.clueDiary,
    totalClues: puzzleObj.clues['across'].length + puzzleObj.clues['down'].length,
    deadCells: puzzleObj.nullCells.length,
  });
  let payload = await newPuzzle.save();
  console.log('returning payload recieved from mongodb from within processClueFilling');
  printGrid(puzzleState.gridSnapshot);
  return payload;


  // Any remaining steps such as saving the puzzle, updating DB, etc.
  // Return the final result or payload
};

const processClueFilling = async (puzzleState) => {
  const processClue = async (clue, puzzleState, orientation) => {
    let clueStartingIndexDetails = await getClueIndexAgainstAnswerStartingIndex(puzzleState.gridSnapshot, orientation, clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
    console.log('clueStartingIndexDetails', clueStartingIndexDetails);

    if (!clueStartingIndexDetails) {
      console.log(colors.bgRed('No suitable clue index found'));
      return; // Skip processing this clue if no suitable index was found
    }

    // console.log(colors.bgRed(`Suitable clue index found:`, clueStartingIndexDetails));
    let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
    console.log('wordStructureObj', wordStructureObj);
    const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
    console.log("**********************");
    console.log(obj);
    console.log("**********************");
    if (obj) {
      gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, orientation, obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
    }
  };


  console.log('inside processClueFilling')
  // 
  const resRowXL = await letsAddMoreFillers(puzzleState.gridSnapshot, 'ROW', 'XL');
  console.log(colors.bgBlue(resRowXL));
  for (const clue of resRowXL) {
    await processClue(clue, puzzleState, 'ROW');
  }

  // Processing for COLUMN XL
  const resColumnXL = await letsAddMoreFillers(puzzleState.gridSnapshot, 'COLUMN', 'XL');
  console.log(colors.bgBlue(resColumnXL));
  for (const clue of resColumnXL) {
    await processClue(clue, puzzleState, 'COLUMN');
  }

  const resRowL = await letsAddMoreFillers(puzzleState.gridSnapshot, 'ROW', 'L');
  console.log(colors.bgBlue(resRowL));
  for (const clue of resRowL) {
    await processClue(clue, puzzleState, 'ROW');
  }

  const resColumnL = await letsAddMoreFillers(puzzleState.gridSnapshot, 'COLUMN', 'L');
  console.log(colors.bgBlue(resColumnL));
  for (const clue of resColumnL) {
    await processClue(clue, puzzleState, 'COLUMN');
  }

  const resRowM = await letsAddMoreFillers(puzzleState.gridSnapshot, 'ROW', 'M');
  console.log(colors.bgBlue(resRowM));
  for (const clue of resRowM) {
    await processClue(clue, puzzleState, 'ROW');
  }

  const resColumnM = await letsAddMoreFillers(puzzleState.gridSnapshot, 'COLUMN', 'M');
  console.log(colors.bgBlue(resColumnM));
  for (const clue of resColumnM) {
    await processClue(clue, puzzleState, 'COLUMN');
  }

  const resRowS = await letsAddMoreFillers(puzzleState.gridSnapshot, 'ROW', 'S');
  console.log(colors.bgBlue(resRowS));
  for (const clue of resRowS) {
    await processClue(clue, puzzleState, 'ROW');
  }

  const resColumnS = await letsAddMoreFillers(puzzleState.gridSnapshot, 'COLUMN', 'S');
  console.log(colors.bgBlue(resColumnS));
  for (const clue of resColumnS) {
    await processClue(clue, puzzleState, 'COLUMN');
  }

  await scanAndFillRemainingCavities(puzzleState);
  // await processNullCellsAndFillClues(puzzleState);
  const payload = await finalizePuzzle(puzzleState);
  return payload;
  // 
  letsAddMoreFillers(puzzleState.gridSnapshot, 'ROW', 'XL').then(async res => {
    console.log(colors.bgBlue(res));
    for (const clue of res) {
      let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex(puzzleState.gridSnapshot, "ROW", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
      console.log('clueStartingIndexDetails', clueStartingIndexDetails)

      if (!clueStartingIndexDetails) { // No suitable clue index found
        continue;

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
          gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
        }
      }
      printGrid(puzzleState.gridSnapshot);
    }
    ;
    console.log(colors.bgMagenta('letsAddMoreFillers XL COLUMN'));
    // Handling XL clues for COLUMN orientation
    letsAddMoreFillers(puzzleState.gridSnapshot, 'COLUMN', 'XL').then(async res => {
      console.log(colors.bgBlue(res));
      for (const clue of res) {
        let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex(puzzleState.gridSnapshot, "COLUMN", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
        console.log('clueStartingIndexDetails', clueStartingIndexDetails);

        if (!clueStartingIndexDetails) { // No suitable clue index found
          continue;
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
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
          }
        }
      }

      // Handling Large clues: COLUMN
      letsAddMoreFillers(puzzleState.gridSnapshot, 'COLUMN', 'L').then(async res => {
        console.log(colors.bgBlue(res));
        for (const clue of res) {
          let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex(puzzleState.gridSnapshot, "COLUMN", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
          console.log('clueStartingIndexDetails', clueStartingIndexDetails)

          if (!clueStartingIndexDetails) {
            continue;

          } else {
            console.log(colors.bgRed('Suitable clue index found:', clueStartingIndexDetails));
            let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
            console.log('wordStructureObj', wordStructureObj);
            const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
            console.log("**********************");
            console.log(obj);
            console.log("**********************");
            if (obj) {
              gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
            }
          }
        }

        // Handling Large clues: ROW
        letsAddMoreFillers(puzzleState.gridSnapshot, 'ROW', 'L').then(async res => {
          console.log(colors.bgBlue(res));
          for (const clue of res) {
            let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex(puzzleState.gridSnapshot, "ROW", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
            console.log('clueStartingIndexDetails', clueStartingIndexDetails)

            if (!clueStartingIndexDetails) {
              continue;

            } else {
              console.log(colors.bgRed('Suitable clue index found:', clueStartingIndexDetails));
              let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
              console.log('wordStructureObj', wordStructureObj);
              const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
              console.log("**********************");
              console.log(obj);
              console.log("**********************");
              if (obj) {
                gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
              }
            }
          }

          // Handling Medium clues: ROW
          letsAddMoreFillers(puzzleState.gridSnapshot, 'ROW', 'M').then(async res => {
            console.log(colors.bgBlue(res));
            for (const clue of res) {
              let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex(puzzleState.gridSnapshot, "ROW", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
              console.log('clueStartingIndexDetails', clueStartingIndexDetails)

              if (!clueStartingIndexDetails) {
                continue;

              } else {
                let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
                console.log('wordStructureObj', wordStructureObj);
                const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
                console.log("**********************");
                console.log(obj);
                console.log("**********************");
                if (obj) {
                  gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
                }
              }
            }

            // Handling Medium clues: COLUMN
            letsAddMoreFillers(puzzleState.gridSnapshot, 'COLUMN', 'M').then(async res => {
              console.log(colors.bgBlue(res));
              for (const clue of res) {
                let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex(puzzleState.gridSnapshot, "COLUMN", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
                console.log('clueStartingIndexDetails', clueStartingIndexDetails)

                if (!clueStartingIndexDetails) {
                  continue;

                } else {
                  let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
                  console.log('wordStructureObj', wordStructureObj);
                  const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
                  console.log("**********************");
                  console.log(obj);
                  console.log("**********************");
                  if (obj) {
                    gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
                  }
                }
              }

              // Handling Small clues: ROW with adjustments
              letsAddMoreFillers(puzzleState.gridSnapshot, 'ROW', 'S').then(async res => {
                console.log(colors.bgBlue(res));
                for (const clue of res) {
                  let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex(puzzleState.gridSnapshot, "ROW", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
                  console.log('clueStartingIndexDetails', clueStartingIndexDetails);

                  if (!clueStartingIndexDetails) {
                    continue;

                  } else {
                    let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
                    const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
                    if (obj) {
                      gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
                    }
                  }
                }

                // Handling Small clues: COLUMN with adjustments
                letsAddMoreFillers(puzzleState.gridSnapshot, 'COLUMN', 'S').then(async res => {
                  console.log(colors.bgBlue(res));
                  for (const clue of res) {
                    let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex(puzzleState.gridSnapshot, "COLUMN", clue.startingIndex.indexI, clue.startingIndex.indexJ, clue.clueAnswerStructure.length);
                    console.log('clueStartingIndexDetails', clueStartingIndexDetails);

                    if (!clueStartingIndexDetails) {
                      continue;

                    } else {
                      let wordStructureObj = await analyzeString(clue.clueAnswerStructure);
                      const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
                      if (obj) {
                        gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', obj, clueStartingIndexDetails.clueIndex.clueIndexI, clueStartingIndexDetails.clueIndex.clueIndexJ, clueStartingIndexDetails.directionFlow);
                      }
                    }
                  }
                  printGrid(puzzleState.gridSnapshot);
                  console.log(colors.bgGreen('NOW CALLING: scanAndFillRemainingCavities'))
                  await scanAndFillRemainingCavities(puzzleState);
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
                  await processNullCellsAndFillClues(puzzleState);
                  let puzzleObj = new Object();
                  puzzleObj.crosswordId = uuidv4();
                  puzzleObj.title = 'Puzzle ' + formattedDate;
                  puzzleObj.date = formattedDate;
                  puzzleObj.gridSize = 9;
                  puzzleObj.clues = generateCrosswordFromDiary(puzzleState.clueDiary);
                  puzzleObj.cells = generateCellsArrayFromDiary(puzzleState.clueDiary);
                  puzzleObj.nullCells = generateNullCellObjects(puzzleState.gridSnapshot)
                  console.log('generateNullCellObjects', JSON.stringify(generateNullCellObjects(puzzleState.gridSnapshot)))
                  console.log('calling savePuzzleToFile...')
                  savePuzzleToFile(puzzleObj, counter, formattedDate);
                  const newPuzzle = new PuzzleModel({
                    puzzleData: puzzleObj,
                    clueDiary: puzzleState.clueDiary,
                    totalClues: puzzleObj.clues['across'].length + puzzleObj.clues['down'].length,
                    deadCells: puzzleObj.nullCells.length,
                  });
                  let payload = await newPuzzle.save();
                  printGrid(puzzleState.gridSnapshot);
                  console.log('payload', payload);
                  return payload;

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
    const {content, index, status, actualContent} = cell;
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

  const fileName = `puzzle-${uuidv4().slice(0, 5)}-${formattedDate}.json`;
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
    XL: {min: 7, max: 9}, // Adjust these ranges as necessary
    L: {min: 5, max: 6},
    M: {min: 3, max: 4},
    S: {min: 1, max: 2}
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
                clueIndex: {clueIndexI: i, clueIndexJ: j},
                answerStartingIndex: {
                  answerStartingIndexI: orientation === 'ROW' ? i : i,
                  answerStartingIndexJ: orientation === 'COLUMN' ? j : j
                },
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
            answerStartingIndex: {indexI: startIndexI, indexJ: startIndexJ},
            clueIndex: orientation === "ROW" ? {
              clueIndexI: startIndexI,
              clueIndexJ: startIndexJ - 1
            } : {clueIndexI: startIndexI - 1, clueIndexJ: startIndexJ},
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


const findSuitableCluePlacement = (gridSnapshot, wordStructure, scanOrientation, pathIndex, desiredClueSize, intersectionPreferred) => {
  console.log('desiredClueSize', desiredClueSize)
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
            clueIndex: {clueIndexI: pathIndex, clueIndexJ: i},
            answerStartingIndex: {answerStartingIndexI: pathIndex, answerStartingIndexJ: i},
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


const isPathSuitableForGivenClueSizeAndStrcture = (wordStructure, scanOrientation, pathIndex, desiredClueSize) => {

  let lowerLimit = desiredClueSize.split('-')[0];
  let upperrLimit = desiredClueSize.split('-')[1];
  switch (scanOrientation) {
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
  let answerStartingIndexObj = getAnswerStartingIndex(orientation, answerLength, clueIndexI, clueIndexJ, answerDirectionFlow);
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
      nonDashCharacters.push({position: i, character: str[i]});
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
  let answerStartingIndexObj = getAnswerStartingIndex(currentOrientation, answerLength, clueIndexI, clueIndexJ, answerDirectionFlow);
  let test1 = scanPathForAnyCharacter(currentOrientation, answerLength, answerStartingIndexObj.answerStartingIndexI, answerStartingIndexObj.answerStartingIndexJ, "*");
  let test2 = scanPathForAnyCharacter(currentOrientation, answerLength, answerStartingIndexObj.answerStartingIndexI, answerStartingIndexObj.answerStartingIndexJ, "#");
  console.log(colors.red("#######inside clueCellInPathScan, returning ", test1 && test2, "#####"));
  return test1 || test2;
};

const determineCluePlacement = async (puzzleState, SIZE, clueObj, orderInSize) => {
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
                let redFlag = clueCellInPathScan(currentOrientation, clueObj.answer.length, 0, 0, "LEFT_DOWN");
                if (redFlag) {
                  console.log(colors.red("*******ENCOUNTED CLUE IN PATH, trying another coordinates***********", getLineNumber()));
                  continue;
                }

                //use this coordinate as clue cell of current clueObject
                console.log("SETTING COLUMN LEFT edge case, SETTING CLUE AT [0][1]");

                // gridSnapshot[0][1] = "Cc" + orderInSize;
                gridSnapshot[0][1] = "*";
                gridSnapshotFillerUtil(currentOrientation, clueObj, 0, 1, "LEFT_DOWN");
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
                let redFlag = clueCellInPathScan(currentOrientation, clueObj.answer.length, 0, 7, "RIGHT_DOWN");
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

      printGrid(puzzleState.gridSnapshot);
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
        obj.clueIndex = {clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ - 1};
        obj.directionFlow = "RIGHT";
      } else if (answerStartingIndexI > 0 && isCellSuitable(answerStartingIndexI - 1, answerStartingIndexJ)) {
        obj.clueIndex = {clueIndexI: answerStartingIndexI - 1, clueIndexJ: answerStartingIndexJ};
        obj.directionFlow = "DOWN_RIGHT";
      } else if (answerStartingIndexI < gridSnapshot.length - 1 && isCellSuitable(answerStartingIndexI + 1, answerStartingIndexJ)) {
        obj.clueIndex = {clueIndexI: answerStartingIndexI + 1, clueIndexJ: answerStartingIndexJ};
        obj.directionFlow = "UP_RIGHT";
      }
      break;
    case "COLUMN":
      // For COLUMN, adjust logic to account for top row special case
      if (answerStartingIndexI === 0) {
        // If at the top, only consider RIGHT_DOWN or LEFT_DOWN if possible
        if (answerStartingIndexJ > 0 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ - 1)) {
          obj.clueIndex = {clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ - 1};
          obj.directionFlow = "RIGHT_DOWN";
        } else if (answerStartingIndexJ < gridSnapshot[0].length - 1 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ + 1)) {
          obj.clueIndex = {clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ + 1};
          obj.directionFlow = "LEFT_DOWN";
        }
      } else {
        // For other rows, consider DOWN, RIGHT_DOWN, and LEFT_DOWN if not at the top
        if (answerStartingIndexI < gridSnapshot.length - 1 && isCellSuitable(answerStartingIndexI + 1, answerStartingIndexJ)) {
          obj.clueIndex = {clueIndexI: answerStartingIndexI - 1, clueIndexJ: answerStartingIndexJ};
          obj.directionFlow = "DOWN";
        } else if (answerStartingIndexJ > 0 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ - 1)) {
          obj.clueIndex = {clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ - 1};
          obj.directionFlow = "RIGHT_DOWN";
        } else if (answerStartingIndexJ < gridSnapshot[0].length - 1 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ + 1)) {
          obj.clueIndex = {clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ + 1};
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
      obj.clueIndex = {clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ - 1};
      obj.directionFlow = "RIGHT";
    } else if (answerStartingIndexI > 0 && isCellSuitable(answerStartingIndexI - 1, answerStartingIndexJ)) {
      // One cell above for DOWN_RIGHT flow
      obj.clueIndex = {clueIndexI: answerStartingIndexI - 1, clueIndexJ: answerStartingIndexJ};
      obj.directionFlow = "DOWN_RIGHT";
    } else if (answerStartingIndexI < gridSnapshot.length - 1 && isCellSuitable(answerStartingIndexI + 1, answerStartingIndexJ)) {
      // One cell below for UP_RIGHT flow
      obj.clueIndex = {clueIndexI: answerStartingIndexI + 1, clueIndexJ: answerStartingIndexJ};
      obj.directionFlow = "UP_RIGHT";
    }
  } else if (orientation === "COLUMN") {
    if (isCellSuitable(answerStartingIndexI - 1, answerStartingIndexJ)) {
      // Directly above the starting index for DOWN flow
      obj.clueIndex = {clueIndexI: answerStartingIndexI - 1, clueIndexJ: answerStartingIndexJ};
      obj.directionFlow = "DOWN";
    } else if (answerStartingIndexJ > 0 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ - 1)) {
      // One cell to the left for RIGHT_DOWN flow
      obj.clueIndex = {clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ - 1};
      obj.directionFlow = "RIGHT_DOWN";
    } else if (answerStartingIndexJ < gridSnapshot[0].length - 1 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ + 1)) {
      // One cell to the right for LEFT_DOWN flow
      obj.clueIndex = {clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ + 1};
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

function getClueIndexAgainstAnswerStartingIndex(gridSnapshot, orientation, answerStartingIndexI, answerStartingIndexJ) {
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
      obj.clueIndex = {clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ - 1};
      obj.directionFlow = "RIGHT";
    }
    // Above the starting index
    else if (answerStartingIndexI > 0 && isCellSuitable(answerStartingIndexI - 1, answerStartingIndexJ)) {
      obj.clueIndex = {clueIndexI: answerStartingIndexI - 1, clueIndexJ: answerStartingIndexJ};
      obj.directionFlow = "DOWN_RIGHT";
    }
    // Below the starting index
    else if (answerStartingIndexI < gridSnapshot.length - 1 && isCellSuitable(answerStartingIndexI + 1, answerStartingIndexJ)) {
      obj.clueIndex = {clueIndexI: answerStartingIndexI + 1, clueIndexJ: answerStartingIndexJ};
      obj.directionFlow = "UP_RIGHT";
    }
  } else if (orientation === "COLUMN") {
    // Directly above the starting index
    if (isCellSuitable(answerStartingIndexI - 1, answerStartingIndexJ)) {
      obj.clueIndex = {clueIndexI: answerStartingIndexI - 1, clueIndexJ: answerStartingIndexJ};
      obj.directionFlow = "DOWN";
    }
    // To the left of the starting index
    else if (answerStartingIndexJ > 0 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ - 1)) {
      obj.clueIndex = {clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ - 1};
      obj.directionFlow = "RIGHT_DOWN";
    }
    // To the right of the starting index
    else if (answerStartingIndexJ < gridSnapshot[0].length - 1 && isCellSuitable(answerStartingIndexI, answerStartingIndexJ + 1)) {
      obj.clueIndex = {clueIndexI: answerStartingIndexI, clueIndexJ: answerStartingIndexJ + 1};
      obj.directionFlow = "LEFT_DOWN";
    }
  }
  console.log(JSON.stringify(obj));

  if (obj.clueIndex.clueIndexI === null || obj.clueIndex.clueIndexJ === null) {
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

  console.log(colors.yellow('getClueIndexAgainstAnswerStartingIndex  orientation,answerStartingIndexI,answerStartingIndexJ', orientation, answerStartingIndexI, answerStartingIndexJ));

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
  console.log(colors.yellow('getClueIndexAgainstAnswerStartingIndex  orientation,answerStartingIndexI,answerStartingIndexJ', orientation,
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
      console.log("inside getClueIndexAgainstAnswerStartingIndex", orientation, answerStartingIndexI, answerStartingIndexJ);
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
  if (obj.answerEndingIndexI >= 9) {
    obj.answerEndingIndexI = 8;
  }

  if (obj.answerEndingIndexJ >= 9) {
    obj.answerEndingIndexJ = 8;
  }
  return obj;

};

const getAnswerCoordinatesAgainstClue = (
  gridSnapshot,
  orientation,
  clueIndexI,
  clueIndexJ,
  directionFlow,
  clueObject
) => {
  console.log(' orientation,clueIndexI,clueIndexJ,directionFlow,clueObject', orientation, clueIndexI, clueIndexJ, directionFlow, clueObject)
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


const gridSnapshotFillerUtil = (gridSnapshot, clueDiary, orientation, clueObject, clueIndexI, clueIndexJ, directionFlow
) => {
  console.log("inside gridSnapshopFillerUtil", orientation, clueIndexI, clueIndexJ, directionFlow);
  console.log(colors.bgRed(clueObject))

  // Mark the clue cell on the grid


  // Get the starting coordinates for the answer based on the clue placement
  let answerStartingCordinates = getAnswerCoordinatesAgainstClue(
    gridSnapshot,
    orientation,
    clueIndexI,
    clueIndexJ,
    directionFlow,
    clueObject
  );
  if (!answerStartingCordinates) {
    console.log(colors.bgRed('received an invalid answerStartingCordinates, exiting to callee'))
    return false;
  }
  // console.log(colors.bgBlue('inside gridsnapshotfillerutil , answerStaringCordinates', ))
  // console.log("answerStartingCordinates", answerStartingCordinates);
  gridSnapshot[clueIndexI][clueIndexJ] = orientation === 'ROW' ? '#' : '*';
  // Fill the grid with the answer based on the orientation and direction flow
  let j = 0;
  switch (orientation) {
    case "ROW":
      // console.log("***ROW****");
      j = 0;
      // for (var i = 0; i < clueObject.answer.length; i++) {
      for (var i = answerStartingCordinates["answerStartingIndexJ"]; i <= answerStartingCordinates["answerEndingIndexJ"]; i++) {
        gridSnapshot[answerStartingCordinates["answerStartingIndexI"]][answerStartingCordinates["answerStartingIndexJ"] + j] = clueObject.answer[j];
        j++;
      }
      break;
    case "COLUMN":
      // console.log("***COLUMN****");
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
  printGrid(gridSnapshot);
  addToDiary(clueDiary, orientation, {clueIndexI, clueIndexJ}, directionFlow, answerStartingCordinates, clueObject);
  // console.log(colors.bgBrightMagenta(JSON.stringify(clueDiary)));
};

const addToDiary_backup = (orientation, clueIndex, directionFlow, answerStartingCordinates, clueObject) => {
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

const addToDiary = (clueDiary, orientation, clueIndex, directionFlow, answerStartingCordinates, clueObject) => {
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

const generateClueAgainstB2BClueIndex = async (puzzleState, b2bClueObj, splitFlag = false) => {
  console.log(colors.bgGreen('inside generateClueAgainstB2BClueIndex'));
  const {startIndex, orientation} = b2bClueObj;
  const grid = puzzleState.gridSnapshot;
  let maxLength = 0;
  let str = '';

  try {
    if (orientation === 'ROW') {
      maxLength = grid[0].length - startIndex.j;
      for (let i = 0; i < maxLength; i++) {
        let sum = startIndex.j + 1 + i;
        if (grid[startIndex.i][sum] === null) {
          str += '-';
        } else if (grid[startIndex.i][startIndex.j + 1 + i] === '*' ||
          grid[startIndex.i][startIndex.j + 1 + i] === '#') {
          break;
        } else if (grid[startIndex.i][startIndex.j + 1 + i] === undefined) {
          break;
        } else {
          str += grid[startIndex.i][startIndex.j + 1 + i];
        }

      }
      if (!splitFlag) {
        let wordStructureObj = await analyzeString(str);
        const clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
        if (clue) {
          gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, startIndex.i, startIndex.j, 'RIGHT');
          grid[startIndex.i][startIndex.j] = '#';
        } else {
          console.log("No clue matched the generated pattern.");
        }
      } else {
        const firstPartLength = Math.floor(str.length / 2);
        const secondPartLength = str.length - firstPartLength;
        let firstPartStr = '';
        let secondPartStr = '';
        for (let i = 0; i < firstPartLength; i++) {
          firstPartStr += str[i];
        }
        for (let i = firstPartStr.length; i < str.length; i++) {
          console.log('i', i)
          secondPartStr += str[i];
        }

        // 
        let wordStructureObj = await analyzeString(firstPartStr);

        let clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
        console.log('clue', clue)
        if (clue) {
          gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, startIndex.i, startIndex.j, 'RIGHT');
          // grid[startIndex.i][startIndex.j] = '*';
        } else {
          console.log("No clue matched the generated pattern.");
        }
        // 
        wordStructureObj = await analyzeString(secondPartStr.substring(1));
        clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
        if (clue) {
          gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, startIndex.i, (startIndex.j + firstPartStr.length + 1), 'RIGHT');
          // grid[startIndex.i][startIndex.j] = '*';
        } else {
          console.log("No clue matched the generated pattern.");
        }
      }

    } else {
      maxLength = grid.length - startIndex.i - 1;
      for (let i = 0; i < maxLength; i++) {
        if (grid[startIndex.i + 1 + i][startIndex.j] === null) {
          str += '-';
        } else if (grid[startIndex.i + 1 + i][startIndex.j] === '*' ||
          grid[startIndex.i + 1 + i][startIndex.j] === '#') {
          break;
        } else if (grid[startIndex.i + 1 + i][startIndex.j] === '*' ||
          grid[startIndex.i + 1 + i][startIndex.j] === undefined) {
          break;
        } else {
          str += grid[startIndex.i + 1 + i][startIndex.j];
        }
      }
      console.log('inside b2b.. str:', str);
      if (!splitFlag) {
        let wordStructureObj = await analyzeString(str);
        const clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
        if (clue) {
          gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', clue, startIndex.i, startIndex.j, 'DOWN');
          grid[startIndex.i][startIndex.j] = '*';
        } else {
          console.log("No clue matched the generated pattern.");
        }
        return true; // Indicate successful operation
      } else {
        const firstPartLength = Math.floor(str.length / 2);
        const secondPartLength = str.length - firstPartLength;
        let firstPartStr = '';
        let secondPartStr = '';
        for (let i = 0; i < firstPartLength; i++) {
          firstPartStr += str[i];
        }
        for (let i = firstPartStr.length; i < str.length; i++) {
          console.log('i', i)
          secondPartStr += str[i];
        }

        // 
        let wordStructureObj = await analyzeString(firstPartStr);

        let clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
        console.log('clue', clue)
        if (clue) {
          gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', clue, startIndex.i, startIndex.j, 'DOWN');
          // grid[startIndex.i][startIndex.j] = '*';
        } else {
          console.log("No clue matched the generated pattern.");
        }
        // 
        wordStructureObj = await analyzeString(secondPartStr.substring(1));
        clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
        if (clue) {
          gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', clue, (startIndex.i + firstPartStr.length + 1), startIndex.j, 'DOWN');
          // grid[startIndex.i][startIndex.j] = '*';
        } else {
          console.log("No clue matched the generated pattern.");
          return false;
        }
        return true;
        // 


      }


    }

  } catch (error) {
    console.error("Error in generateClueAgainstB2BClueIndex:", error);
    return false; // Indicate an error occurred
  }
}

function pickRandom(...numbers) {
  const randomIndex = Math.floor(Math.random() * numbers.length);
  return numbers[randomIndex];
}

function generateDashes(num) {
  return '-'.repeat(num);
}

async function fillRecordOnGrid(puzzleState, wordLength, i, j, orientation, directionFlow) {
  console.log(colors.green('requesting: ', i, j));
  let startIndex = {indexI: i, indexJ: j};
  // let str = generateDashes(wordLength);
  let str = generateWordStructureAgainstProvidedClueData(puzzleState, wordLength, i, j, orientation, directionFlow);
  console.log(colors.bgWhite('-------------------------'));
  console.log(colors.bgGreen('       ', str, '               '));
  console.log(colors.bgWhite('-------------------------'));
  let wordStructureObj = await analyzeString(str);
  let clue = await getClueWithSpecificAnswerPattern(wordStructureObj);

  if (clue) {
    gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, orientation, clue, startIndex.indexI, startIndex.indexJ, directionFlow);
    return true;
  } else {
    console.log("No clue matched the generated pattern.");
    return false
  }
}

const generateWordStructureAgainstProvidedClueData = (puzzleState, answerLength, clueIndexI, clueIndexJ, orientation, directionFlow) => {
  answerStartingIndex = getAnswerStartingIndex(orientation, answerLength, clueIndexI, clueIndexJ, directionFlow);
  let str = '';
  switch (orientation) {
    case 'ROW':
      for (var i = answerStartingIndex.answerStartingIndexJ; i < (answerStartingIndex.answerStartingIndexJ + answerLength); i++) {
        // console.log('str', str)
        str += puzzleState.gridSnapshot[answerStartingIndex.answerStartingIndexI][i] === null ? '-' : puzzleState.gridSnapshot[answerStartingIndex.answerStartingIndexI][i];
      }
      break;
    case 'COLUMN':
      for (var i = answerStartingIndex.answerStartingIndexI; i < (answerStartingIndex.answerStartingIndexI + answerLength); i++) {
        // console.log('str', str)
        str += puzzleState.gridSnapshot[i][answerStartingIndex.answerStartingIndexJ] === null ? '-' : puzzleState.gridSnapshot[i][answerStartingIndex.answerStartingIndexJ];
      }
      break;
  }
  return str;

}


const setupPointZero = async (puzzleState) => {
  const rnd = randomIntBetweenRange(0, 0);
  const pointZeroDirectionFlow = rnd === 0 ? 'DOWN_RIGHT' : 'RIGHT_DOWN';
  // 
  let startIndex;
  let str;
  let wordStructureObj;
  let clue;
  // 
  switch (pointZeroDirectionFlow) {
    case 'DOWN_RIGHT':
      switch (pickRandom(1, 2, 3, 4, 5)) {
        case 1:
          //pick a 9 size answer from 1,0 to 1,8
          startIndex = new Object();
          startIndex.indexI = 0;
          startIndex.indexJ = 0;
          str = '---------';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, startIndex.indexI, startIndex.indexJ, pointZeroDirectionFlow);
          } else {
            console.log("No clue matched the generated pattern.");
          }

          //SIDE EFFECT: PLACE CLUE AT 2,8 with DOWN DIRECTION_FLOW (1 or 2 clues placement)
          startIndex.indexI = 2;
          startIndex.indexJ = 8;
          str = '------';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', clue, startIndex.indexI, startIndex.indexJ, 'DOWN');
          } else {
            console.log("No clue matched the generated pattern.");
          }

          break;
        case 2:
          //MAKE A HALF/HALF SPLIT            
          startIndex = new Object();
          startIndex.indexI = 0;
          startIndex.indexJ = 0;
          str = '----';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, startIndex.indexI, startIndex.indexJ, pointZeroDirectionFlow);
          } else {
            console.log("No clue matched the generated pattern.");
          }

          //SIDE EFFECT: PLACE CLUE AT 2,8 with DOWN DIRECTION_FLOW (1 or 2 clues placement)
          startIndex.indexI = 1;
          startIndex.indexJ = 4;
          str = '----';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, startIndex.indexI, startIndex.indexJ, 'RIGHT');
          } else {
            console.log("No clue matched the generated pattern.");
          }

          break;
        case 3:
          // MAKE A 5,3 SPLIT
          startIndex = new Object();
          startIndex.indexI = 0;
          startIndex.indexJ = 0;
          str = '-----';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, startIndex.indexI, startIndex.indexJ, pointZeroDirectionFlow);
          } else {
            console.log("No clue matched the generated pattern.");
          }
          //SIDE EFFECT: PLACE CLUE AT 2,8 with DOWN DIRECTION_FLOW (1 or 2 clues placement)
          startIndex.indexI = 1;
          startIndex.indexJ = 5;
          str = '---';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, startIndex.indexI, startIndex.indexJ, 'RIGHT');
          } else {
            console.log("No clue matched the generated pattern.");
          }

          break;
        case 4:
          // MAKE A 3,5 SPLIT
          startIndex = new Object();
          startIndex.indexI = 0;
          startIndex.indexJ = 0;
          str = '---';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, startIndex.indexI, startIndex.indexJ, pointZeroDirectionFlow);
          } else {
            console.log("No clue matched the generated pattern.");
          }
          //SIDE EFFECT: PLACE CLUE AT 2,8 with DOWN DIRECTION_FLOW (1 or 2 clues placement)
          startIndex.indexI = 1;
          startIndex.indexJ = 3;
          str = '-----';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, startIndex.indexI, startIndex.indexJ, 'RIGHT');
          } else {
            console.log("No clue matched the generated pattern.");
          }
          break;
        case 5:
          // MAKE A 7,7C SPLIT
          startIndex = new Object();
          startIndex.indexI = 0;
          startIndex.indexJ = 0;
          str = '-------';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, startIndex.indexI, startIndex.indexJ, pointZeroDirectionFlow);
          } else {
            console.log("No clue matched the generated pattern.");
          }
          //SIDE EFFECT: PLACE CLUE AT 2,8 with DOWN DIRECTION_FLOW (1 or 2 clues placement)
          startIndex.indexI = 1;
          startIndex.indexJ = 7;
          str = '-------';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', clue, startIndex.indexI, startIndex.indexJ, 'DOWN');
          } else {
            console.log("No clue matched the generated pattern.");
          }
      }
      break;
    default:
      // mechanism to handle RIGHT_DOWN
      switch (pickRandom(1, 2, 3, 4, 5, 6)) {
        case 1:
          // pick a 9 size answer from 0,1 to 8,1
          startIndex = new Object();
          startIndex.indexI = 0;
          startIndex.indexJ = 0;
          str = '---------';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', clue, startIndex.indexI, startIndex.indexJ, 'RIGHT_DOWN');
          } else {
            console.log("No clue matched the generated pattern.");
          }

          //SIDE EFFECT: PLACE CLUE AT 2,8 with DOWN DIRECTION_FLOW (1 or 2 clues placement)
          startIndex.indexI = 2;
          startIndex.indexJ = 8;
          str = '------';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', clue, startIndex.indexI, startIndex.indexJ, 'DOWN');
          } else {
            console.log("No clue matched the generated pattern.");
          }
          await fillBottomRight(puzzleState, {indexI: 8, indexJ: 2}, 'RIGHT', '------');
          break;
        case 2:
          //MAKE A HALF/HALF SPLIT
          startIndex = new Object();
          startIndex.indexI = 0;
          startIndex.indexJ = 0;
          str = '----';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', clue, startIndex.indexI, startIndex.indexJ, 'RIGHT_DOWN');
          } else {
            console.log("No clue matched the generated pattern.");
          }
          // add adjacent B2B clue either below or to the right.
          startIndex = new Object();
          startIndex.indexI = 4;
          startIndex.indexJ = 1;
          str = '----';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', clue, startIndex.indexI, startIndex.indexJ, 'DOWN');
          } else {
            console.log("No clue matched the generated pattern.");
          }
          await fillBottomRight(puzzleState, {indexI: 8, indexJ: 2}, 'RIGHT', '------');
          break;
        case 3:
          // MAKE A 5,3 SPLIT
          startIndex = new Object();
          startIndex.indexI = 0;
          startIndex.indexJ = 0;
          str = '-----';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', clue, startIndex.indexI, startIndex.indexJ, 'RIGHT_DOWN');
          } else {
            console.log("No clue matched the generated pattern.");
          }
          // add adjacent B2B clue either below or to the right.
          startIndex = new Object();
          startIndex.indexI = 5;
          startIndex.indexJ = 1;
          str = '---';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', clue, startIndex.indexI, startIndex.indexJ, 'DOWN');
          } else {
            console.log("No clue matched the generated pattern.");
          }
          await fillBottomRight(puzzleState, {indexI: 8, indexJ: 2}, 'RIGHT', '------');
          break;
        case 4:
          // MAKE A 3,5 SPLIT, add adjacent B2B clue either below or to the right.
          startIndex = new Object();
          startIndex.indexI = 0;
          startIndex.indexJ = 0;
          str = '---';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', clue, startIndex.indexI, startIndex.indexJ, 'RIGHT_DOWN');
          } else {
            console.log("No clue matched the generated pattern.");
          }
          // add adjacent B2B clue either below or to the right.
          startIndex = new Object();
          startIndex.indexI = 3;
          startIndex.indexJ = 1;
          str = '-----';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', clue, startIndex.indexI, startIndex.indexJ, 'DOWN');
          } else {
            console.log("No clue matched the generated pattern.");
          }
          //adding tail b2b to the right to make sure bottom border is now filled as well.
          await fillBottomRight(puzzleState, {indexI: 8, indexJ: 2}, 'RIGHT', '------');
          break;

        case 5:
          // MAKE A 7C,7th ROw 7Size OR 8th Row 7Size SPLIT, add adjacent B2B clue either below or to the right.
          startIndex = new Object();
          startIndex.indexI = 0;
          startIndex.indexJ = 0;
          str = '-------';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', clue, startIndex.indexI, startIndex.indexJ, 'RIGHT_DOWN');
          } else {
            console.log("No clue matched the generated pattern.");
          }
          // add adjacent B2B clue either below or to the right.
          switch (pickRandom(1, 2)) {
            case 1:
              startIndex = new Object();
              startIndex.indexI = 7;
              startIndex.indexJ = 1;
              str = '-------';
              wordStructureObj = await analyzeString(str);
              clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
              if (clue) {
                gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, startIndex.indexI, startIndex.indexJ, 'RIGHT');
              } else {
                console.log("No clue matched the generated pattern.");
              }
              break;
            case 6:
              startIndex = new Object();
              startIndex.indexI = 7;
              startIndex.indexJ = 1;
              str = '----';
              wordStructureObj = await analyzeString(str);
              clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
              if (clue) {
                gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, startIndex.indexI, startIndex.indexJ, 'RIGHT');
              } else {
                console.log("No clue matched the generated pattern.");
              }
              // 
              startIndex = new Object();
              startIndex.indexI = 7;
              startIndex.indexJ = 6;
              str = '--';
              wordStructureObj = await analyzeString(str);
              clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
              if (clue) {
                gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, startIndex.indexI, startIndex.indexJ, 'RIGHT');
              } else {
                console.log("No clue matched the generated pattern.");
              }

              deafult:
                break;

          }

          break;


        default:
          // MAKE A 8,0 SPLIT, add adjacent B2B clue either below or to the right.
          startIndex = new Object();
          startIndex.indexI = 0;
          startIndex.indexJ = 0;
          str = '--------';
          wordStructureObj = await analyzeString(str);
          clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          if (clue) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'COLUMN', clue, startIndex.indexI, startIndex.indexJ, 'RIGHT_DOWN');
          } else {
            console.log("No clue matched the generated pattern.");
          }
          //adding tail b2b to the right to make sure bottom border is now filled as well.
          await fillBottomRight(puzzleState, {indexI: 8, indexJ: 1}, 'RIGHT', '-------');
          break;

      }

  }
}

const fillBottomRight = async (puzzleState, startIndex, directionFlow, str) => {
  let wordStructureObj = await analyzeString(str);
  let clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
  if (clue) {
    gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, startIndex.indexI, startIndex.indexJ, directionFlow);
  } else {
    console.log("No clue matched the generated pattern.");
  }
}

const populateRowZero = (puzzleState) => {
  //scan row1 and get index of all clues placed on row1 (by row1 i mean second row)
  // add clues on same columns on which clues are placed in row1
  // set direction flows accordingly 
  // add clues with DOWN directionFlow on all remaining cells of row0, all clues must have b2b support.
}

const populateColumnZero = (puzzleState) => {

}

const setCluesForActivePuzzleOfAnyType = async (puzzleState, type) => {
  switch (type) {
    case "XL":
      //
      let startingIndexI = null;
      let startingIndexJ = null;
      let currentClueLength;
      let wordStructure = '';
      let counterArr = [];
      console.log(colors.yellow('NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE', puzzleState.NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE));
      for (let i = 0; i < puzzleState.NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE; i++) {
        counterArr.push(i);
      }

      for (counter of counterArr) {
        let nextB2BClue;
        if (counter === 0) {
          let currentOrientation = 'ROW';
          // let currentClueLength = getRandomizedClueLengthAgainstType("XL");
          let currentClueLength = 8;
          // startingIndexI = randomIntBetweenRange(0,8);
          startingIndexI = randomIntBetweenRange(0, 0);
          startingIndexJ = randomIntBetweenRange(0, (9 - currentClueLength));

          for (let i = 0; i < currentClueLength; i++) {
            if (puzzleState.gridSnapshot[startingIndexI][startingIndexJ + i] === null) {
              wordStructure += '-'
            } else {
              wordStructure += puzzleState.gridSnapshot[startingIndexI][startingIndexJ + i];
            }
          }
          // console.log('wordStructure', wordStructure)
          let wordStructureObj = await analyzeString(wordStructure);
          const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);

          if (obj === null) {
            continue;
          }
          let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex(puzzleState.gridSnapshot, "ROW", startingIndexI, startingIndexJ, currentClueLength);

          let clueObj = await getClueAgainstAnswerLength(currentClueLength);
          // console.log('clueObj', clueObj)
          let newXLClue = {
            clueObject: clueObj,
            orientation: 'ROW',
            answerStartingIndex: {
              indexI: startingIndexI,
              indexJ: startingIndexJ,
            },
            clueIndex: clueStartingIndexDetails.clueIndex,
            directionFlow: clueStartingIndexDetails.directionFlow,
          };

          if (randomIntBetweenRange(1, 50) % 2 === 0) {
            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, newXLClue.orientation, newXLClue.clueObject, newXLClue.clueIndex.clueIndexI, newXLClue.clueIndex.clueIndexJ, newXLClue.directionFlow)
            let answerCordinates = getAnswerCoordinatesAgainstClue(
              puzzleState.gridSnapshot,
              newXLClue.orientation,
              newXLClue.clueIndex.clueIndexI,
              newXLClue.clueIndex.clueIndexJ,
              newXLClue.directionFlow,
              newXLClue.clueObject
            );
            nextB2BClue = placeNextClue(puzzleState.gridSnapshot, {
              answerEndingIndexI: answerCordinates.answerEndingIndexI,
              answerEndingIndexJ: answerCordinates.answerEndingIndexJ,
              orientation: getOrientationFromDirectionFlow(newXLClue.directionFlow)
            })
            console.log('nextB2BClue', nextB2BClue)
            nextB2BClue ? await generateClueAgainstB2BClueIndex(puzzleState, nextB2BClue, true) : null;
          } else {
            let obj = await clueSplitter(puzzleState, wordStructure, newXLClue.clueIndex, newXLClue.answerStartingIndex, newXLClue.orientation, newXLClue.directionFlow);
            console.log(obj)
            let answerCordinates = getAnswerCoordinatesAgainstClue(
              puzzleState.gridSnapshot,
              obj.orientation,
              obj.clueIndex.clueIndexI,
              obj.clueIndex.clueIndexJ,
              obj.directionFlow,
              obj.clueObject
            );
            nextB2BClue = placeNextClue(puzzleState.gridSnapshot, {
              answerEndingIndexI: answerCordinates.answerEndingIndexI,
              answerEndingIndexJ: answerCordinates.answerEndingIndexJ,
              orientation: getOrientationFromDirectionFlow(obj.directionFlow)
            })
            console.log('nextB2BClue 123', nextB2BClue)
            nextB2BClue ? await generateClueAgainstB2BClueIndex(puzzleState, nextB2BClue, true) : null;
          }
          console.log('out of else')


        } else {

          // this case if for a handling column of XL size once the row has been setup.

          let mainFlagForXLWord1Placement = false;
          // let previousXLWordIIndex = puzzleState.clueDiary.xl[0].startingIndex.answerStartingIndexI;
          let previousXLWordIIndex = 0;
          while (!mainFlagForXLWord1Placement) {
            wordStructure = '';
            let startingIndexJFlag = false;
            currentClueLength = getRandomizedClueLengthAgainstType("XL");
            // currentClueLength = 8;
            if (puzzleState.clueDiary.xl.length > 0) {

              if (previousXLWordIIndex === 0) {
                currentClueLength = 8;
                startingIndexI = 1;
              } else {
                // currentClueLength = 9;
                currentClueLength = 8;
                startingIndexI = 0;

              }
            } else {
              // currentClueLength = 9;
              currentClueLength = 8;
              // startingIndexI = 0;
              startingIndexI = 1;
              console.log('on to next counter')
            }
            do {
              // startingIndexJ = randomIntBetweenRange(0,8);
              startingIndexJ = randomIntBetweenRange(2, 4);
              console.log('startingIndexI, startingIndexJ', startingIndexI, startingIndexJ)
              // startingIndexJ = 1;
              if (puzzleState.gridSnapshot[startingIndexI][startingIndexJ] === null) {
                startingIndexJFlag = true;
              }
            } while (!startingIndexJFlag)
            for (let i = 0; i < currentClueLength; i++) {
              if (puzzleState.gridSnapshot[startingIndexI + i][startingIndexJ] === null) {
                wordStructure += '-'
              } else {
                wordStructure += puzzleState.gridSnapshot[startingIndexI + i][startingIndexJ];
              }
            }
            if (wordStructure.includes('*') || wordStructure.includes('#')) {
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
            let clueStartingIndexDetails = getClueIndexAgainstAnswerStartingIndex(puzzleState.gridSnapshot, "COLUMN", startingIndexI, startingIndexJ);
            // let clueObj = await getClueAgainstAnswerLength(currentClueLength);

            let newXLClue = {
              clueObject: clueObj,
              orientation: 'COLUMN',
              answerStartingIndex: {
                indexI: startingIndexI,
                indexJ: startingIndexJ,
              },
              clueIndex: clueStartingIndexDetails.clueIndex,
              directionFlow: clueStartingIndexDetails.directionFlow,
            };

            gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, newXLClue.orientation, newXLClue.clueObject, newXLClue.clueIndex.clueIndexI, newXLClue.clueIndex.clueIndexJ, newXLClue.directionFlow)
            let answerCordinates = getAnswerCoordinatesAgainstClue(
              puzzleState.gridSnapshot,
              newXLClue.orientation,
              newXLClue.clueIndex.clueIndexI,
              newXLClue.clueIndex.clueIndexJ,
              newXLClue.directionFlow,
              newXLClue.clueObject
            );

            nextB2BClue = placeNextClue(puzzleState.gridSnapshot, {
              answerEndingIndexI: answerCordinates.answerEndingIndexI,
              answerEndingIndexJ: answerCordinates.answerEndingIndexJ,
              orientation: getOrientationFromDirectionFlow(newXLClue.directionFlow)
            })
            console.log('nextB2BClue', nextB2BClue)
            nextB2BClue ? await generateClueAgainstB2BClueIndex(puzzleState, nextB2BClue) : null;

            mainFlagForXLWord1Placement = true;
          }
        }
      }
      // await generateAndPlaceALargeWord(puzzleState);

      // let arr = findPotentialCluePlacements(puzzleState.gridSnapshot);
      await fillBordersWithClues(puzzleState)
      await addAPlus(puzzleState);
      console.log(colors.bgGreen('***************'))
      console.log(colors.bgGreen('***************'))
      console.log(colors.bgGreen('***************'))
      console.log(colors.bgGreen('***************'))
      console.log(colors.bgGreen('***************'))
      await fillInnerGridWithB2BClues(puzzleState);
      let isPuzzzleFullyFilled = isGridFullyFilled(puzzleState.gridSnapshot)
      if (!isPuzzzleFullyFilled) {
        console.log('RETRY ANOTHER PUZZLE REQUEST, THIS PUZZLE DIDNT WORK..')
        return false;
      }

      // scanAndFillLastBorders();
      let payload = await processClueFilling(puzzleState);
      return payload;
      // return {}
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

const addAPlus = async (puzzleState) => {
  const rowNumber = randomIntBetweenRange(4, 5);
  let hoizontalPath = '';
  const grid = puzzleState.gridSnapshot;
  for (let i = 1; i < grid.length; i++) {
    if (grid[rowNumber][i] === null) {
      hoizontalPath += '-'
    } else {
      hoizontalPath += grid[rowNumber][i];
    }

  }

  if (hoizontalPath.indexOf('*') !== -1) {
    hoizontalPath = hoizontalPath.substring(0, hoizontalPath.indexOf('*'));
  }


  if (hoizontalPath.charAt(0) === '-') {
    hoizontalPath = hoizontalPath.substring(1);
    let clueIndex = new Object();
    clueIndex.indexI = rowNumber;
    clueIndex.indexJ = 1;
    clueIndex.directionFlow = 'RIGHT';

    let wordStructureObj = await analyzeString(hoizontalPath);
    console.log(wordStructureObj);
    const obj = await getClueWithSpecificAnswerPattern(wordStructureObj);
    if (obj && clueIndex) {
      gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', obj, clueIndex.indexI, clueIndex.indexJ, clueIndex.directionFlow);
    }
  }
}

function isGridFullyFilled(gridSnapshot) {
  for (let i = 0; i < gridSnapshot.length; i++) {
    for (let j = 0; j < gridSnapshot[i].length; j++) {
      if (gridSnapshot[i][j] === null) {
        return false;  // Found an empty cell, return false
      }
    }
  }
  return true;  // No empty cells found, return true
}

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


async function fillBordersWithClues(puzzleState) {
  const {gridSnapshot, clueDiary} = puzzleState;
  let directionsObj = {};
  const directions = ['bottom', 'left', 'right'];
  directions.forEach(direction => {
    directionsObj[direction] = findEmptyBorderSpaces(gridSnapshot, direction)[0];
  });
  // console.log('directionsObj', directionsObj)
  await processLeftBottomCorner(directionsObj, gridSnapshot, clueDiary)
}

const processLeftBottomCorner = async (directionsObj, gridSnapshot, clueDiary) => {
  const {bottom, left, right} = directionsObj;
  console.log('inside processLeftBottomCorner');
  console.log(bottom, left, right)


  // Decide based on the potential for creating meaningful clues
  if (bottom.wordStructure.length <= left.wordStructure.length) {
    if (bottom.wordStructure.charAt(0) === '-') {  // Check if bottom can feasibly start with a clue
      // Adjust the left's word structure to include the bottom start point if it ends with an empty cell
      if (left.wordStructure.charAt(left.wordStructure.length - 1) === '-') {
        left.wordStructure = left.wordStructure.slice(0, -3)   // GIVES LAST TWO SPACES TO BOTTOM CLUE AND LEAVES AND OTHER SLOT FOR LEFT UPPER CLUE'S CLUE.
        console.log('Updated left.wordStructure:', left.wordStructure);

        let bottomLeftCornerClue = {
          clueIndex: {clueIndexI: left.start.i + left.length - 2, clueIndexJ: left.start.j},
          answerStartingIndex: {indexI: left.start.i + left.length - 1, indexJ: left.start.j},
          directionFlow: "DOWN_RIGHT",
          orientation: "ROW",
          wordStructure: bottom.wordStructure
        };


        let wordStructureObj = await analyzeString(bottomLeftCornerClue.wordStructure);
        if (wordStructureObj) {
          const clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
          bottomLeftCornerClue.clueObject = clue;
          gridSnapshotFillerUtil(gridSnapshot, clueDiary, bottomLeftCornerClue.orientation, bottomLeftCornerClue.clueObject, bottomLeftCornerClue.clueIndex.clueIndexI, bottomLeftCornerClue.clueIndex.clueIndexJ, bottomLeftCornerClue.directionFlow)
          // Potentially place clue in the grid
        } else {
          console.log("No clue found for the given pattern");
        }


        let upperLeftCornerClue = {
          clueIndex: {clueIndexI: left.start.i, clueIndexJ: left.start.j},
          answerStartingIndex: {indexI: left.start.i + 1, indexJ: left.start.j},
          directionFlow: "DOWN",
          orientation: "COLUMN",
          wordStructure: left.wordStructure
        };
        wordStructureObj = await analyzeString(upperLeftCornerClue.wordStructure);
        if (wordStructureObj) {
          const clue1 = await getClueWithSpecificAnswerPattern(wordStructureObj);
          upperLeftCornerClue.clueObject = clue1;
          gridSnapshotFillerUtil(gridSnapshot, clueDiary, upperLeftCornerClue.orientation, upperLeftCornerClue.clueObject, upperLeftCornerClue.clueIndex.clueIndexI, upperLeftCornerClue.clueIndex.clueIndexJ, upperLeftCornerClue.directionFlow)
        } else {
          console.log("No clue found for the given pattern");
        }

        if (right) {

          let upperRightCornerClue = {
            clueIndex: {clueIndexI: right.start.i, clueIndexJ: right.start.j},
            answerStartingIndex: {indexI: right.start.i + 1, indexJ: right.start.j},
            directionFlow: "DOWN",
            orientation: "COLUMN",
            wordStructure: right.wordStructure.substring(1)
          };
          wordStructureObj = await analyzeString(upperRightCornerClue.wordStructure);
          if (wordStructureObj) {
            const clue2 = await getClueWithSpecificAnswerPattern(wordStructureObj);
            console.log('Clue2 found: ', clue2);
            upperRightCornerClue.clueObject = clue2;
            gridSnapshotFillerUtil(gridSnapshot, clueDiary, upperRightCornerClue.orientation, upperRightCornerClue.clueObject, upperRightCornerClue.clueIndex.clueIndexI, upperRightCornerClue.clueIndex.clueIndexJ, upperRightCornerClue.directionFlow)
            // Potentially place clue in the grid
          } else {
            console.log("No clue found for the given pattern");
          }
        }


      }
    }
  } else {
    // Consider extending the bottom clue if it has better potential
    if (bottom.wordStructure.charAt(bottom.wordStructure.length - 1) === '-') {
      bottom.wordStructure += left.wordStructure.charAt(0); // Add character from left
      console.log('Updated bottom.wordStructure:', bottom.wordStructure);

      let bottomLeftCornerClue = {
        clueIndex: {clueIndexI: bottom.start.i, clueIndexJ: bottom.start.j},
        answerStartingIndex: {indexI: bottom.start.i, indexJ: bottom.start.j + 1},
        directionFlow: "RIGHT_DOWN",
        orientation: "ROW",
        wordStructure: bottom.wordStructure
      };

      console.log('bottomLeftCornerClue', bottomLeftCornerClue);

      let wordStructureObj = await analyzeString(bottomLeftCornerClue.wordStructure);
      console.log('wordStructureObj', wordStructureObj);
      if (wordStructureObj) {
        const clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
        console.log('Clue found:', clue);
        // Potentially place clue in the grid
      } else {
        console.log("No clue found for the given pattern");
      }
    }
  }
}


function findEmptyBorderSpaces(grid, direction) {
  let str = '';
  let unusedCells = 0;
  let obj;
  switch (direction) {
    case 'left':
      obj = findLeftBorderSpaces(grid).filter(item => item.length > 1);
      return obj;
      break;
    case 'bottom':
      obj = findBottomBorderSpaces(grid)
      return obj;
      break;
    case 'right':
      obj = findRightBorderSpaces(grid);
      return obj;
      break;
  }
}

function findLeftBorderSpaces(grid) {
  let spaces = [];
  const columnIndex = 0;  // Left border index
  let currentSpace = {start: null, length: 0, wordStructure: ''};

  // Iterate over each row in the specified column
  for (let i = 0; i < grid.length; i++) {
    const cell = grid[i][columnIndex];

    if (cell === null || cell === '.' || (cell !== '*' && cell !== '#')) {
      // Check if we are starting a new space
      if (currentSpace.start === null) {
        currentSpace.start = {i, j: columnIndex};
      }
      currentSpace.length++;
      currentSpace.wordStructure += (cell === null || cell === '.') ? '-' : cell;
    } else {
      // Finalize the current space if it has begun and reset
      if (currentSpace.length > 0) {
        spaces.push({...currentSpace});
        currentSpace = {start: null, length: 0, wordStructure: ''};  // Reset
      }
    }
  }

  // Add the last space if it ends at the border
  if (currentSpace.length > 0) {
    spaces.push(currentSpace);
  }

  return spaces.map(space => ({
    ...space,
    orientation: 'COLUMN'  // Since it's the left border, orientation is vertical
  }));
}

function findBottomBorderSpaces(grid) {
  let spaces = [];
  const rowIndex = grid.length - 1;  // Bottom border index
  let currentSpace = {start: null, length: 0, wordStructure: ''};

  // Iterate over each column in the bottom row
  for (let j = 0; j < grid[rowIndex].length; j++) {
    const cell = grid[rowIndex][j];

    // Include cell if it's empty or contains a letter but not a clue marker
    if (cell === null || cell === '.' || (typeof cell === 'string' && cell !== '*' && cell !== '#')) {
      // Check if we are starting a new space
      if (currentSpace.start === null) {
        currentSpace.start = {i: rowIndex, j};
      }
      currentSpace.length++;
      currentSpace.wordStructure += (!cell || cell === '.') ? '-' : cell;
    } else {
      // Finalize the current space if it has begun and reset
      if (currentSpace.length > 0) {
        spaces.push({...currentSpace});
        currentSpace = {start: null, length: 0, wordStructure: ''};  // Reset
      }
    }
  }

  // Add the last space if it ends at the border and is valid
  if (currentSpace.length > 0 && currentSpace.start !== null) {
    spaces.push(currentSpace);
  }
  spaces = spaces.filter(space => space.wordStructure.includes('-'));


  return spaces.map(space => ({
    ...space,
    orientation: 'ROW'  // Since it's the bottom border, orientation is horizontal
  }));
}

// function findRightBorderSpaces(grid) {
//   const spaces = [];
//   const columnIndex = grid[0].length - 1;  // Right border index
//   let currentSpace = { start: null, length: 0, wordStructure: '' };

//   // Iterate over each row in the specified rightmost column
//   for (let i = 0; i < grid.length; i++) {
//       const cell = grid[i][columnIndex];

//       // Check if the cell is empty or has a placeholder that indicates it's unfilled
//       if (cell === null || cell === '.' || (cell !== '*' && cell !== '#')) {
//           // Check if we are starting a new space
//           if (currentSpace.start === null) {
//               currentSpace.start = { i, j: columnIndex };
//           }
//           currentSpace.length++;
//           currentSpace.wordStructure += (cell === null || cell === '.') ? '-' : cell;
//       } else {
//           // Finalize the current space if it has begun and reset
//           if (currentSpace.length > 0) {
//               spaces.push({ ...currentSpace });
//               currentSpace = { start: null, length: 0, wordStructure: '' };  // Reset
//           }
//       }
//   }

//   // Add the last space if it ends at the border and it's suitable for a clue
//   if (currentSpace.length > 0) {
//       spaces.push(currentSpace);
//   }

//   return spaces.map(space => ({
//       ...space,
//       orientation: 'COLUMN',  // Since it's the right border, orientation is vertical
//       directionFlow: 'DOWN'  // Clues will flow downwards
//   }));
// }

function findRightBorderSpaces(grid) {
  const spaces = [];
  const columnIndex = grid[0].length - 1;  // Right border index
  let currentSpace = {start: null, length: 0, wordStructure: ''};
  let isFilled = true;  // Assume the column is filled until proven otherwise

  // Iterate over each row in the specified rightmost column
  for (let i = 0; i < grid.length; i++) {
    const cell = grid[i][columnIndex];

    // Check if the cell is empty or has a placeholder that indicates it's unfilled
    if (cell === null || cell === '.' || (cell !== '*' && cell !== '#')) {
      isFilled = false;  // At least one cell is not filled with a clue marker
      // Check if we are starting a new space
      if (currentSpace.start === null) {
        currentSpace.start = {i, j: columnIndex};
      }
      currentSpace.length++;
      currentSpace.wordStructure += (cell === null || cell === '.') ? '-' : cell;
    } else {
      isFilled = true;
      return false;
      // Finalize the current space if it has begun and reset
      if (currentSpace.length > 0) {
        spaces.push({...currentSpace});
        currentSpace = {start: null, length: 0, wordStructure: ''};  // Reset
      }
    }
  }

  // Add the last space if it ends at the border and it's suitable for a clue
  if (currentSpace.length > 0) {
    spaces.push(currentSpace);
  }

  // If the column is fully filled with valid clues (or clue markers), potentially return false
  if (isFilled) {
    console.log("Rightmost column is already fully filled with clues.");
    return false;  // Optionally return false or an empty array based on desired behavior
  }

  return spaces.map(space => ({
    ...space,
    orientation: 'COLUMN',  // Since it's the right border, orientation is vertical
    directionFlow: 'DOWN'  // Clues will flow downwards
  }));
}

// Analyzes the word structure and attempts to place a clue if suitable
async function analyzeAndPlaceClue(wordStructureObj, puzzleState, rowIndex, startCol) {
  const {wordStructure, clueIndex, needsB2BClue} = wordStructureObj;
  console.log('analyzeAndPlaceClue request against: ', clueIndex);
  if (!wordStructure.includes('-')) return {placed: false}; // Ensure there's at least some space to fill

  // Simulate fetching a clue that matches the word structure
  let wordStructureAnalysis = await analyzeString(wordStructure);
  const clue = await getClueWithSpecificAnswerPattern(wordStructureAnalysis);

  if (clue) {
    console.log(clue)
    const clueLength = clue.answer.length;
    const answerEndingIndexJ = startsAt + clueLength - 1;

    // Check for space for back-to-back placement
    // if (canPlaceBackToBackClue(puzzleState.gridSnapshot, rowIndex, answerEndingIndexJ)) {
    //     // If there is space, place the clue and mark it as successful
    //     gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, 'ROW', clue, rowIndex, startsAt, 'RIGHT');
    //     return {
    //         placed: true,
    //         answerEndingIndexI: rowIndex,
    //         answerEndingIndexJ: answerEndingIndexJ,
    //         directionFlow: 'RIGHT'
    //     };
    // }
  }

  return {placed: false};
}

// Checks if there is space for a back-to-back clue placement
function canPlaceBackToBackClue(grid, rowIndex, colIndex) {
  // Assuming the grid is square
  return colIndex + 1 < grid[rowIndex].length && (grid[rowIndex][colIndex + 1] === null || grid[rowIndex][colIndex + 1] === '.');
}

const fillInnerGridColumnClue1 = (puzzleState) => {
  const grid = puzzleState.gridSnapshot;
  const startingRow = 1;
  const startingColumn = 0;
  let firstHoizontalPath = '';
  for (let i = 1; i < grid.length; i++) {
    if (grid[startingRow][i] === null) {
      firstHoizontalPath += '-'
    } else {
      firstHoizontalPath += grid[startingRow][i];
    }

  }
  console.log('firstHoizontalPath', firstHoizontalPath);
  console.log(puzzleState.clueDiary.xl);

}

const clueSplitter = async (puzzleState, str, clueIndex, startIndex, orientation, directionFlow) => {
  console.log('clueIndex', clueIndex);
  console.log('directionflow', directionFlow)
  const firstPartLength = Math.floor(str.length / 2);
  const secondPartLength = str.length - firstPartLength;
  let firstPartStr = '';
  let secondPartStr = '';
  for (let i = 0; i < firstPartLength; i++) {
    firstPartStr += str[i];
  }
  for (let i = firstPartStr.length; i < str.length; i++) {
    secondPartStr += str[i];
  }

  let wordStructureObj = await analyzeString(firstPartStr);
  let clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
  console.log('clue', clue)
  if (clue) {
    gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, orientation, clue, clueIndex.clueIndexI, clueIndex.clueIndexJ, directionFlow);
  } else {
    console.log("No clue matched the generated pattern.");
  }
  wordStructureObj = await analyzeString(secondPartStr.substring(1));
  clue = await getClueWithSpecificAnswerPattern(wordStructureObj);
  if (clue) {
    let secondPartClueIndex = {
      clueIndexI: null,
      clueIndexJ: null
    };
    switch (orientation) {
      case 'ROW':
        secondPartClueIndex.clueIndexI = startIndex.indexI;
        secondPartClueIndex.clueIndexJ = startIndex.indexJ + firstPartStr.length;
        break;
      case 'COLUMN':
        secondPartClueIndex.clueIndexI = startIndex.indexI + firstPartStr.length;
        secondPartClueIndex.clueIndexJ = startIndex.indexJ;

        break;
    }
    let secondPartDirectionFlow = orientation === 'ROW' ? 'RIGHT' : 'DOWN'
    console.log(colors.bgRed('secondPartClueIndex', secondPartClueIndex));
    gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, orientation, clue, secondPartClueIndex.clueIndexI, secondPartClueIndex.clueIndexJ, secondPartDirectionFlow);
    return {
      orientation,
      clueIndex: secondPartClueIndex,
      directionFlow: secondPartDirectionFlow,
      clueObject: clue,
    }

  } else {
    console.log("No clue matched the generated pattern.");
  }


};

const fillClueAgainstProvidedData = async (puzzleState, wordStructureObj, clueObj, splitFlag = false) => {
  console.log('inside fillClueAgainstProvidedData')
  if (wordStructureObj === null) {
    return;
  }

  if (wordStructureObj.wordStructure.length >= 7 && splitFlag) {

    //logic to split into smaller chunks
  } else {
    let obj = new Object();
    let analyzeStringObj = await analyzeString(wordStructureObj.wordStructure);
    const clue = await getClueWithSpecificAnswerPattern(analyzeStringObj);
    if (clue === null) {
      return;
    }
    console.log("**********************");
    console.log(clue);
    console.log("**********************");
    console.log('clueObj', clueObj)
    let cluePayload = {
      ...clueObj,
      clueObject: clue,
    };
    console.log('cluePayload', cluePayload)
    gridSnapshotFillerUtil(puzzleState.gridSnapshot, puzzleState.clueDiary, cluePayload.orientation, cluePayload.clueObject, cluePayload.clueIndex.clueIndexI, cluePayload.clueIndex.clueIndexJ, cluePayload.directionFlow);
    // gridSnapshot, clueDiary, orientation,clueObject,clueIndexI,clueIndexJ,directionFlow

    if (wordStructureObj.needsB2BClue) {

      let answerCordinates = getAnswerCoordinatesAgainstClue(
        puzzleState.gridSnapshot,
        clueObj.orientation,
        clueObj.clueIndex.clueIndexI,
        clueObj.clueIndex.clueIndexJ,
        clueObj.directionFlow,
        clueObj.clueObject
      );

      const nextB2BClue = placeNextClue(puzzleState.gridSnapshot, {
        answerEndingIndexI: answerCordinates.answerEndingIndexI,
        answerEndingIndexJ: answerCordinates.answerEndingIndexJ,
        orientation: getOrientationFromDirectionFlow(clueObj.directionFlow)
      })
      console.log('nextB2BClue', nextB2BClue)
      nextB2BClue ? await generateClueAgainstB2BClueIndex(puzzleState, nextB2BClue) : null;
    }

  }

  // 


}

const fillInnerGridWithB2BClues = async (puzzleState) => {
  const gridSize = puzzleState.gridSnapshot.length; // Assuming a square grid
  // fillInnerGridColumnClue1(puzzleState);
  await fillInnerRowsandColumnsInSequence(puzzleState);
  console.log('attempting to fill any leftovers again...')
  await fillInnerRowsandColumnsInSequence(puzzleState);


}

// const grabBestClueIndex = (puzzleState,)


const fillInnerRowsandColumnsInSequence = async (puzzleState) => {
  let currentWordStructure;

  currentWordStructure = await extractWordStructure(puzzleState.gridSnapshot, 1, 'COLUMN');
  console.log(colors.bgYellow('currentWordStructure COLUMN 1', currentWordStructure))
  if (currentWordStructure !== null) {
    let clueObj = {
      orientation: 'COLUMN',
      answerStartingIndex: {
        indexI: currentWordStructure.clueIndex.row,
        indexJ: currentWordStructure.clueIndex.col + 1,
      },
      clueIndex: {clueIndexI: currentWordStructure.clueIndex.row, clueIndexJ: currentWordStructure.clueIndex.col},
      directionFlow: 'DOWN'
    }
    await fillClueAgainstProvidedData(puzzleState, currentWordStructure, clueObj)
  }

  currentWordStructure = await extractWordStructure(puzzleState.gridSnapshot, 7, 'ROW');
  console.log('currentWordStructure ROW 7', currentWordStructure)
  if (currentWordStructure !== null) {
    let clueObj = {
      orientation: 'ROW',
      answerStartingIndex: {
        indexI: currentWordStructure.clueIndex.row,
        indexJ: currentWordStructure.clueIndex.col + 1,
      },
      clueIndex: {clueIndexI: currentWordStructure.clueIndex.row, clueIndexJ: currentWordStructure.clueIndex.col},
      directionFlow: 'RIGHT'
    }
    await fillClueAgainstProvidedData(puzzleState, currentWordStructure, clueObj)
  }


  currentWordStructure = await extractWordStructure(puzzleState.gridSnapshot, 2, 'COLUMN');
  console.log('currentWordStructure COLUMN 2', currentWordStructure)
  if (currentWordStructure !== null) {
    let clueObj = {
      orientation: 'COLUMN',
      answerStartingIndex: {
        indexI: currentWordStructure.clueIndex.row,
        indexJ: currentWordStructure.clueIndex.col + 1,
      },
      clueIndex: {clueIndexI: currentWordStructure.clueIndex.row, clueIndexJ: currentWordStructure.clueIndex.col},
      directionFlow: 'DOWN'
    }
    await fillClueAgainstProvidedData(puzzleState, currentWordStructure, clueObj)
  }

  currentWordStructure = await extractWordStructure(puzzleState.gridSnapshot, 6, 'ROW');
  console.log('currentWordStructure ROW 6', currentWordStructure)
  if (currentWordStructure !== null) {
    let clueObj = {
      orientation: 'ROW',
      answerStartingIndex: {
        indexI: currentWordStructure.clueIndex.row,
        indexJ: currentWordStructure.clueIndex.col + 1,
      },
      clueIndex: {clueIndexI: currentWordStructure.clueIndex.row, clueIndexJ: currentWordStructure.clueIndex.col},
      directionFlow: 'RIGHT'
    }
    await fillClueAgainstProvidedData(puzzleState, currentWordStructure, clueObj)
  }


  currentWordStructure = await extractWordStructure(puzzleState.gridSnapshot, 3, 'COLUMN');
  console.log('currentWordStructure COLUMN 3', currentWordStructure)
  if (currentWordStructure !== null) {
    let clueObj = {
      orientation: 'COLUMN',
      answerStartingIndex: {
        indexI: currentWordStructure.clueIndex.row,
        indexJ: currentWordStructure.clueIndex.col + 1,
      },
      clueIndex: {clueIndexI: currentWordStructure.clueIndex.row, clueIndexJ: currentWordStructure.clueIndex.col},
      directionFlow: 'DOWN'
    }
    await fillClueAgainstProvidedData(puzzleState, currentWordStructure, clueObj)
  }

  currentWordStructure = await extractWordStructure(puzzleState.gridSnapshot, 5, 'ROW');
  console.log('currentWordStructure ROW 5', currentWordStructure)
  if (currentWordStructure !== null) {
    let clueObj = {
      orientation: 'ROW',
      answerStartingIndex: {
        indexI: currentWordStructure.clueIndex.row,
        indexJ: currentWordStructure.clueIndex.col + 1,
      },
      clueIndex: {clueIndexI: currentWordStructure.clueIndex.row, clueIndexJ: currentWordStructure.clueIndex.col},
      directionFlow: 'RIGHT'
    }
    await fillClueAgainstProvidedData(puzzleState, currentWordStructure, clueObj)
  }


  currentWordStructure = await extractWordStructure(puzzleState.gridSnapshot, 4, 'COLUMN');
  console.log('currentWordStructure COLUMN 4', currentWordStructure)
  if (currentWordStructure !== null) {
    let clueObj = {
      orientation: 'COLUMN',
      answerStartingIndex: {
        indexI: currentWordStructure.clueIndex.row,
        indexJ: currentWordStructure.clueIndex.col + 1,
      },
      clueIndex: {clueIndexI: currentWordStructure.clueIndex.row, clueIndexJ: currentWordStructure.clueIndex.col},
      directionFlow: 'DOWN'
    }
    await fillClueAgainstProvidedData(puzzleState, currentWordStructure, clueObj)
  }

  currentWordStructure = await extractWordStructure(puzzleState.gridSnapshot, 4, 'ROW');
  console.log('currentWordStructure ROW 4', currentWordStructure)
  if (currentWordStructure !== null) {
    let clueObj = {
      orientation: 'ROW',
      answerStartingIndex: {
        indexI: currentWordStructure.clueIndex.row,
        indexJ: currentWordStructure.clueIndex.col + 1,
      },
      clueIndex: {clueIndexI: currentWordStructure.clueIndex.row, clueIndexJ: currentWordStructure.clueIndex.col},
      directionFlow: 'RIGHT'
    }
    await fillClueAgainstProvidedData(puzzleState, currentWordStructure, clueObj)
  }


  currentWordStructure = await extractWordStructure(puzzleState.gridSnapshot, 5, 'COLUMN');
  console.log('currentWordStructure COLUMN 5', currentWordStructure)
  if (currentWordStructure !== null) {
    let clueObj = {
      orientation: 'COLUMN',
      answerStartingIndex: {
        indexI: currentWordStructure.clueIndex.row,
        indexJ: currentWordStructure.clueIndex.col + 1,
      },
      clueIndex: {clueIndexI: currentWordStructure.clueIndex.row, clueIndexJ: currentWordStructure.clueIndex.col},
      directionFlow: 'DOWN'
    }
    await fillClueAgainstProvidedData(puzzleState, currentWordStructure, clueObj)
  }


  currentWordStructure = await extractWordStructure(puzzleState.gridSnapshot, 3, 'ROW');
  console.log('currentWordStructure ROW 3', currentWordStructure)
  if (currentWordStructure !== null) {
    let clueObj = {
      orientation: 'ROW',
      answerStartingIndex: {
        indexI: currentWordStructure.clueIndex.row,
        indexJ: currentWordStructure.clueIndex.col + 1,
      },
      clueIndex: {clueIndexI: currentWordStructure.clueIndex.row, clueIndexJ: currentWordStructure.clueIndex.col},
      directionFlow: 'RIGHT'
    }
    await fillClueAgainstProvidedData(puzzleState, currentWordStructure, clueObj)
  }


  currentWordStructure = await extractWordStructure(puzzleState.gridSnapshot, 6, 'COLUMN');
  console.log('currentWordStructure COLUMN 6', currentWordStructure)
  if (currentWordStructure !== null) {
    let clueObj = {
      orientation: 'COLUMN',
      answerStartingIndex: {
        indexI: currentWordStructure.clueIndex.row,
        indexJ: currentWordStructure.clueIndex.col + 1,
      },
      clueIndex: {clueIndexI: currentWordStructure.clueIndex.row, clueIndexJ: currentWordStructure.clueIndex.col},
      directionFlow: 'DOWN'
    }
    await fillClueAgainstProvidedData(puzzleState, currentWordStructure, clueObj)
  }


  currentWordStructure = await extractWordStructure(puzzleState.gridSnapshot, 2, 'ROW');
  console.log('currentWordStructure ROW 2', currentWordStructure)
  if (currentWordStructure !== null) {
    let clueObj = {
      orientation: 'ROW',
      answerStartingIndex: {
        indexI: currentWordStructure.clueIndex.row,
        indexJ: currentWordStructure.clueIndex.col + 1,
      },
      clueIndex: {clueIndexI: currentWordStructure.clueIndex.row, clueIndexJ: currentWordStructure.clueIndex.col},
      directionFlow: 'RIGHT'
    }
    await fillClueAgainstProvidedData(puzzleState, currentWordStructure, clueObj)
  }


  currentWordStructure = await extractWordStructure(puzzleState.gridSnapshot, 7, 'COLUMN');
  console.log('currentWordStructure COLUMN 7', currentWordStructure)
  if (currentWordStructure !== null) {
    let clueObj = {
      orientation: 'COLUMN',
      answerStartingIndex: {
        indexI: currentWordStructure.clueIndex.row,
        indexJ: currentWordStructure.clueIndex.col + 1,
      },
      clueIndex: {clueIndexI: currentWordStructure.clueIndex.row, clueIndexJ: currentWordStructure.clueIndex.col},
      directionFlow: 'DOWN'
    }
    await fillClueAgainstProvidedData(puzzleState, currentWordStructure, clueObj)
  }

  currentWordStructure = await extractWordStructure(puzzleState.gridSnapshot, 1, 'ROW');
  console.log('currentWordStructure ROW 1', currentWordStructure)
  if (currentWordStructure !== null) {
    let clueObj = {
      orientation: 'ROW',
      answerStartingIndex: {
        indexI: currentWordStructure.clueIndex.row,
        indexJ: currentWordStructure.clueIndex.col + 1,
      },
      clueIndex: {clueIndexI: currentWordStructure.clueIndex.row, clueIndexJ: currentWordStructure.clueIndex.col},
      directionFlow: 'RIGHT'
    }
    await fillClueAgainstProvidedData(puzzleState, currentWordStructure, clueObj)
  }


};

// function extractWordStructure(grid, row, startCol) {
//     let wordStructure = '';
//     let clueIndex = null;
//     let needsB2BClue = true;

//     // Find the first valid cell that can start a clue
//     for (let j = startCol; j < grid[row].length; j++) {
//         const cell = grid[row][j];
//         if ((cell === null || cell === '.') && (j === 0 || grid[row][j-1] !== '#')) {
//             clueIndex = j;
//             break;
//         }
//     }

//     // If a valid clueIndex is found, construct the word structure excluding the clue index cell
//     if (clueIndex !== null) {
//         for (let j = clueIndex + 1; j < grid[row].length; j++) {
//             const cell = grid[row][j];
//             if (cell === null || cell === '.') {
//                 wordStructure += '-';
//             } else if (cell !== '*' && cell !== '#') {
//                 wordStructure += cell;
//             } else {
//                 needsB2BClue = false; // Encounter a clue marker, stop extending the word structure
//                 break;
//             }
//         }

//         // Adjust for word structures that are too short or if the clue index cell is at the end of the row
//         if (wordStructure.length < 2 || clueIndex === grid[row].length - 1) {
//             return null;
//         }

//         return {
//             clueIndex: { row, col: clueIndex },
//             wordStructure,
//             needsB2BClue
//         };
//     }

//     return null;
// }


function extractWordStructure(grid, index, orientation) {
  console.log('inside extractWordStructure')
  let wordStructure = '';
  let clueIndex = null;
  let needsB2BClue = true;
  let maxBoundary = orientation === 'ROW' ? grid[index].length : grid.length;
  let started = false;

  // Traverse each cell in the specified row or column
  for (let j = 0; j < maxBoundary; j++) {
    const cell = orientation === 'ROW' ? grid[index][j] : grid[j][index];
    // Identify the start of a potential word structure
    if (!started && (cell === null || cell === '.')) {
      if (j === 0 || (orientation === 'ROW' ? grid[index][j - 1] : grid[j - 1][index]) !== '#' || (orientation === 'ROW' ? grid[index][j - 1] : grid[j - 1][index]) !== '*') {
        clueIndex = j;
        started = true;  // Mark the start of word structure collection
        continue;  // Skip the clue cell for word structure collection
      }
    }
    if (started) {
      if (cell === null || cell === '.') {
        wordStructure += '-';
      } else if (cell !== '*' && cell !== '#') {
        wordStructure += cell;
      } else {
        needsB2BClue = false;
        break; // Stop at a clue marker or at the end of the grid
      }
    }
  }
  console.log('wordStructure', wordStructure)

  // Determine if there's a need for a B2B clue
  if (clueIndex + wordStructure.length + 1 === maxBoundary) {
    needsB2BClue = false; // Adjust for word structures that reach the end of the grid
  }

  if (wordStructure.length < 2) {
    return null;  // Ignore too short word structures
  }

  return {
    clueIndex: orientation === 'ROW' ? {row: index, col: clueIndex} : {row: clueIndex, col: index},
    wordStructure,
    needsB2BClue
  };
}


// Assume analyzeAndPlaceClue and other helper functions are implemented similarly


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
  ORIENTATION_ENUM,
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
  scanGridForPossibleClues,
  setupPointZero,
  pickRandom,
  generateDashes,
  fillRecordOnGrid,
  generateWordStructureAgainstProvidedClueData,
  finalizePuzzle,
};
