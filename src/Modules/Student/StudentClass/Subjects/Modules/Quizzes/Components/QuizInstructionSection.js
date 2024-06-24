import React from "react";
import { FaPlayCircle } from "react-icons/fa";
import { assignmentDetails } from "../../Assignments/AssignmentComponents/MockData";

const QuizInstructionSection = () => {
  const { title, type, description, imageUrl, videoThumbnailUrl } =
    assignmentDetails;
  return (
    <div className="max-w-3xl mx-auto p-2 bg-white ">
    
    
      <div className="relative">
        <img
          src={videoThumbnailUrl}
          alt="Video Thumbnail"
          className="w-full rounded-lg"
        />
        <FaPlayCircle className="absolute text-white text-6xl inset-0 m-auto" />
      </div>
      <p className="text-gray-700 mt-2 mb-6">{description}</p>
      <img
        src={imageUrl}
        alt="Assignment"
        className="w-full  rounded-lg mb-4"
      />
      
      
    </div>
  );
};

export default QuizInstructionSection;
