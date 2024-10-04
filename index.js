const mongoose = require("mongoose");
const colors = require("colors");
const moment = require('moment');
const puzzleGinnie = require("./utils/autoPuzzleJinie");

let limit = 1
let gridSize = 9

try {
  const args = process.argv.slice(2);
  const locale = args[0];

  if (args.length === 0) {
    console.log("Failed to load environment variables")
    process.exit()
  }

  require("dotenv").config({path: `.env.${locale}`});

  if (args.length === 2) {
    gridSize = Number(args[1]);
  }

  if (args.length === 3) {
    limit = args[2];
  }
} catch (e) {
  console.log("Failed to load environment variables")
  process.exit()
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Couldnt connect to MonogoDB..", err);
  });

const puzzleGenerationFlow = async (count, gridSize) => {
  //PUZZLE CREATION FLOW
  let flag = false;
  while (!flag) {
    flag = await puzzleGinnie.generateMultiplePuzzles(count, gridSize);
  }
  console.log(colors.bgGreen(`${flag} PUZZLES GENERATED..!`));
}

(async () => {
  const startTime = moment(); // Capture start time
  await puzzleGenerationFlow(limit, gridSize);
  const endTime = moment(); // Capture end time
  const duration = endTime.diff(startTime); // Get the duration in milliseconds
  const formattedDuration = moment.utc(duration).format('HH:mm:ss'); // Format duration
  console.log(colors.bgRed(`Time taken: ${formattedDuration}`));
  process.exit()
})();
  