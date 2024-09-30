// globalState.js
const gridSnapshot = Array(12).fill(null).map(() => Array(12).fill(null));
const clueDiary = { xl: [], l: [], m: [], s: [] };

const cluesObj = {
  xl: [],
  l: [],
  m: [],
  s: [],
};

let NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE = 0;
let NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE = 0;
let NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE = 0;
let NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE = 0;
let NUMBER_OF_S_CLUES_FOR_ACTIVE_PUZZLE = 0;

module.exports = {
  gridSnapshot,
  clueDiary,
  cluesObj,
  NUMBER_OF_CLUES_FOR_ACTIVE_PUZZLE,
  NUMBER_OF_XL_CLUES_FOR_ACTIVE_PUZZLE,
  NUMBER_OF_L_CLUES_FOR_ACTIVE_PUZZLE,
  NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE,
  NUMBER_OF_M_CLUES_FOR_ACTIVE_PUZZLE,
  NUMBER_OF_S_CLUES_FOR_ACTIVE_PUZZLE

};
