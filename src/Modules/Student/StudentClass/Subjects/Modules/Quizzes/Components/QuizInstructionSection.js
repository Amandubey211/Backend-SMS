import React, { useEffect } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { stdGetSingleQuiz } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizes.action";

const QuizInstructionSection = () => {

  const { itemDetails } = useSelector((store) => store?.student?.studentQuiz);

  console.log("itemDetails", itemDetails)
  const { content, thumbnail } = itemDetails;

  return (
    <div className="max-w-3xl mx-auto p-2 bg-white ">
      <h1 className="mb-2 text-xl text-gray-500 font-semibold">
        Quiz Instructions:
      </h1>
      <div className="relative mb-6">
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
        className="text-gray-700"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default QuizInstructionSection;
