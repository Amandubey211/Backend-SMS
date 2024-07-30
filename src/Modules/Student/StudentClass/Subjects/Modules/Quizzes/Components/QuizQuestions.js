import React, { memo } from "react";
import QuizQuestionCard from "./QuizQuestionCard";

const QuizQuestions = memo(({ questions, selectedOptions, handleOptionChange }) => {
  return (
    <div className="w-full p-1">
      <div className="flex justify-start mb-2 font-medium text-xl">
        All Question Preview
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
    </div>
  );
});

export default QuizQuestions;
