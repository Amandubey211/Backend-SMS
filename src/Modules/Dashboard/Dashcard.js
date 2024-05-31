import React from "react";
import { NavLink } from "react-router-dom";

const DashCard = ({
  label,
  value,
  bgColor,
  textColor,
  icon,
  iconBackground,
  url,
}) => {
  return (
    <NavLink
      to={url}
      className={`p-3 px-6 w-[20%] rounded-lg shadow-md ${bgColor} hover:shadow-lg transition-shadow duration-200`}
    >
      <div className="flex gap-4 items-center">
        <div
          className={`p-3 ${iconBackground} bg-opacity-55 rounded-full shadow-2xl text-2xl`}
        >
          {icon}
        </div>
        <div>
          <div className="text-xl font-semibold">{value}</div>
          <div className={`mt-2 ${textColor}`}>{label}</div>
        </div>
      </div>
    </NavLink>
  );
};

export default DashCard;
