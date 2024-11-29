import React, { useState } from "react";
import SidebarSlide from "../../../../../../../Components/Common/SidebarSlide";
import CreateAssignmentHolder from "./CreateAssignmentHolder";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const AssignmentSection = ({ isSubmitted, onResubmit }) => {
  const { assignmentData, submissionData } = useSelector(
    (store) => store?.student?.studentAssignment
  );
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [attemptsExceeded, setAttemptsExceeded] = useState(false);

  const handleAssignment = () => {
    const currentAttempts = submissionData?.attempt || 0;
    if (
      assignmentData?.allowedAttempts &&
      currentAttempts >= assignmentData?.allowNumberOfAttempts
    ) {
      toast.error("Maximum number of attempts reached");
      setAttemptsExceeded(true);
    } else {
      setAttemptsExceeded(false);
      setSidebarOpen(true);
    }
  };

  const { name = "Assignment", content = "", dueDate } = assignmentData || {};

  // Get the current date (without time) to compare with dueDate
  const currentDate = new Date();

  // Check if dueDate is valid and not passed
  const isDueDateValid = dueDate && new Date(dueDate) > currentDate;

  // Only show the button if the assignment is within the available window and not expired
  const showAssignmentButton = isDueDateValid || isSubmitted;

  return (
    <div className="max-w-3xl mx-auto bg-white">
      <div className="flex items-center justify-between mb-2 border-b p-3">
        <div>
          <h2 className="text-xl capitalize font-semibold">{name}</h2>
          <p className="text-sm text-green-600 mt-1 font-semibold">
            Assignment
          </p>
        </div>

        {/* Conditionally render the button based on dueDate validity */}
        {showAssignmentButton && (
          <button
            onClick={handleAssignment}
            className="h-12 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
            disabled={attemptsExceeded}
          >
            {isSubmitted ? "Re-submit Assignment" : "Start Assignment"}
          </button>
        )}
      </div>

      <div
        className="text-gray-700 mb-6 p-3"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Sidebar for assignment creation */}
      <SidebarSlide
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Start Assignment"
        width="95%"
      >
        <CreateAssignmentHolder
          isSubmitted={isSubmitted}
          onClose={() => setSidebarOpen(false)}
        />
      </SidebarSlide>
    </div>
  );
};

export default AssignmentSection;
