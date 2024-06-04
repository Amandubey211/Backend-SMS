import React from "react";

const AttendanceNavCard = ({
  label,
  value,
  bgColor,
  textColor,
  icon,
  iconBackground,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-3 px-5 w-[35%] rounded-lg shadow-md ${bgColor} hover:shadow-lg transition-shadow duration-200 cursor-pointer`}
    >
      <div className="flex gap-4 items-center">
        <div
          className={`p-3 bg-white bg-opacity-55 rounded-full shadow-2xl text-2xl`}
        >
          {icon}
        </div>
        <div>
          <div className="text-xl font-semibold">{value}</div>
          <div className={`mt-2 text-sm ${textColor}`}>{label}</div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceNavCard;
