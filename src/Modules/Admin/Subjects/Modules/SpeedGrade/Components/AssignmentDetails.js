import React from "react";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";

const AssignmentDetails = ({ student, assignment }) => {
  if (!student || !assignment) {
    return (
      <div className="flex items-center justify-center text-gray-400 h-full">
        Select a student to view assignment details.
      </div>
    );
  }

  const { title, submissionDate, imageUrl, description } =
    assignment.assignmentId || {};

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">
        {title || "Untitled Assignment"}
      </h2>
      <p className="text-gray-500 mb-4">
        Submission Date: {submissionDate || "N/A"}
      </p>
      <img
        src={imageUrl || "https://via.placeholder.com/600x200"}
        alt="Assignment"
        className="w-full h-64 object-cover mb-4"
      />
      <p className="text-gray-700">
        {description || "No description available."}
      </p>
    </div>
  );
};

export default AssignmentDetails;
