

import React, { useState } from "react";
import QuizQuestionCard from "./QuizQuestionCard";

const QuizQuestions = ({
  questions,
  selectedOptions,
  handleOptionChange,
  showOneQuestionOnly,
  handleSubmit,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (showOneQuestionOnly) {
    // If showOneQuestionOnly is true, display one question at a time
    const question = questions[currentQuestionIndex];

    return (
      <div className="w-full p-1">
        <QuizQuestionCard
          question={question}
          questionIndex={currentQuestionIndex}
          selectedOption={selectedOptions[currentQuestionIndex]}
          handleOptionChange={handleOptionChange}
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="bg-blue-500 text-white py-2 px-4 rounded-md disabled:bg-gray-300"
          >
            Previous
          </button>
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Submit All
            </button>
          )}
        </div>
      </div>
    );
  }

  // If showOneQuestionOnly is false, display all questions at once
  return (
    <div className="w-full p-1">
      <div className="flex justify-start mb-2 font-medium text-xl">
        All Questions Preview
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((question, questionIndex) => (
          <QuizQuestionCard
            key={question._id}
            question={question}
            questionIndex={questionIndex}
            selectedOption={selectedOptions[questionIndex]}
            handleOptionChange={handleOptionChange}
          />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Submit All
        </button>
      </div>
    </div>
  );
};

export default React.memo(QuizQuestions);
