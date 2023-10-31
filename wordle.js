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

async function loadWordList() {
  try {
    const data = await fs.readFile("word.txt", "utf-8");
    wordList = data.split("\n").map((word) => word.trim());
  } catch (error) {
    console.error("Error reading the word list:", error);
    process.exit(1);
  }
}

async function generate() {
  await loadWordList();

  chances = 6;
  hidden = wordList[Math.floor(Math.random() * wordList.length)];

  last = new Array(hidden.length).fill("-").join("");
  console.log(
    `Hello User, Welcome to ${hidden.length} letters Wordle Guess Game\nInstructions:\n1.If the letter is in the word and in the right spot, it will turn green.\n2.If the letter is in the word, but not on the right spot, it will turn yellow.\n3.If the letter turns gray, the letter is not in the word at all.`
  );
  console.log(`The word is ${hidden}`);
  console.log("Press start button to start the game");

  const input = await new Promise((resolve) => {
    rl.question("", resolve);
  });

  if (input === "start") {
    await startGame();
  } else {
    console.log(
      "Invalid input. Please press the start button to start the game."
    );
    rl.close();
  }
}

function gameOver() {
  console.log(`You Lost! The word was ${hidden}`);
  rl.close();
}

async function startGame() {
  console.log(`You have ${chances} attempts to guess the word.`);

  const checkGameStatus = async () => {
    if (last === hidden) {
      console.log("Congratulations! You guessed the word: " + hidden);
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
        }
        if(!wordList.includes(guess)){
          console.log("Thw word is not present in the list");
        }
      } while (guess.length !== 5 || !wordList.includes(guess));

      last = "";
      let feedback = [];
      const guessedLetterCount = {};

      for (let i = 0; i < hidden.length; i++) {
        const guessedLetter = guess[i];
        const isCorrect = guessedLetter === hidden[i];

        if (!guessedLetterCount[guessedLetter]) {
          guessedLetterCount[guessedLetter] = 0;
        }
        const isPresent =
          guessedLetterCount[guessedLetter] <
          hidden.split(guessedLetter).length - 1;

        let guessedLetterColor;

        if (isCorrect) {
          guessedLetterColor = chalk.green(guessedLetter);
        } else if (isPresent) {
          guessedLetterColor = chalk.yellow(guessedLetter);
        } else {
          guessedLetterColor = chalk.gray(guessedLetter);
        }

        feedback.push({
          index: i,
          guessedLetter: guessedLetterColor,
          isCorrect,
          isPresent,
        });

        if (isCorrect) {
          last += guessedLetter;
        } else {
          last += "-";
        }

        guessedLetterCount[guessedLetter]++;
      }

      feedback.forEach((item) => {
        console.log(
          `index: ${item.index}, guessedLetter: ${item.guessedLetter}, isCorrect: ${item.isCorrect}, isPresent: ${item.isPresent}`
        );
      });

      chances--;

      await checkGameStatus();
    }
  };

  await checkGameStatus();
}
generate();
