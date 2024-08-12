

// import React from 'react';

// const QuizQuestionCard = ({ question, questionIndex, selectedOption, handleOptionChange }) => {
//   return (
//     <div className="p-4 bg-white shadow rounded-lg mb-4 border">
//       <div className="text-sm font-semibold text-gray-500 mb-2">
//         Question Point: <span className="text-black">{question.questionPoint}</span>
//       </div>
//       <h2 className="text-lg font-semibold mb-3">{question.questionText}</h2>
//       <div className="space-y-2">
//         {question.options.map((option, optionIndex) => (
//           <label key={option._id} className="flex items-center space-x-3"> {/* Using unique ID */}
//             <div className="relative">
//               <input
//                 type="radio"
//                 id={option._id}
//                 name={`quiz-${questionIndex}`}
//                 value={option.text} // Assuming 'text' is the string for the option
//                 checked={selectedOption === option.text}
//                 onChange={() => handleOptionChange(questionIndex, option.text)}
//                 className="form-radio h-4 w-4 text-green-500"
//               />
//             </div>
//             <span>{option.text}</span> {/* Assuming 'text' holds the label for the option */}
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
    <div className="bg-white shadow rounded-lg mb-4 border border-gray-200">
      <div className="text-sm p-4 font-semibold text-gray-500 mb-2 bg-gray-100">
        Question Point: <span className="text-black">{question.questionPoint}</span>
      </div>
      <h2 
        className="text-md font-semibold mb-3 ps-3" 
        dangerouslySetInnerHTML={{ __html: question.questionText }}>
      </h2>
      <div className="space-y-2 px-3 pb-5">
        {question.type === 'text' ? (
          <textarea
            id={`quiz-text-${questionIndex}`}
            name={`quiz-text-${questionIndex}`}
            value={selectedOption || ''}
            onChange={(e) => handleOptionChange(questionIndex, e.target.value)}
            className="form-textarea mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            rows="5"
            placeholder="Type your answer here..."
            style={{ resize: 'none' }} // Prevent resizing
          />
        ) : (
          question.options.map((option) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(QuizQuestionCard);
