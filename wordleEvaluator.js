function evaluateGuess(wordToGuess, guess) {
  const feedback = [];
  const guessedLettersDict = [...wordToGuess];

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
    } else {
      feedback.push({
        index: i,
        guessedLetter,
        status: "grey",
      });
    }
  }

  for (let i = 0; i < wordToGuess.length; i++) {
    if (
      feedback[i].status === "grey" &&
      guessedLettersDict.includes(guess[i])
    ) {
      const correctIndex = guessedLettersDict.indexOf(guess[i]);
      guessedLettersDict[correctIndex] = null;
      feedback[i].status = "yellow";
    }
  }

  feedback.sort((a, b) => a.index - b.index);

  return feedback;
}

module.exports = evaluateGuess;
