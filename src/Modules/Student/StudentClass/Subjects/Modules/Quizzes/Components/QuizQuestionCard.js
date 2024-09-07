import React from "react";

const QuizQuestionCard = ({
  question,
  questionIndex,
  selectedOption,
  handleOptionChange,
}) => {
  return (
    <div className="bg-white shadow rounded-lg mb-4 border border-gray-200">
      <div className="text-sm p-4 font-semibold text-gray-500 mb-2 bg-gray-100">
        Question Point:{" "}
        <span className="text-black">{question.questionPoint}</span>
      </div>

      {/* Render question text */}
      <h2
        className="text-md font-semibold mb-3 ps-3"
        dangerouslySetInnerHTML={{ __html: question.questionText }}
      ></h2>

      {/* Render answer options based on question type */}
      <div className="space-y-2 px-3 pb-5">
        {question.type === "text" ? (
          // For text questions, we use a textarea for the answer
          <textarea
            id={`quiz-text-${questionIndex}`}
            name={`quiz-text-${questionIndex}`}
            value={selectedOption || ""} // Handle case where selectedOption is null/undefined
            onChange={(e) => handleOptionChange(questionIndex, e.target.value)}
            className="form-textarea mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            rows="5"
            placeholder="Type your answer here..."
            style={{ resize: "none" }} // Prevent resizing
          />
        ) : (
          // For multiple-choice questions, render radio buttons
          question.options.map((option) => (
            <label key={option._id} className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="radio"
                  id={option._id}
                  name={`quiz-${questionIndex}`}
                  value={option.text}
                  checked={selectedOption === option.text}
                  onChange={() =>
                    handleOptionChange(questionIndex, option.text)
                  }
                  className="form-radio h-4 w-4 text-blue-500"
                />
              </div>
              <span>{option.text}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(QuizQuestionCard);
