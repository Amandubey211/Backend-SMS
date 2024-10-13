import React from "react";
import { FaPlayCircle } from "react-icons/fa";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import { useSelector } from "react-redux";

const AssignmentSection = () => {
  const { assignmentDetails, loading, error } = useSelector(
    (store) => store.admin.assignments
  );
  if (loading) return <Spinner />;
  if (error || !assignmentDetails) return <NoDataFound />;

  const { name, content, videoThumbnailUrl } = assignmentDetails;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-semibold mb-2">{name}</h2>
      <p className="text-sm text-green-600 mb-4">Assignment</p>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="text-gray-700 mb-6"
      />
      {videoThumbnailUrl && (
        <div className="relative">
          <img
            src={videoThumbnailUrl}
            alt="Video Thumbnail"
            className="w-full rounded-lg"
          />
          <FaPlayCircle className="absolute text-white text-6xl inset-0 m-auto" />
        </div>
      )}
    </div>
  );
};

export default AssignmentSection;
