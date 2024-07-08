


//-----------------------------------------------


import React, { useState, useEffect } from "react";
import DateDetail from "../../../Component/DateDetail";
import AssignmentDetail from "../../../Component/AssignmentDetail";
import toast, { Toaster } from 'react-hot-toast';

const AssignmentDetailCard = ({ isSubmitted, assignmentData, submissionData }) => {
  const { points, allowNumberOfAttempts, submittingBy, dueDate } = assignmentData;
  const submittedAt = submissionData ? new Date(submissionData.submittedAt) : null;
  const [currentAttempt, setCurrentAttempt] = useState(submissionData ? submissionData.attempt : 0);

  return (
    <div className="max-w-sm p-4 bg-white shadow-md rounded-lg" aria-label="Assignment Card">
      <div
        className={`p-2 mb-4 text-center text-lg font-semibold rounded-md ${
          isSubmitted ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        <span>Submit Status: {isSubmitted ? "Submitted" : "Not submitted"}</span>
        {isSubmitted && (
          <div>
            <span>Submitted At: {submittedAt.toLocaleString()}</span>
          </div>
        )}
      </div>
      <span>Grade:</span>
      <DateDetail label="Due Date" value={dueDate} />
      <AssignmentDetail label="Assignment Point" value={`${points} Point`} />
      <AssignmentDetail label="Allowed Attempts" value={`${allowNumberOfAttempts.toString().padStart(2, '0')} Time`} />
      <AssignmentDetail label="Submitting By" value={submittingBy} />
    </div>
  );
};

export default AssignmentDetailCard;
