import React from "react";
import { Tooltip } from "antd";
import { AiOutlineEye } from "react-icons/ai";

const RubricCard = ({ rubric, onView }) => {
  // Helper function to truncate text and append ellipsis
  const truncateText = (text, maxLength = 20) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  // NEW: handle view in read-only mode
  const handleViewClick = () => {
    const { id } = getAssociatedId();
    onView(id);
  };

  // Return the associated assignment/quiz ID or fallback to the rubric's own ID
  const getAssociatedId = () => {
    if (rubric.assignmentId && rubric.assignmentId._id) {
      return { id: rubric.assignmentId._id };
    } else if (rubric.quizId && rubric.quizId._id) {
      return { id: rubric.quizId._id };
    } else {
      return { id: rubric._id };
    }
  };

  // Determine the rubric type for display
  const rubricType = rubric.assignmentId
    ? "Assignment"
    : rubric.quizId
    ? "Quiz"
    : "General";

  return (
    <div className="ps-1 rounded-md">
      <div className="border rounded-md shadow-sm relative flex bg-white justify-between p-4">
        <div className="flex flex-col items-start justify-start">
          <div className="flex justify-between items-center">
            <Tooltip title={rubric.name}>
              <h2 className="text-base font-semibold">
                {truncateText(rubric.name, 20)}
              </h2>
            </Tooltip>
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                rubricType === "Assignment"
                  ? "bg-blue-100 text-blue-800"
                  : rubricType === "Quiz"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {rubricType}
            </span>
          </div>
          <div className="flex gap-4 items-center mt-2 text-gray-700">
            <div className="flex items-center">
              <p className="text-sm mr-1">Criteria :</p>
              <p className="text-base font-bold">
                {rubric.criteria?.length.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-sm mr-1">Points :</p>
              <p className="text-base font-bold">{rubric.totalScore}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-xl">
          {/* Eye icon for view-only mode */}
          <button className="text-blue-600" onClick={handleViewClick}>
            <AiOutlineEye />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RubricCard;
