import React from "react";
import { MdAccessTime } from "react-icons/md";

const StudentDashFeeCard = ({ title, amount, unpaidFees, buttonText }) => {
  console.log("Rendering StudentDashFeeCard with props:", {
    title,
    amount,
    unpaidFees,
    buttonText,
  });

  return (
    <div className="py-4 flex flex-1 flex-col justify-around items-center gap-5">
      <div className="border border-black flex items-center justify-center p-1.5 rounded-full">
        <MdAccessTime className="text-2xl text-red-400" />
      </div>
      <span className="text-xl">{title}</span>
      <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
        {amount} QR
      </span>

      {buttonText && unpaidFees > 0 && (
        <button
          // className="flex items-center border border-blue-800 w-[50%] justify-center px-5 rounded-full mt-2"
          className=" w-[50%]  mt-2 items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-white py-1 px-3 rounded-full"
        >
          <span className="text-sm text-gradient font-medium">
            {buttonText}
          </span>
        </button>
      )}
    </div>
  );
};

export default StudentDashFeeCard;
