



// import React from 'react';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// const SelectedQuestionCard = ({ question, selectedOption }) => {
//   const correctOption = question.correctAnswer;

//   return (
//     <div className="w-[300px] p-4 bg-white shadow rounded-lg mb-4 border">
//       <div className="text-sm font-semibold text-gray-500 mb-2">
//         Question Point : <span className="text-black">{question.questionPoint}</span>
//       </div>
//       <h2 className="text-lg font-semibold mb-3">{question.questionText}</h2>
//       <div className="space-y-2">
//         {question.options.map((option, optionIndex) => (
//           <label key={optionIndex} className="flex items-center space-x-3">
//             <div className="relative">
//               <input
//                 type="radio"
//                 id={option._id}
//                 name={`selected-question`}
//                 value={option.text}
//                 checked={selectedOption === option.text}
//                 readOnly
//                 className="form-radio h-4 w-4 text-green-500"
//               />
//             </div>
//             <span>{option.text}</span>
//             {selectedOption === option.text && (
//               <span className={option.text === correctOption ? 'text-green-600' : 'text-red-600'}>
//                 {option.text === correctOption ? (
//                   <FaCheckCircle className="ml-2" />
//                 ) : (
//                   <FaTimesCircle className="ml-2" />
//                 )}
//               </span>
//             )}
//           </label>
//         ))}
//       </div>
//       {selectedOption && (
//         <div
//           className={`mt-3 p-2 rounded-md ${
//             selectedOption === correctOption ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//           }`}
//         >
//           {selectedOption === correctOption ? (
//             <div className="flex items-center text-sm">
//               <FaCheckCircle className="mr-2" /> Right Answer
//             </div>
//           ) : (
//             <div className="flex items-center text-sm">
//               <FaTimesCircle className="mr-2" /> Wrong Answer
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SelectedQuestionCard;



// import React from "react";
// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// const SelectedQuestionCard = ({
//   question,
//   selectedOption,
//   correctOption,
//   isCorrect,
// }) => {
//   return (
//     <div className="w-full p-4 bg-white shadow rounded-lg mb-4 border">
//       <div className="text-sm font-semibold text-gray-500 mb-2">
//         Question Point: <span className="text-black">{question.questionPoint}</span>
//       </div>
//       <h2 className="text-lg font-semibold mb-3">{question.questionText}</h2>
      
//       {question.type === 'text' ? (
//         <div className="bg-gray-100 p-3 rounded-lg">
//           <p className="text-sm text-gray-700">Your Answer:</p>
//           <p className={`mt-1 p-2 rounded-md ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//             {selectedOption}
//           </p>
//           {!isCorrect && correctOption && (
//             <p className="text-sm text-gray-500 mt-2">
//               Correct Answer: <span className="text-black">{correctOption}</span>
//             </p>
//           )}
//         </div>
//       ) : (
//         <div className="space-y-2">
//           {question?.options?.map((option, optionIndex) => (
//             <label key={optionIndex} className="flex items-center space-x-3">
//               <div className="relative">
//                 <input
//                   type="radio"
//                   id={option._id}
//                   name={`selected-question`}
//                   value={option.text}
//                   checked={selectedOption === option.text}
//                   readOnly
//                   className="form-radio h-4 w-4 text-green-500"
//                 />
//               </div>
//               <span>{option.text}</span>
//               {selectedOption === option.text && (
//                 <span
//                   className={
//                     option.text === correctOption
//                       ? "text-green-600"
//                       : "text-red-600"
//                   }
//                 >
//                   {option.text === correctOption ? (
//                     <FaCheckCircle className="ml-2" />
//                   ) : (
//                     <FaTimesCircle className="ml-2" />
//                   )}
//                 </span>
//               )}
//             </label>
//           ))}
//         </div>
//       )}

//       {selectedOption && question.type !== 'text' && (
//         <div
//           className={`mt-3 p-2 rounded-md ${
//             selectedOption === correctOption
//               ? "bg-green-100 text-green-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {selectedOption === correctOption ? (
//             <div className="flex items-center text-sm">
//               <FaCheckCircle className="mr-2" /> Right Answer
//             </div>
//           ) : (
//             <div className="flex items-center text-sm">
//               <FaTimesCircle className="mr-2" /> Wrong Answer
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default React.memo(SelectedQuestionCard);


//------------------👇


// import React from 'react';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// const SelectedQuestionCard = ({ question, selectedOption }) => {
//   const correctOption = question.correctAnswer;
//   const isCorrect = selectedOption === correctOption;

