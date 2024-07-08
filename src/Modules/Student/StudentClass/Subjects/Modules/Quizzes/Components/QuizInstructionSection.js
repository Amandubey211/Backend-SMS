import React from "react";
import { FaPlayCircle } from "react-icons/fa";
import { assignmentDetails } from "../../Assignments/AssignmentComponents/MockData";

const QuizInstructionSection = ({quiz}) => {
  console.log("quiz instructions",quiz)
  // console.log("quiz instructions")

  // const { title, type, description,  imageUrl, videoThumbnailUrl } =assignmentDetails;
  const { content, thumbnail,  } =quiz;
  return (
    <>
    <div className="max-w-3xl mx-auto p-2 bg-white ">
    
    
      <div className="relative">
        <img
          src={thumbnail}
          alt="Video Thumbnail"
          className="w-full rounded-lg"
        />
        <FaPlayCircle className="absolute text-white text-6xl inset-0 m-auto" />
      </div>
      <p className="text-gray-700 mt-2 mb-6">{content}</p>
      <img
        src={thumbnail}
        alt="Assignment"
        className="w-full  rounded-lg mb-4"
      />
      
      
    </div>
    </>
  );
};

export default QuizInstructionSection;


//--------------------


// import React from 'react';

// const QuizInstructionSection = ({ instructions, startTimer, quizStarted, totalTime }) => {
//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-4">Quiz Instructions</h2>
//       <p className="text-gray-700 mb-4">{instructions}</p>
//       {!quizStarted && (
//         <button
//           onClick={startTimer}
//           className="bg-purple-500 text-white py-2 px-4 rounded"
//         >
//           Start Quiz
//         </button>
//       )}
//       {quizStarted && (
//         <div className="text-gray-700">
//           <p>Total Time: {totalTime} seconds</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizInstructionSection;
