import { useState } from "react";
import mockData from "./MockData/QuestionsMock";

const QuizQuestions = () => {
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionChange = (questionIndex, optionValue) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: optionValue,
    });
  };

  return (
    <div className="p-4 w-full">
      {mockData.map((question, questionIndex) => (
        <div key={questionIndex} className="space-y-4 pb-3 mb-2">
          <h1 className="text-xl font-semibold mb-4">{question.question}</h1>
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option) => (
              <label key={option.id} className="radio-button  radio-green flex items-center border-2 border-gray-300 rounded-full px-4 py-2 cursor-pointer transition-colors duration-200 hover:border-green-500">
                <input
                  type="radio"
                  id={option.id}
                  name={`quiz-${questionIndex}`}
                  value={option.value}
                  checked={selectedOptions[questionIndex] === option.value}
                  onChange={() => handleOptionChange(questionIndex, option.value)}
                  className="mr-2  "
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizQuestions;
