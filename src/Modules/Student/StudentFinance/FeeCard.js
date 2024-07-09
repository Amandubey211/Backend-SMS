import React from "react";
import { MdAccessTime } from "react-icons/md";

const FeeCard = ({ title, amount, buttonText, buttonAction }) => {
  return (
    <div className="px-7 py-2 flex flex-1 flex-col justify-around items-center gap-3 border border-gray-300 rounded-lg">
      <div className="border border-black flex items-center justify-center p-1.5 rounded-full">
        <MdAccessTime className="text-2xl text-red-400" />
      </div>
      <span className="text-sm">{title}</span>
      <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
        {amount} QR
      </span>
      {buttonText && (
        <button
          onClick={buttonAction}
          className="flex items-center border border-blue-800 w-full justify-center px-5 rounded-full"
        >
          <span className="text-blue-800">{buttonText}</span>
        </button>
      )}
    </div>
  );
};

export default FeeCard;
