const readline = require("readline");
const fs = require("fs").promises;
const chalk = require("chalk");
const evaluateGuess = require("./wordleEvaluator");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let wordList;
let chances = 6;
let hidden = "";
let last = "";

async function loadWordList() {
  try {
    const data = await fs.readFile("word.txt", "utf-8");
    wordList = data.split("\n").map((word) => word.trim());
  } catch (error) {
    console.error("Error reading the word list:", error);
    process.exit(1);
  }
}

function displayWelcomeMessage(word) {
  console.log(
    `Hello User, Welcome to ${word.length} letters Wordle Guess Game`
  );
  console.log(`Instructions:`);
  console.log(
    `1. ${chalk.green(
      "If the letter is in the word and in the right spot, it will turn green"
    )}.`
  );
  console.log(
    `2. ${chalk.yellow(
      "If the letter is in the word, but not on the right spot, it will turn yellow"
    )}.`
  );
  console.log(
    `3. ${chalk.grey(
      "If the letter turns gray, the letter is not in the word at all"
    )}.`
  );
  console.log(`The word is ${word}`);
}

function displayGameStartMessage(attempts) {
  console.log(`You have ${attempts} attempts to guess the word.`);
}

async function startGame() {
  const checkGameStatus = async () => {
    if (last === hidden) {
      console.log(
        `Congratulations! You guessed the word: ${chalk.green(hidden)}`
      );
      rl.close();
    } else if (chances <= 0) {
      gameOver();
    } else {
      console.log(`Attempts left: ${chances}`);
      let guess;
      do {
        guess = await new Promise((resolve) => {
          rl.question("Guess the word: ", resolve);
        });

        if (guess.length !== 5) {
          console.log(
            "The word to guess should be exactly 5 letters long. Guess the word again."
          );
        } else if (!wordList.includes(guess)) {
          console.log("The word is not present in the list");
        }
      } while (guess.length !== 5);

      last = "";
      const feedback = evaluateGuess(hidden, guess);

      feedback.forEach((item) => {
        console.log(
          `index: ${item.index}, guessedLetter: ${chalk[item.status](
            item.guessedLetter
          )}   status: ${chalk[item.status](item.status)}`
        );
      });

      if (guess === hidden) {
        console.log(`Congratulations! You guessed the word: ${hidden}`);
        rl.close();
        return;
      }

      chances--;

      await checkGameStatus();
    }
  };

  await checkGameStatus();
}

async function initializeAndStartWordleGame(wordListArray) {
  if (
    wordListArray &&
    Array.isArray(wordListArray) &&
    wordListArray.length > 0
  ) {
    wordList = wordListArray;
  } else {
    await loadWordList();
  }

  chances = 6;
  hidden = wordList[Math.floor(Math.random() * wordList.length)];

  displayWelcomeMessage(hidden);
  console.log("Press start button to start the game");

  const input = await new Promise((resolve) => {
    rl.question("", resolve);
  });

  if (input === "start") {
    displayGameStartMessage(chances);
    await startGame();
  } else {
    console.log(
      "Invalid input. Please press the start button to start the game."
    );
    rl.close();
  }
}

initializeAndStartWordleGame();
