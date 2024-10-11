// src/components/Components/RatingCard.js

import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";

const RatingCard = ({ rating, onDeleteRating, onEditRating, readonly }) => {
  return (
    <div className="relative flex flex-col border w-44 h-40 p-2 rounded-sm shadow-sm">
      {!readonly && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button className="text-red-600" onClick={onDeleteRating}>
            <RiDeleteBin5Line />
          </button>
          <button className="text-green-600" onClick={onEditRating}>
            <TbEdit />
          </button>
        </div>
      )}
      <div className="flex flex-col items-start p-1 pt-8">
        <p className="font-medium text-gray-700">{rating.ratingTitle}</p>
        <p className="text-sm font-bold pb-2 text-purple-600">
          {rating.ratingScore}
        </p>
        <hr className="w-full" />
        <p className="text-xs p-2 text-gray-500">{rating.ratingDescription}</p>
      </div>
    </div>
  );
};

export default RatingCard;
