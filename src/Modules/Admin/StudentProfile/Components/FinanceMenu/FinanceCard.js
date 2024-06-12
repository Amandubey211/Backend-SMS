import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";

const FinanceCard = ({ icon, label, value, buttonLabel, onButtonClick }) => {
  return (
    <div className="flex flex-1 justify-between items-center px-3 py-5 border border-gray-300 rounded-lg ">
      <div className="border border-black flex items-center justify-center p-1.5 rounded-full">
        {icon}
      </div>
      <div className="flex flex-col items-center text-center text-xs">
        <span className="font-xs">{label}</span>
        <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
          {value} QR
        </span>
      </div>
      <button className="flex items-center border justify-center px-3 py-1 bg-pink-100 rounded-full" onClick={onButtonClick}>
        <span className="text-pink-800">{buttonLabel}</span>
      </button>
    </div>
  );
};

export default FinanceCard;
