import React from "react";
import { FaCheckCircle, FaTimesCircle, FaRegCircle } from "react-icons/fa";

const QuizQuestionCard = ({
  question,
  questionIndex,
  selectedOption,
  handleOptionChange,
}) => {
  const correctAnswer = question.correctAnswer;

  return (
    <div className="p-4 bg-white shadow rounded-lg mb-4 border">
      <div className="text-sm font-semibold text-gray-500 mb-2">
        Question Point : <span className="text-black">{question.questionPoint}</span>
      </div>
      <h2 className="text-lg font-semibold mb-3">
        <span dangerouslySetInnerHTML={{ __html: question.questionText }}></span>
      </h2>
      <div className="space-y-2">
        {question.options.map((option, optionIndex) => (
          <label
            key={optionIndex}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleOptionChange(questionIndex, option.text)}
          >
            <div className="relative">
              {selectedOption === option.text ? (
                option.text === correctAnswer ? (
                  <FaCheckCircle className="text-green-600 h-5 w-5" />
                ) : (
                  <FaTimesCircle className="text-red-600 h-5 w-5" />
                )
              ) : (
                <FaRegCircle className="text-gray-600 h-5 w-5" />
              )}
            </div>
            <span
              className={
                selectedOption === option.text
                  ? option.text === correctAnswer
                    ? "text-green-600"
                    : "text-red-600"
                  : ""
              }
            >
              {option.text}
            </span>
            <input
              type="radio"
              id={`quiz-${questionIndex}-${optionIndex}`}
              name={`quiz-${questionIndex}`}
              value={option.text}
              checked={selectedOption === option.text}
              onChange={() => handleOptionChange(questionIndex, option.text)}
              className="hidden"
            />
          </label>
        ))}
      </div>
      {selectedOption && (
        <div
          className={`mt-3 p-2 rounded-md ${
            selectedOption === correctAnswer
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {selectedOption === correctAnswer ? (
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
