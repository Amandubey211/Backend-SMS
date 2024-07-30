import React, { memo } from "react";
import QuizQuestionCard from "./QuizQuestionCard";

const QuizQuestions = memo(
  ({ questions, selectedOptions, handleOptionChange }) => {
    return (
      <div className="w-full p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {questions?.map((question, questionIndex) => (
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
  }
);

export default QuizQuestions;
