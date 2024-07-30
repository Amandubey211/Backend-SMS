import React from "react";
import { FaPlayCircle } from "react-icons/fa";

const QuizInstructionSection = ({ quiz }) => {
  console.log("quiz instructions", quiz);

  const { content, thumbnail } = quiz;
  return (
    <>
      <div className="max-w-3xl mx-auto p-2 bg-white ">
        <h1 className="mb-3">Quiz Instructions:</h1>
        <div className="relative">
          {thumbnail && (
            <img
              src={thumbnail}
              alt="Video Thumbnail"
              className="w-full rounded-lg"
            />
          )}

          <FaPlayCircle className="absolute text-white text-6xl inset-0 m-auto" />
        </div>
        <div
          className="text-gray-700 mt-2 mb-6"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </>
  );
};

export default QuizInstructionSection;
