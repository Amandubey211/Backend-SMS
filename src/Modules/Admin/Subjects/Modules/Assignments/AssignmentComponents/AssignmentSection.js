import React from 'react';
import { FaPlayCircle } from 'react-icons/fa';
import { assignmentDetails } from './MockData';

const AssignmentSection = () => {
  const { title, type, description, imageUrl, videoThumbnailUrl } = assignmentDetails;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white ">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-green-600 mb-4">{type}</p>
      <img src={imageUrl} alt="Assignment" className="w-full  rounded-lg mb-4" />
      <p className="text-gray-700 mb-6">{description}</p>
      <div className="relative">
        <img src={videoThumbnailUrl} alt="Video Thumbnail" className="w-full rounded-lg" />
        <FaPlayCircle className="absolute text-white text-6xl inset-0 m-auto" />
      </div>
    </div>
  );
};

export default AssignmentSection;
