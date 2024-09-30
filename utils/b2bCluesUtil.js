const colors = require("colors");


function placeNextClue(gridSnapshot, lastClue) {
    // console.log(colors.bgRed('inside placeNextClue lastClue', lastClue));
    const { answerEndingIndexI, answerEndingIndexJ, orientation } = lastClue;
    const nextStart = getNextStartCell(gridSnapshot, answerEndingIndexI, answerEndingIndexJ, orientation);

    // Try placing a clue in the opposite orientation
    const oppositeOrientation = orientation === 'ROW' ? 'COLUMN' : 'ROW';
    if (canPlaceClue(gridSnapshot, nextStart, oppositeOrientation)) {
        return createAndPlaceClue(gridSnapshot, nextStart, oppositeOrientation);
    }

    // If no space or suitable clue in the opposite direction, check for continuation in the same direction
    if (canPlaceClue(gridSnapshot, nextStart, orientation)) {
        return createAndPlaceClue(gridSnapshot, nextStart, orientation);
    }

    // Handle no available placement
    console.error('No suitable placement found for the next clue at', nextStart);
    return false;
}

// function getNextStartCell(i, j, orientation) {
//     if (orientation === 'COLUMN') {
//         return { i, j: j + 1 };
//     } else {
//         return { i: i + 1, j };
//     }
// }

function getNextStartCell(grid, i, j, orientation) {
    // console.log('inside getNextSTartCell, i,j,orientation :',i, j, orientation)
    const spaceRight = calculateSpace(grid, i, j + 1, 'ROW');
    const spaceDown = calculateSpace(grid, i + 1, j, 'COLUMN');

    // Decide based on which direction has more space
    if (orientation === 'ROW') {
        return spaceRight >= spaceDown ? { i, j: j + 1, orientation: 'ROW' } : { i: i + 1, j, orientation: 'COLUMN' };
    } else {
        return spaceDown >= spaceRight ? { i: i + 1, j, orientation: 'COLUMN' } : { i, j: j + 1, orientation: 'ROW' };
    }
}

function calculateSpace(grid, i, j, direction) {
    let space = 0;
    if (direction === 'ROW') {
        while (j < grid[0].length && isEmpty(grid, {i, j})) {
            space++;
            j++;
        }
    } else {
        while (i < grid.length && isEmpty(grid, {i, j})) {
            space++;
            i++;
        }
    }
    return space;
}


function canPlaceClue(grid, start, orientation) {
    // Check if the starting cell is within grid bounds and is empty
    return isWithinBounds(grid, start) && isEmpty(grid, start);
}

function createAndPlaceClue(grid, start, orientation) {
    // Logic to generate a clue based on the orientation and starting position
    // Consider the length, fill the clue, and adjust the grid state
    // const clue = generateClue(start, orientation);
    // fillClueInGrid(grid, clue);
    // return clue;

    console.log(colors.bgRed(start, orientation))
    return {startIndex: start, orientation}
    // throw( new Error());
}

function isWithinBounds(grid, { i, j }) {
    return i >= 0 && i < grid.length && j >= 0 && j < grid[i].length;
}

// function isEmpty(grid, { i, j }) {
//     return grid[i][j] === null || grid[i][j] === "";  // Modify based on how your grid represents empty cells
// }

function isEmpty(grid, { i, j }) {
    // Adjust based on your grid's representation of empty cells
    return i >= 0 && i < grid.length && j >= 0 && j < grid[i].length && (grid[i][j] === null || grid[i][j] === "");
}

function findPotentialCluePlacements(grid) {
    const potentialClues = [];

    // Function to check and add potential clue if space is available
    function checkAndAddPotentialClue(i, j, direction) {
        const { orientation, start } = calculateStartAndOrientation(i, j, direction);
        const { length, wordStructure } = calculateSpaceAndStructure(grid, start.i, start.j, orientation);
        if (length > 1) { // Assume a clue needs at least 2 cells to be valid
            potentialClues.push({
                start,
                orientation,
                length,
                direction,
                wordStructure
            });
        }
    }

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const cell = grid[i][j];
            if (cell === '*' || cell === '#') {
                // Check all direction flows for COLUMN and ROW
                ['DOWN', 'RIGHT_DOWN', 'LEFT_DOWN'].forEach(direction => {
                    checkAndAddPotentialClue(i, j, direction);
                });
                ['RIGHT', 'UP_RIGHT', 'DOWN_RIGHT'].forEach(direction => {
                    checkAndAddPotentialClue(i, j, direction);
                });
            }
        }
    }

    return potentialClues;
}

function calculateSpaceAndStructure(grid, i, j, orientation) {
    let space = 0;
    let wordStructure = '';

    if (orientation === 'ROW') {
        while (j < grid[0].length && isEmpty(grid, {i, j})) {
            wordStructure += grid[i][j] ? grid[i][j] : '-';
            space++;
            j++;
        }
    } else {
        while (i < grid.length && isEmpty(grid, {i, j})) {
            wordStructure += grid[i][j] ? grid[i][j] : '-';
            space++;
            i++;
        }
    }
    return { length: space, wordStructure };
}

function calculateStartAndOrientation(i, j, direction) {
    switch (direction) {
        case 'DOWN':
        case 'RIGHT_DOWN':
        case 'LEFT_DOWN':
            return { orientation: 'COLUMN', start: adjustStartForColumn(i, j, direction) };
        case 'RIGHT':
        case 'UP_RIGHT':
        case 'DOWN_RIGHT':
            return { orientation: 'ROW', start: adjustStartForRow(i, j, direction) };
    }
}

function adjustStartForColumn(i, j, direction) {
    switch (direction) {
        case 'RIGHT_DOWN':
            return { i, j: j + 1 };
        case 'LEFT_DOWN':
            return { i, j: j - 1 };
        default:
            return { i, j };
    }
}

function adjustStartForRow(i, j, direction) {
    switch (direction) {
        case 'UP_RIGHT':
            return { i: i - 1, j };
        case 'DOWN_RIGHT':
            return { i: i + 1, j };
        default:
            return { i, j };
    }
}

function isEmpty(grid, { i, j }) {
    return i >= 0 && i < grid.length && j >= 0 && j < grid[i].length && (grid[i][j] === null || grid[i][j] === "");
}



module.exports = {
    placeNextClue,
    findPotentialCluePlacements,
}