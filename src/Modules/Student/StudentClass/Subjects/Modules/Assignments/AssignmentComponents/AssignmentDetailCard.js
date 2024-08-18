import React, { useState } from "react";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import { FiCalendar } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import CommentSection from "../../../../../StudentClass/Subjects/Component/CommentSection";

const AssignmentDetailCard = ({
  isSubmitted,
  assignmentData,
  submissionData,
}) => {
  // Use optional chaining to safely access properties
  const points = assignmentData?.points ?? "N/A";
  // const allowNumberOfAttempts = assignmentData?.allowedAttempts ? assignmentData.allowNumberOfAttempts : 'N/A';
  const allowNumberOfAttempts =
    assignmentData?.allowedAttempts !== false &&
    assignmentData?.allowNumberOfAttempts
      ? assignmentData.allowNumberOfAttempts
      : "N/A";

  const dueDate = assignmentData?.dueDate ?? "N/A";
  const submittingBy = assignmentData?.submittingBy ?? "N/A";

  const submittedAt = submissionData
    ? new Date(submissionData.submittedAt)
    : null;
  const [currentAttempt, setCurrentAttempt] = useState(
    submissionData ? submissionData.attempt : 0
  );

  const formattedDate = submittedAt
    ? `${submittedAt.toLocaleDateString()} (${submittedAt.toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit", hour12: true }
      )})`
    : "";

  return (
    <div
      className="max-w-sm p-6 bg-white shadow-md rounded-lg"
      aria-label="Assignment Card"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-700">
        Submission Details
      </h3>
      {isSubmitted && (
        <div className="border p-4 mb-4 rounded-md">
          <p className="flex items-center text-sm mb-2">
            <span className="font-medium text-gray-600">
              Submitted Assignment
            </span>
          </p>
          <p className="flex items-center text-sm text-gray-900">
            <FiCalendar className="mr-2 text-lg" />
            <span className="font-medium text-gray-900">{formattedDate}</span>
          </p>
        </div>
      )}
      <AssignmentDetail label="Assignment Point" value={points.toString()} />
      <AssignmentDetail
        label="Attempt"
        value={`${currentAttempt.toString().padStart(2, "0")}`}
        extra="Time"
      />
      <AssignmentDetail
        label="Allowed Attempt"
        value={`${allowNumberOfAttempts.toString().padStart(2, "0")}`}
        extra="Time"
      />
      {/* <CommentSection /> */}
    </div>
  );
};

export default AssignmentDetailCard;