//   return (
//     <div className=" p-5 bg-white shadow-lg rounded-lg mb-6 border border-gray-200">
//       <div className="text-sm font-semibold text-gray-500 mb-3">
//         Question Point: <span className="text-black">{question.questionPoint}</span>
//       </div>
//       {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">{question.questionText}</h2> */}
//       <h2 
//         className="text-xl font-semibold text-gray-800 mb-4" 
//         dangerouslySetInnerHTML={{ __html: question.questionText }}>
//       </h2>
//       {question.type === 'text' ? (
//         <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'} border ${isCorrect ? 'border-green-300' : 'border-red-300'}`}>
//           <p className="text-sm text-gray-800">Your Answer:</p>
//           <p className={`mt-2 p-3 rounded-md font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
//             {selectedOption}
//           </p>
//           {!isCorrect && (
//             <p className="text-sm text-gray-600 mt-3">
//               Correct Answer: <span className="font-bold text-black">{correctOption}</span>
//             </p>
//           )}
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {question.options.map((option, optionIndex) => (
//             <label key={optionIndex} className="flex items-center space-x-4">
//               <div className="relative">
//                 <input
//                   type="radio"
//                   id={option._id}
//                   name={`selected-question`}
//                   value={option.text}
//                   checked={selectedOption === option.text}
//                   readOnly
//                   className="form-radio h-5 w-5 text-blue-500"
//                 />
//               </div>
//               <span className="text-gray-700">{option.text}</span>
//               {selectedOption === option.text && (
//                 <span className={option.text === correctOption ? 'text-green-600' : 'text-red-600'}>
//                   {option.text === correctOption ? (
//                     <FaCheckCircle className="ml-3 text-lg" />
//                   ) : (
//                     <FaTimesCircle className="ml-3 text-lg" />
//                   )}
//                 </span>
//               )}
//             </label>
//           ))}
//         </div>
//       )}

//       {selectedOption && question.type !== 'text' && (
//         <div className={`mt-4 p-3 rounded-md ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
//           {isCorrect ? (
//             <div className="flex items-center text-md">
//               <FaCheckCircle className="mr-3" /> Right Answer
//             </div>
//           ) : (
//             <div className="flex items-center text-md">
//               <FaTimesCircle className="mr-3" /> Wrong Answer
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default React.memo(SelectedQuestionCard);

//----------------👆

import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const SelectedQuestionCard = ({ question, selectedOption }) => {
  const correctOption = question.correctAnswer;
  const isCorrect = selectedOption === correctOption;
  
  return (
    <div className="p-5 bg-white shadow-lg rounded-lg mb-6 border border-gray-200">
      <div className="text-sm font-semibold text-gray-500 mb-3">
        Question Point: <span className="text-black">{question.questionPoint}</span>
      </div>
      <h2 
        className="text-xl font-semibold text-gray-800 mb-4" 
        dangerouslySetInnerHTML={{ __html: question.questionText }}
      ></h2>
      {question.type === 'text' ? (
        <div className={`p-4 rounded-lg ${isCorrect ? 'bg-blue-50' : 'bg-blue-100'} border ${isCorrect ? 'border-blue-300' : 'border-blue-400'}`}>
          <p className="text-sm text-gray-800">Your Answer:</p>
          <p className={`mt-2 p-3 rounded-md font-medium ${isCorrect ? 'text-blue-700' : 'text-blue-800'}`}>
            {selectedOption}
          </p>
          {!isCorrect && correctOption && (
            <p className="text-sm text-gray-600 mt-3">
              Correct Answer: <span className="font-bold text-black">{correctOption}</span>
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {question.options.map((option, optionIndex) => (
            <label key={optionIndex} className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="radio"
                  id={option._id}
                  name={`selected-question`}
                  value={option.text}
                  checked={selectedOption === option.text}
                  readOnly
                  className="form-radio h-5 w-5 text-blue-500"
                />
              </div>
              <span className="text-gray-700">{option.text}</span>
              {selectedOption === option.text && (
                <span className={option.text === correctOption ? 'text-green-600' : 'text-red-600'}>
                  {option.text === correctOption ? (
                    <FaCheckCircle className="ml-3 text-lg" />
                  ) : (
                    <FaTimesCircle className="ml-3 text-lg" />
                  )}
                </span>
              )}
            </label>
          ))}
        </div>
      )}

      {selectedOption && question.type !== 'text' && (
        <div className={`mt-4 p-3 rounded-md ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {isCorrect ? (
            <div className="flex items-center text-md">
              <FaCheckCircle className="mr-3" /> Right Answer
            </div>
          ) : (
            <div className="flex items-center text-md">
              <FaTimesCircle className="mr-3" /> Wrong Answer
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(SelectedQuestionCard);
