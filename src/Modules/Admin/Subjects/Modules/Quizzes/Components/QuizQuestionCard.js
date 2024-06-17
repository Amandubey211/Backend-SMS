import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const QuizQuestionCard = ({
  question,
  questionIndex,
  selectedOption,
  handleOptionChange,
}) => {
  const correctOption = question.options.find((option) => option.isCorrect);

  return (
    <div className="p-4 bg-white shadow rounded-lg mb-4 border">
      <div className="text-sm font-semibold text-gray-500 mb-2">
        Question Point : <span className="text-black">{question.points}</span>
      </div>
      <h2 className="text-lg font-semibold mb-3">{question.question}</h2>
      <div className="space-y-2">
        {question.options.map((option, optionIndex) => (
          <label key={optionIndex} className="flex items-center space-x-3">
            <div className="relative">
              {selectedOption && selectedOption === option.value ? (
                option.isCorrect ? (
                  <FaCheckCircle className="text-green-600 h-5 w-5" />
                ) : (
                  <FaTimesCircle className="text-red-600 h-5 w-5" />
                )
              ) : (
                <input
                  type="radio"
                  id={option.id}
                  name={`quiz-${questionIndex}`}
                  value={option.value}
                  checked={selectedOption === option.value}
                  onChange={() =>
                    handleOptionChange(questionIndex, option.value)
                  }
                  className="form-radio h-4 w-4 text-green-500"
                />
              )}
            </div>
            <span
              className={
                selectedOption === option.value
                  ? option.isCorrect
                    ? "text-green-600"
                    : "text-red-600"
                  : ""
              }
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {selectedOption && (
        <div className={`mt-3 p-2 rounded-md ${selectedOption === correctOption.value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {selectedOption === correctOption.value ? (
            <div className="flex items-center text-sm">
              <FaCheckCircle className="mr-2" /> Right Answer
            </div>
          ) : (
            <div className="flex items-center text-sm">
              <FaTimesCircle className="mr-2" /> Wrong Answer
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizQuestionCard;
