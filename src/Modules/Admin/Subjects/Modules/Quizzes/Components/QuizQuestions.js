import React, { useState } from "react";
import QuizQuestionCard from "./QuizQuestionCard";
import { FaQuestionCircle } from "react-icons/fa";

const QuizQuestions = ({ questions }) => {
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionChange = (questionIndex, optionText) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: optionText,
    });
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <FaQuestionCircle className="text-6xl text-gray-400" />
        <p className="text-xl font-semibold text-gray-600 mt-2">
          No questions available
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-1">
      <div className="flex justify-start mb-2 font-medium text-xl">
        All Question Preview
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((question, questionIndex) => (
          <QuizQuestionCard
            key={questionIndex}
            question={question}
            questionIndex={questionIndex}
            selectedOption={selectedOptions[questionIndex]}
            handleOptionChange={handleOptionChange}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizQuestions;
