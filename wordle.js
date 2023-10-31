const readline = require("readline");
const fs = require("fs").promises;
const chalk = require("chalk");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let wordList;
let chances = 6;
let hidden = "";
let last = "";
let guessedLettersDict;

function setMockUserInput(mockFunction) {
  rl.question = mockFunction;
}

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

function validateWordLength(word) {
  return word.length === 5;
}

function validateWordInList(word, wordList) {
  return wordList.includes(word);
}

function evaluateGuess(wordToGuess, guess) {
  const result = [];

  for (let i = 0; i < wordToGuess.length; i++) {
    const guessedLetter = guess[i];
    const isCorrect = guessedLetter === wordToGuess[i];
    const statusColor = isCorrect ? chalk.green : chalk.yellow;
    const statusText = isCorrect ? "green" : "yellow";
    result.push({
      index: i,
      guessedLetter: statusColor(guessedLetter),
      status: statusColor(statusText),
    });
  }

  return result;
}

function gameOver() {
  console.log(`You Lost! The word was ${hidden}`);
  rl.close();
}

async function startGame() {
  console.log(`You have ${chances} attempts to guess the word.`);

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
      } while (guess.length !== 5 || !wordList.includes(guess));

      last = "";
      let feedback = [];
      guessedLettersDict = [...hidden];
      for (let i = 0; i < hidden.length; i++) {
        const guessedLetter = guess[i];
        const isCorrect = guessedLetter === guessedLettersDict[i];

        if (isCorrect) {
          guessedLettersDict[i] = null;
        }

        feedback.push({
          index: i,
          guessedLetter,
          isCorrect,
        });
      }

      feedback.forEach((item) => {
        let statusColor;
        let statusText;

        if (item.isCorrect) {
          statusColor = chalk.green;
          statusText = "green";
        } else if (guessedLettersDict.includes(item.guessedLetter)) {
          statusColor = chalk.yellow;
          statusText = "yellow";
          guessedLettersDict[guessedLettersDict.indexOf(item.guessedLetter)] =
            null;
        } else {
          statusColor = chalk.grey;
          statusText = "grey";
        }

        console.log(
          `index: ${item.index}, guessedLetter: ${statusColor(
            item.guessedLetter
          )}   status: ${statusColor(statusText)}`
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

async function generate(wordListArray) {
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

generate();

module.exports = evaluateGuess;
