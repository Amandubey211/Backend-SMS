import React from "react";

const AttendanceNavCard = ({
  label,
  value,
  bgColor,
  textColor,
  icon,
  iconBackground,
  onClick,
  // New props for custom dimension
  cardWidth = "w-full", // Tailwind width classes, e.g. 'w-1/2', 'w-64', etc.
  cardHeight = "h-auto", // Tailwind height classes, e.g. 'h-32', 'h-48', etc.
}) => {
  return (
    <div
      onClick={onClick}
      className={`${cardWidth} ${cardHeight} p-3 px-5 rounded-lg shadow-md 
                  ${bgColor} hover:shadow-lg transition-shadow duration-200 
                  cursor-pointer flex items-center gap-4`}
    >
      <div
        className={`p-3 ${iconBackground} rounded-full shadow-2xl text-2xl flex justify-center items-center`}
      >
        {icon}
      </div>
      <div>
        <div className="text-xl font-semibold">{value}</div>
        <div className={`mt-2 text-sm ${textColor}`}>{label}</div>
      </div>
    </div>
  );
};

export default AttendanceNavCard;
