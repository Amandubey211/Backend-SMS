// src/components/Components/RubricCard.js

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

const RubricCard = ({
  rubricId,
  title,
  criteria,
  points,
  onDelete,
  onEdit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bgColor = getRandomColor();

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(rubricId);
    setIsModalOpen(false);
  };

  return (
    <div style={{ backgroundColor: bgColor }} className="ps-1 rounded-md">
      <div className="border rounded-md shadow-sm relative flex bg-white justify-between p-4">
        <div className="flex flex-col items-start justify-start">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold">{title}</h2>
          </div>
          <div className="flex gap-4 items-center mt-2 text-gray-700">
            <div className="flex items-center">
              <p className="text-sm mr-1">Criteria :</p>
              <p className="text-base font-bold">
                {criteria.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-sm mr-1">Points :</p>
              <p className="text-base font-bold">{points}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-xl">
          <button className="text-red-600" onClick={handleDeleteClick}>
            <RiDeleteBin2Line />
          </button>
          <button className="text-green-600" onClick={() => onEdit(rubricId)}>
            <MdOutlineModeEditOutline />
          </button>
        </div>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={title}
      />
    </div>
  );
};

export default RubricCard;
