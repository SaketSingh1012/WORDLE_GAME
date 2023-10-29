const readline = require('readline');
const fs = require('fs').promises;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let wordList;
let chances = 6;
let hidden = '';
let last = '';

async function loadWordList() {
  try {
    const data = await fs.readFile('word.txt', 'utf-8');
    wordList = data.split('\n').map((word) => word.trim());
  } catch (error) {
    console.error('Error reading the word list:', error);
    process.exit(1);
  }
}

async function generate() {
  await loadWordList();

  chances = 6;
  hidden = wordList[Math.floor(Math.random() * wordList.length)];

  last = new Array(hidden.length).fill('-').join('');
  console.log(`Hello User, Welcome to ${hidden.length} letters Wordle Guess Game`)
  // console.log(`The word is ${hidden}`);
  console.log('Press start button to start the game');

  const input = await new Promise((resolve) => {
    rl.question('', resolve);
  });

  if (input === 'start') {
    await startGame();
  } else {
    console.log('Invalid input. Please press start button to start the game.');
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
      console.log('Congratulations! You guessed the word: ' + hidden);
      rl.close();
    } else if (chances <= 0) {
      gameOver();
    } else {
      console.log(`Attempts left: ${chances}`);
      const guess = await new Promise((resolve) => {
        rl.question('Guess the word: ', resolve);
      });
      last = '';
      let feedback = [];

      for (let i = 0; i < hidden.length; i++) {
        const guessedLetter = guess[i];
        const isCorrect = guessedLetter === hidden[i];
        const isPresent = hidden.includes(guessedLetter);
        feedback.push({
          index: i,
          guessedLetter,
          isCorrect,
          isPresent,
        });

        if (isCorrect) {
          last += guessedLetter;
        } else {
          last += '-';
        }
      }

      console.log(feedback);

      chances--;

      await checkGameStatus();
    }
  };

  await checkGameStatus();
}

generate();
