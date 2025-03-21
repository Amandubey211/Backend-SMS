import React from "react";
import { NavLink } from "react-router-dom";

const NavIconCard = ({
  icon,
  text,
  url,
  loading,
  onClick,
  error,
  classData,
}) => {
  return (
    <div
      onClick={onClick}
      className="
        w-[24%] h-36 
        flex items-center justify-center 
        border rounded-lg 
        transform transition duration-300 ease-in-out 
        hover:scale-105 hover:shadow-lg hover:bg-gray-100
        cursor-pointer
      "
    >
      <NavLink
        to={classData && !loading && !error && url}
        className="flex flex-col items-center justify-center text-center w-full h-full"
      >
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-lg">{text}</div>
      </NavLink>
    </div>
  );
};

export default NavIconCard;
