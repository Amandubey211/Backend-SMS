import React, { useState } from "react";
import SidebarSlide from "../../../../../../../Components/Common/SidebarSlide";
import CreateAssignmentHolder from "./CreateAssignmentHolder";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { stdDoAssignment } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Assignment/assignment.action";

const AssignmentSection = ({ isSubmitted, onResubmit }) => {
  const dispatch = useDispatch();
  const { assignmentData, submissionData } = useSelector(
    (store) => store?.student?.studentAssignment
  );
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [attemptsExceeded, setAttemptsExceeded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFormSubmit = async (
    submissionContent,
    submissionType,
    submissionComment
  ) => {
    try {
      setIsSubmitting(true); // Disable submit button while submitting
      const currentAttempts = submissionData?.attempt || 0;
      if (
        assignmentData?.allowedAttempts &&
        currentAttempts >= assignmentData?.allowNumberOfAttempts
      ) {
        toast.error("Maximum number of attempts reached");
        setIsSubmitting(false);
        setSidebarOpen(false);
        return;
      }

      await dispatch(
        stdDoAssignment({
          assignmentId: assignmentData?._id,
          editorContent: submissionContent,
          fileUrls: submissionType,
          isReattempt: isSubmitted,
        })
      );

      setIsSubmitting(false);
      setSidebarOpen(false);
      // onResubmit?.(submissionContent, submissionType, submissionComment); // Ensure callback is called if provided
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error?.message || "Error submitting assignment");
    }
  };

  const { name = "Assignment", content = "" } = assignmentData || {};

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-semibold">{name}</h2>
          <p className="text-sm text-green-600 mt-1 font-semibold">
            Assignment
          </p>
        </div>
        <button
          onClick={handleAssignment}
          className="h-12 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
          disabled={isSubmitting || attemptsExceeded}
        >
          {isSubmitted ? "Re-submit Assignment" : "Start Assignment"}
        </button>
      </div>

      <div
        className="text-gray-700 mb-6"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <SidebarSlide
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Start Assignment"
        width="80%"
      >
        <CreateAssignmentHolder
          onSubmit={handleFormSubmit}
          isReattempt={isSubmitted}
        />
      </SidebarSlide>
    </div>
  );
};

export default AssignmentSection;
