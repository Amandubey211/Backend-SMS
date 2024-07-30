import React from 'react';

const QuizQuestionCard = ({ question, questionIndex, selectedOption, handleOptionChange }) => {
  return (
    <div className=" bg-white shadow rounded-lg mb-4 border border-gray-200">
      <div className="text-sm p-4 font-semibold text-gray-500 mb-2 bg-gray-100 ">
        Question Point: <span className="text-black">{question.questionPoint}</span>
      </div>
      <h2 className="text-md font-semibold  mb-3 ps-3" dangerouslySetInnerHTML={{ __html: question.questionText }}></h2>
      <div className="space-y-2 px-3 pb-5 ">
        {question.options.map((option) => (
          <label key={option._id} className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="radio"
                id={option._id}
                name={`quiz-${questionIndex}`}
                value={option.text}
                checked={selectedOption === option.text}
                onChange={() => handleOptionChange(questionIndex, option.text)}
                className="form-radio h-4 w-4 text-blue-500"
              />
            </div>
            <span>{option.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default React.memo(QuizQuestionCard);
