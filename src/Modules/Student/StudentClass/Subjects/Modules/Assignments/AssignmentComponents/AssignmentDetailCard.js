import React, { useState } from "react";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import { FiCalendar } from "react-icons/fi";
import { useSelector } from "react-redux";

const AssignmentDetailCard = ({ isSubmitted }) => {
  const { assignmentData, submissionData } = useSelector(
    (store) => store?.student?.studentAssignment
  );

  const points = assignmentData?.points || "N/A";
  const allowNumberOfAttempts =
    assignmentData?.allowedAttempts && assignmentData?.allowNumberOfAttempts
      ? assignmentData.allowNumberOfAttempts
      : "Unlimited";

  const dueDate =
    new Date(assignmentData?.dueDate).toLocaleDateString() || "N/A";
  const submittingBy = assignmentData?.submittingBy || "Everyone";

  const submittedAt = submissionData?.submittedAt
    ? new Date(submissionData.submittedAt)
    : null;
  const [currentAttempt, setCurrentAttempt] = useState(
    submissionData?.attempt || 0
  );

  const formattedDate = submittedAt
    ? `${submittedAt.toLocaleDateString()} (${submittedAt.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      )})`
    : "N/A";

  return (
    <div className="max-w-sm p-6 bg-white " aria-label="Assignment Card">
      <h3 className="mb-4 text-lg font-semibold text-gray-700">
        {isSubmitted ? "Submission Details" : "Assignment Details"}
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

      <AssignmentDetail label="Assignment Points" value={points.toString()} />
      <AssignmentDetail
        label="Current Attempt"
        value={currentAttempt?.toString().padStart(2, "0")}
        extra="Times"
      />
      <AssignmentDetail
        label="Allowed Attempts"
        value={allowNumberOfAttempts.toString().padStart(2, "0")}
        extra="Times"
      />
      <AssignmentDetail label="Due Date" value={dueDate} />
      <AssignmentDetail label="Submitted By" value={submittingBy} />
    </div>
  );
};

export default AssignmentDetailCard;
