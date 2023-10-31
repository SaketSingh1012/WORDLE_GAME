const { evaluateGuess } = require('./wordle'); // Import your code to be tested
const expect = require('chai').expect; // You need an assertion library like Chai
const chalk = require('chalk');

describe('Wordle Game', function () {
  it('should evaluate a guess correctly', function () {
    const wordToGuess = 'apple'; // Provide the word you're testing against
    const guess = 'apple'; // Provide the guess you want to test

    const result = evaluateGuess(wordToGuess, guess);

    // Write your assertions here
    expect(result).to.deep.equal([
      { index: 0, guessedLetter: chalk.green('a'), status: chalk.green('a') },
      { index: 1, guessedLetter: chalk.green('p'), status: chalk.green('p') },
      { index: 2, guessedLetter: chalk.green('p'), status: chalk.green('p') },
      { index: 3, guessedLetter: chalk.green('l'), status: chalk.green('l') },
      { index: 4, guessedLetter: chalk.green('e'), status: chalk.green('e') },
    ]);
  });

  it('should evaluate an incorrect guess correctly', function () {
    const wordToGuess = 'apple'; // Provide the word you're testing against
    const guess = 'april'; // Provide an incorrect guess

    const result = evaluateGuess(wordToGuess, guess);

    // Write your assertions here
    expect(result).to.deep.equal([
      { index: 0, guessedLetter: chalk.green('a'), status: chalk.green('a') },
      { index: 1, guessedLetter: chalk.green('p'), status: chalk.green('p') },
      { index: 2, guessedLetter: chalk.grey('r'), status: chalk.grey('r') },
      { index: 3, guessedLetter: chalk.grey('i'), status: chalk.grey('i') },
      { index: 4, guessedLetter: chalk.yellow('l'), status: chalk.yellow('l') },
    ]);
  });

  // Add more test cases for different scenarios
});
