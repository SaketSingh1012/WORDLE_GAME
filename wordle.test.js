const evaluateGuess = require("./wordleEvaluator");
const { expect } = require("chai");

describe("Wordle Game", function () {
  it("should evaluate a correct guess correctly", function () {
    const wordToGuess = "apple";
    const guess = "apple";

    const result = evaluateGuess(wordToGuess, guess);

    expect(result).to.deep.equal([
      { index: 0, guessedLetter: "a", status: "green" },
      { index: 1, guessedLetter: "p", status: "green" },
      { index: 2, guessedLetter: "p", status: "green" },
      { index: 3, guessedLetter: "l", status: "green" },
      { index: 4, guessedLetter: "e", status: "green" },
    ]);
  });

  it("should evaluate an incorrect guess correctly", function () {
    const wordToGuess = "apple";
    const guess = "april";

    const result = evaluateGuess(wordToGuess, guess);
    expect(result).to.deep.equal([
      { index: 0, guessedLetter: "a", status: "green" },
      { index: 1, guessedLetter: "p", status: "green" },
      { index: 2, guessedLetter: "r", status: "grey" },
      { index: 3, guessedLetter: "i", status: "grey" },
      { index: 4, guessedLetter: "l", status: "yellow" },
    ]);
  });
});
