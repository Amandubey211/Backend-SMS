import React from "react";
import { NavLink } from "react-router-dom";

const NavIconCard = ({ icon, text, url, loading, onClick,  error,classData }) => {
  return (
    <div onClick={onClick} 
    className="flex flex-col w-[24%] items-center p-3 border hover:bg-gray-100 rounded-lg  transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
    
    >
      <NavLink
        to={classData && !loading && !error && url}
      >
        <div className="text-4xl mb-2 p-2">{icon}</div>
        <div className="text-lg text-center">{text}</div>
      </NavLink>
    </div>
  );
};

export default NavIconCard;
