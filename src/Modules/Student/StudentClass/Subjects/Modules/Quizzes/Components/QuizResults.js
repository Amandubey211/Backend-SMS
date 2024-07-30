import React from 'react';
import SelectedQuestionCard from './SelectedQuestionCard';

const QuizResults = ({ questions, selectedOptions }) => {
  let totalPoints = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;

  const results = questions.map((question, index) => {
    const selectedOption = selectedOptions[index];
    const isCorrect = selectedOption && selectedOption === question.correctAnswer;

    if (selectedOption) {
      if (isCorrect) {
        correctAnswers += 1;
        totalPoints += question.questionPoint;
      } else {
        wrongAnswers += 1;
      }
    }

    return {
      question: question.questionText,
      selectedOption: selectedOption,
      correctOption: question.correctAnswer,
      isCorrect: isCorrect,
    };
  });

  return (
    <div className="p-4 bg-white shadow rounded-lg mb-4 border flex flex-wrap gap-2 justify-between">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-3">Quiz Results</h2>
        <div>Total Points: {totalPoints}</div>
        <div>Total Attempted Questions: {correctAnswers + wrongAnswers}</div>
        <div>Correct Answers: {correctAnswers}</div>
        <div>Wrong Answers: {wrongAnswers}</div>
      </div>
      {results.map((result, index) => (
        <SelectedQuestionCard
          key={index}
          question={result.question}
          selectedOption={result.selectedOption}
          correctOption={result.correctOption}
          isCorrect={result.isCorrect}
        />
      ))}
    </div>
  );
};

export default React.memo(QuizResults);
