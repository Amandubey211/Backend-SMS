import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const SpeedGradeQuizAnswerCard = ({
  question,
  questionIndex,
  selectedOption,
}) => {
  const correctAnswer = question.correctAnswer;

  return (
    <div className="p-4 bg-white shadow rounded-lg mb-4 border flex flex-col h-full">
      <div className="text-sm font-semibold text-gray-500 mb-2">
        Question Point :{" "}
        <span className="text-black">{question.questionPoint}</span>
      </div>
      <h2 className="text-lg font-semibold mb-3">
        <span dangerouslySetInnerHTML={{ __html: question.questionText }}></span>
      </h2>
      <div className="space-y-2">
        {question.type === "text" ? (
          <textarea
            rows="4"
            className="w-full p-2 border rounded flex-grow bg-gray-50"
            value={selectedOption || "No answer provided"}
            readOnly
          />
        ) : (
          question.options.map((option, optionIndex) => (
            <div
              key={optionIndex}
              className={`flex items-center space-x-3 ${
                option.text === selectedOption
                  ? option.text === correctAnswer
                    ? "bg-green-100"
                    : "bg-red-100"
                  : ""
              } p-2 rounded-md`}
            >
              {option.text === selectedOption && (
                <div className="relative">
                  {option.text === correctAnswer ? (
                    <FaCheckCircle className="text-green-600 h-5 w-5" />
                  ) : (
                    <FaTimesCircle className="text-red-600 h-5 w-5" />
                  )}
                </div>
              )}
              <span
                className={
                  option.text === selectedOption
                    ? option.text === correctAnswer
                      ? "text-green-600"
                      : "text-red-600"
                    : "text-gray-600"
                }
              >
                {option.text}
              </span>
            </div>
          ))
        )}
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
              <FaCheckCircle className="mr-2" /> {question.correctAnswerComment || "Correct Answer"}
            </div>
          ) : (
            <div className="flex items-center text-sm">
              <FaTimesCircle className="mr-2" /> {question.inCorrectAnswerComment || "Incorrect Answer"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpeedGradeQuizAnswerCard;
