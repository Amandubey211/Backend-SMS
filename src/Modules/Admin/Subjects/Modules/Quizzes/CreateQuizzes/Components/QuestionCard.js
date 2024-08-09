import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaRegCircle } from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

// Utility function to shuffle an array
function shuffleArray(array) {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const QuestionCard = ({
  question,
  deleteQuestion,
  editQuestion,
  allowShuffleAnswers,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const correctAnswer = question.correctAnswer;

  useEffect(() => {
    if (allowShuffleAnswers) {
      setShuffledOptions(shuffleArray([...question.options]));
    } else {
      setShuffledOptions(question.options);
    }
  }, [question.options, allowShuffleAnswers]);

  const handleOptionClick = (option) => {
    setSelectedOption(option.text);
  };

  return (
    <div className="bg-white shadow min-h-60 min-w-96 rounded-lg mb-4 border">
      <div className="flex justify-between items-center mb-2 bg-gray-100 p-3">
        <div className="text-sm font-semibold">
          Question Point :{" "}
          <span className="text-black">{question.questionPoint}</span>
        </div>
        <div className="flex space-x-2">
          <FiEdit2
            className="text-green-600 cursor-pointer text-xl"
            onClick={editQuestion}
          />
          <FiTrash2
            className="text-red-600 cursor-pointer text-xl"
            onClick={deleteQuestion}
          />
        </div>
      </div>
      <div className="px-4 py-2">
        <h2 className="text-lg font-semibold mb-3">
          <span
            dangerouslySetInnerHTML={{ __html: question.questionText }}
          ></span>
        </h2>
        {question.type === "text" ? (
          // Render a text area if the question type is "text"
          <textarea
            rows="4"
            className="w-full p-2 border rounded bg-gray-50"
            placeholder="Type your answer here..."
          />
        ) : (
          <div className="space-y-2 ms-4">
            {shuffledOptions.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => handleOptionClick(option)}
              >
                <div className="relative">
                  {selectedOption === option.text ? (
                    option.text === correctAnswer ? (
                      <FaCheckCircle className="text-green-600 h-4 w-4" />
                    ) : (
                      <FaTimesCircle className="text-red-600 h-4 w-4" />
                    )
                  ) : (
                    <FaRegCircle className="text-gray-600 h-4 w-4" />
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
              </label>
            ))}
          </div>
        )}
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
                <FaCheckCircle className="mr-2" />{" "}
                {question.correctAnswerComment || "Right Answer"}
              </div>
            ) : (
              <div className="flex items-center text-sm">
                <FaTimesCircle className="mr-2" />{" "}
                {question.inCorrectAnswerComment || "Wrong Answer"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
