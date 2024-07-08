// import React, { useState } from "react";
// import mockData from "./MockData/QuestionsMock";
// import QuizQuestionCard from "./QuizQuestionCard";

// const QuizQuestions = ({ questions, selectedOptions, handleOptionChange }) => {
//   // const [selectedOptions, setSelectedOptions] = useState({});

//   // const handleOptionChange = (questionIndex, optionValue) => {
//   //   setSelectedOptions({
//   //     ...selectedOptions,
//   //     [questionIndex]: optionValue,
//   //   });
//   // };

//   return (
//     <div className="w-full p-1">
//       <div className="flex justify-start mb-2 font-medium text-xl">
//         All Question Preview
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {mockData.map((question, questionIndex) => (
//           <QuizQuestionCard
//             key={questionIndex}
//             question={question}
//             questionIndex={questionIndex}
//             selectedOption={selectedOptions[questionIndex]}
//             handleOptionChange={handleOptionChange}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuizQuestions;



//------------------------------------

// import React from "react";
// import QuizQuestionCard from "./QuizQuestionCard";

// const QuizQuestions = ({ questions, selectedOptions, handleOptionChange }) => {
//   console.log("question in quiz questions",questions)
//   console.log("selectedOptions in quiz questions",selectedOptions)
//   console.log("handleOptionChange in quiz questions",handleOptionChange)
//   return (
//     <div className="w-full p-1">
//       <div className="flex justify-start mb-2 font-medium text-xl">
//         All Question Preview
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {questions.map((question, questionIndex) => (
//           <QuizQuestionCard
//             key={question._id} // Use unique ID if available, else use questionIndex
//             question={question}
//             questionIndex={questionIndex}
//             selectedOption={selectedOptions[questionIndex]}
//             handleOptionChange={handleOptionChange}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuizQuestions;



//-----------------useMemo----------------
import React, { memo } from "react";
import QuizQuestionCard from "./QuizQuestionCard";

const QuizQuestions = ({ questions, selectedOptions, handleOptionChange }) => {
  console.log("question in quiz questions", questions);
  console.log("selectedOptions in quiz questions", selectedOptions);
  console.log("handleOptionChange in quiz questions", handleOptionChange);

  return (
    <div className="w-full p-1">
      <div className="flex justify-start mb-2 font-medium text-xl">
        All Question Preview
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((question, questionIndex) => (
          <QuizQuestionCard
            key={question._id} // Use unique ID if available, else use questionIndex
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

export default memo(QuizQuestions);


