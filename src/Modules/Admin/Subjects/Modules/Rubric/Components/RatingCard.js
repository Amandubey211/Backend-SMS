// src/components/Components/RatingCard.js

import React, { useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { AiOutlineEye } from "react-icons/ai"; // NEW IMPORT

const RatingCard = ({ rating, onDeleteRating, onEditRating, readonly }) => {
  // Local state to handle the description modal
  const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);

  // Truncate rating description
  const truncateText = (text = "", limit = 80) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const truncatedDescription = truncateText(
    rating?.ratingDescription ?? "",
    80
  );

  const handleViewDescription = () => setDescriptionModalOpen(true);
  const closeDescriptionModal = () => setDescriptionModalOpen(false);

  return (
    <div className="border rounded-md p-2 w-44 h-40 flex flex-col justify-between">
      <div>
        <h4 className="font-bold">{rating?.ratingTitle ?? ""}</h4>
        <p className="text-sm">{truncatedDescription}</p>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-bold">{rating?.ratingScore ?? 0}</span>
        <div className="flex gap-2">
          {/* Eye button to view full description */}
          <button className="text-blue-600" onClick={handleViewDescription}>
            <AiOutlineEye />
          </button>
          {/* Delete & Edit if not read-only */}
          {!readonly && (
            <>
              <button className="text-red-600" onClick={onDeleteRating}>
                <RiDeleteBin5Line />
              </button>
              <button className="text-green-600" onClick={onEditRating}>
                <TbEdit />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Full Description Modal */}
      {isDescriptionModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-xl w-full">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Full Description</h2>
              <button
                onClick={closeDescriptionModal}
                className="text-gray-600 text-xl"
              >
                &times;
              </button>
            </div>
            <div className="text-gray-800">
              {rating?.ratingDescription ?? ""}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeDescriptionModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingCard;
