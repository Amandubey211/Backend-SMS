import React from "react";
import SelectedQuestionCard from "./SelectedQuestionCard";
import { useSelector } from "react-redux";

const QuizResults = ({hasRemainingAttempts}) => {

  const { selectedOptions, itemDetails } = useSelector((store) => store?.student?.studentQuiz);
  const {questions}=itemDetails;
  let totalPoints = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;

  questions.forEach((question, index) => {
    const selectedOption = selectedOptions[index];
    const isCorrect = selectedOption === question.correctAnswer;

    if (selectedOption) {
      if (isCorrect) {
        correctAnswers += 1;
        totalPoints += question.questionPoint;
      } else {
        wrongAnswers += 1;
      }
    }
  });

  return (
    <div className="p-4 bg-white shadow rounded-lg mb-4 mt-4 border flex flex-wrap gap-2 justify-between">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quiz Results</h2>
        <ul className="list-none space-y-2">
          <li className="font-mono">
            Total Attempted Questions:
            <span className="text-blue-600 font-semibold">
              {correctAnswers + wrongAnswers}
            </span>
          </li>
          <li className="font-mono">
            Points:
            <span className="text-blue-600 font-semibold">{totalPoints}</span>
          </li>
          <li className="font-mono">
            Correct Answers:
            <span className="text-green-600 font-semibold">
              {correctAnswers}
            </span>
          </li>
          <li className="font-mono">
            Wrong Answers:
            <span className="text-red-600">{wrongAnswers}</span>
          </li>
        </ul>
      </div>

      {questions?.map((question, index) => (
        <SelectedQuestionCard
          key={index}
          question={question}
          selectedOption={selectedOptions[index]}
        />
      ))}
    </div>
  );
};

export default QuizResults;
