// src/components/Components/RatingCard.js

import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";

const RatingCard = ({ rating, onDeleteRating, onEditRating, readonly }) => {
  return (
    <div className="border rounded-md p-2 w-44 h-40 flex flex-col justify-between">
      <div>
        <h4 className="font-bold">{rating.ratingTitle}</h4>
        <p className="text-sm">{rating.ratingDescription}</p>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-bold">{rating.ratingScore}</span>
        {!readonly && (
          <div className="flex gap-2">
            <button className="text-red-600" onClick={onDeleteRating}>
              <RiDeleteBin5Line />
            </button>
            <button className="text-green-600" onClick={onEditRating}>
              <TbEdit />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingCard;
