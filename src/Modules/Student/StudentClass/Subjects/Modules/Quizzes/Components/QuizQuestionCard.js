

// import React from 'react';

// const QuizQuestionCard = ({ question, questionIndex, selectedOption, handleOptionChange }) => {
//   return (
//     <div className="p-4 bg-white shadow rounded-lg mb-4 border">
//       <div className="text-sm font-semibold text-gray-500 mb-2">
//         Question Point : <span className="text-black">{question.points}</span>
//       </div>
//       <h2 className="text-lg font-semibold mb-3">{question.question}</h2>
//       <div className="space-y-2">
//         {question.options.map((option, optionIndex) => (
//           <label key={optionIndex} className="flex items-center space-x-3">
//             <div className="relative">
//               <input
//                 type="radio"
//                 id={option.id}
//                 name={`quiz-${questionIndex}`}
//                 value={option.value}
//                 checked={selectedOption === option.value}
//                 onChange={() => handleOptionChange(questionIndex, option.value)}
//                 className="form-radio h-4 w-4 text-green-500"
//               />
//             </div>
//             <span>{option.label}</span>
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuizQuestionCard;




import React from 'react';

const QuizQuestionCard = ({ question, questionIndex, selectedOption, handleOptionChange }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg mb-4 border">
      <div className="text-sm font-semibold text-gray-500 mb-2">
        Question Point: <span className="text-black">{question.questionPoint}</span>
      </div>
      <h2 className="text-lg font-semibold mb-3">{question.questionText}</h2>
      <div className="space-y-2">
        {question.options.map((option, optionIndex) => (
          <label key={option._id} className="flex items-center space-x-3"> {/* Using unique ID */}
            <div className="relative">
              <input
                type="radio"
                id={option._id}
                name={`quiz-${questionIndex}`}
                value={option.text} // Assuming 'text' is the string for the option
                checked={selectedOption === option.text}
                onChange={() => handleOptionChange(questionIndex, option.text)}
                className="form-radio h-4 w-4 text-green-500"
              />
            </div>
            <span>{option.text}</span> {/* Assuming 'text' holds the label for the option */}
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestionCard;

