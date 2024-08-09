import React from "react";
import { FaCheckCircle, FaTimesCircle, FaRegCircle } from "react-icons/fa";

const SpeedGradeQuizAnswerCard = ({
  question,
  questionIndex,
  selectedOption,
}) => {
  const correctAnswer = question.correctAnswer;
  const isCorrect = selectedOption === correctAnswer;
  console.log(question.type);

  return (
    <div className="relative bg-white shadow rounded-lg mb-4 border flex flex-col h-full">
      {/* Badge at the top right */}
      {question.type === "text" ? (
        <></>
      ) : (
        <div className="absolute top-1 right-0">
          {isCorrect ? (
            <span className="px-2 py-2 text-xs shadow-sm font-semibold text-green-800 bg-green-200 rounded-l-full">
              Correct Answer
            </span>
          ) : (
            <span className="px-2 py-2 text-xs font-semibold shadow-sm text-red-800 bg-red-200 rounded-l-full">
              Wrong Answer
            </span>
          )}
        </div>
      )}

      <div className="text-sm font-semibold py-2 ps-2 bg-gray-100 text-gray-500 mb-2">
        Question Point:{" "}
        <span className="text-black">{question.questionPoint}</span>
      </div>
      <div className="px-4 pb-3">
        <h2 className="text-md font-semibold mb-3">
          <span
            dangerouslySetInnerHTML={{ __html: question.questionText }}
          ></span>
        </h2>

        <div className="">
          {" "}
          {/* Reduced spacing here */}
          {question.type === "text" ? (
            <textarea
              rows="4"
              className="w-full p-2 border rounded flex-grow bg-gray-50"
              value={selectedOption || "No answer provided"}
              readOnly
            />
          ) : (
            question.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className={`flex items-center space-x-3 cursor-pointer p-1 rounded-md ${
                  option.text === selectedOption
                    ? option.text === correctAnswer
                      ? "bg-green-100"
                      : "bg-red-100"
                    : option.text === correctAnswer
                    ? "bg-green-50"
                    : ""
                }`}
              >
                <div className="relative">
                  {option.text === correctAnswer ? (
                    <FaCheckCircle className="text-green-600 h-5 w-5" />
                  ) : option.text === selectedOption ? (
                    <FaTimesCircle className="text-red-600 h-5 w-5" />
                  ) : (
                    <FaRegCircle className="text-gray-600 h-5 w-5" />
                  )}
                </div>
                <span
                  className={
                    option.text === selectedOption
                      ? option.text === correctAnswer
                        ? "text-green-600"
                        : "text-red-600"
                      : option.text === correctAnswer
                      ? "text-green-600"
                      : "text-gray-600"
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
                  className="hidden"
                  readOnly
                />
              </label>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeedGradeQuizAnswerCard;
