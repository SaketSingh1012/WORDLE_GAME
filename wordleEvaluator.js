function evaluateGuess(wordToGuess, guess) {
  const feedback = [];
  let guessedLettersDict = [...wordToGuess];

  for (let i = 0; i < wordToGuess.length; i++) {
    const guessedLetter = guess[i];
    const isCorrect = guessedLetter === guessedLettersDict[i];

    if (isCorrect) {
      guessedLettersDict[i] = null;
      feedback.push({
        index: i,
        guessedLetter,
        status: "green",
      });
    }
  }

  for (let i = 0; i < wordToGuess.length; i++) {
    if (guessedLettersDict[i] !== null) {
      const guessedLetter = guess[i];
      const isPresent = guessedLettersDict.includes(guessedLetter);

      if (isPresent) {
        guessedLettersDict[i] = null;
        feedback.push({
          index: i,
          guessedLetter,
          status: "yellow",
        });
      }
    }
  }

  for (let i = 0; i < wordToGuess.length; i++) {
    if (guessedLettersDict[i] !== null) {
      feedback.push({
        index: i,
        guessedLetter: guess[i],
        status: "grey",
      });
    }
  }

  feedback.sort((a, b) => a.index - b.index);

  return feedback;
}

module.exports = evaluateGuess;
