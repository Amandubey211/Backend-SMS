import React from "react";
import { FaPlayCircle } from "react-icons/fa";

const AssignmentSection = ({ assignment, loading, error }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!assignment) return null;

  const { name, content, thumbnail, type, videoThumbnailUrl } = assignment;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-semibold mb-2">{name}</h2>
      <p className="text-sm text-green-600 mb-4">Assignment</p>
      {/* <img src={thumbnail} alt="Assignment" className="w-full rounded-lg mb-4" /> */}
      <div dangerouslySetInnerHTML={{ __html: content }} className="text-gray-700 mb-6" />
      {videoThumbnailUrl && (
        <div className="relative">
          <img src={videoThumbnailUrl} alt="Video Thumbnail" className="w-full rounded-lg" />
          <FaPlayCircle className="absolute text-white text-6xl inset-0 m-auto" />
        </div>
      )}
    </div>
  );
};

export default AssignmentSection;
