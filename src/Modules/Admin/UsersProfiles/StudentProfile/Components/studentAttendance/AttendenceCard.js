import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";

const AttendenceCard = ({ icon, label, value, buttonLabel, onButtonClick }) => {
  return (
    <div className="flex flex-1 gap-2 items-center px-3 py-5 border border-gray-300 rounded-lg  ">
      <div className=" flex items-center justify-center p-1.5 rounded-full">
        {icon}
      </div>
      <div className="flex flex-col items-center text-center text-xs"> 
        <span className="font-xs  font-semibold">{label}</span>
        <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
          {value}
        </span>
      </div>
      {buttonLabel != null ?<button className="flex  items-center border justify-center px-3 py-1 bg-pink-100 rounded-full" onClick={onButtonClick}>
        <span className="text-pink-800">{buttonLabel}</span>
      </button>:null}
    </div>
  );
};

export default AttendenceCard;
