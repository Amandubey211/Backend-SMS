import React from 'react';

const AssignmentDetail = ({ label, value,extra }) => (
  <div className="mt-4">
    <p className="text-sm opacity-85  text-gray-600">{label}</p>
    <p className="text-md font-semibold text-gray-900">{value}</p>
    <p className="text-md font-semibold text-gray-900">{extra}</p>
  </div>
);

export default AssignmentDetail;


/*
import React, { useState } from "react";
import mockData from "./MockData/QuestionsMock";
import QuizQuestionCard from "./QuizQuestionCard";

const QuizQuestions = ({ questions, selectedOptions, handleOptionChange }) => {
  // const [selectedOptions, setSelectedOptions] = useState({});

  // const handleOptionChange = (questionIndex, optionValue) => {
  //   setSelectedOptions({
  //     ...selectedOptions,
  //     [questionIndex]: optionValue,
  //   });
  // };

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

*/