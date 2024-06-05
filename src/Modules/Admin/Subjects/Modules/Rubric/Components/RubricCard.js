import React from 'react';
import { RiDeleteBin5Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";

const RubricCard = ({ title, criteria, points }) => {
  return (
    <div className="bg-gradient-to-r from-pink-100 to-purple-100 border rounded-lg shadow-sm relative flex flex-col justify-between">
      <div className="flex py-10 px-3 justify-center items-center">
        <h2 className="text-lg font-semibold text-purple-600">{title}</h2>
      </div>
      <div className="absolute top-3 right-3 flex space-x-2 text-xl">
        <button className="text-red-600"><RiDeleteBin5Line /></button>
        <button className="text-green-600"><TbEdit /></button>
      </div>
      <div className="flex justify-center border-b gap-2 p-2 bg-white rounded-b-lg text-gray-700">
        <div className="text-center p-2">
          <p className="text-sm">Criteria</p>
          <p className="text-lg font-bold">{criteria.toString().padStart(2, '0')}</p>
        </div>
        <div className="border border-gray-500 opacity-60"></div>
        <div className="text-center p-2">
          <p className="text-sm">Points</p>
          <p className="text-lg font-bold">{points}</p>
        </div>
      </div>
    </div>
  );
}

export default RubricCard;
