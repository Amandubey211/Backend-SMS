import React from "react";

const AssignmentDetails = ({ student, assignment }) => {
  if (!student || !assignment) {
    return null; // Empty return if no student or assignment is selected
  }

  const { content, studentPoints } = assignment;
  const { name, points, dueDate } = assignment.assignmentId || {};

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <div>
          <h2 className="text-xl font-medium mb-1 capitalize">
            {name || "Untitled Assignment"}
          </h2>
          <p className="text-gray-500">
            Submission Date:{" "}
            {dueDate ? new Date(dueDate).toLocaleDateString() : "N/A"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 mb-1">Assignment Point</p>
          <p className="text-green-500 font-bold text-md">
            {studentPoints || 0}/{points}
          </p>
        </div>
      </div>
      <div className="text-gray-700 mb-4">
        {content || "No content available."}
      </div>
    </div>
  );
};

export default AssignmentDetails;
