import React, { useState } from "react";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import DeleteModal from "../../../../../../Components/Common/DeleteModal";

const colors = [
  "#efc42f",
  "#ee69b6",
  "#0066ad",
  "#b2cd09",
  "#5ac67c",
  "#e040ff",
  "#fd8263",
  "#5b9ef2",
  "#9966f6",
  "#5ac67c",
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const RubricCard = ({ rubric, onDelete, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bgColor = getRandomColor();

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(rubric._id);
    setIsModalOpen(false);
  };

  // Determine the type of the rubric
  const rubricType = rubric.assignmentId
    ? "Assignment"
    : rubric.quizId
    ? "Quiz"
    : "General";

  return (
    <div style={{ backgroundColor: bgColor }} className="ps-1 rounded-md">
      <div className="border rounded-md shadow-sm relative flex bg-white justify-between p-4">
        <div className="flex flex-col items-start justify-start">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold">{rubric.name}</h2>
            {/* Display the badge */}
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
                {rubric.criteria.length.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-sm mr-1">Points :</p>
              <p className="text-base font-bold">{rubric.totalScore}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-xl">
          <button className="text-red-600" onClick={handleDeleteClick}>
            <RiDeleteBin2Line />
          </button>
          <button className="text-green-600" onClick={() => onEdit(rubric._id)}>
            <MdOutlineModeEditOutline />
          </button>
        </div>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={rubric.name}
      />
    </div>
  );
};

export default RubricCard;
