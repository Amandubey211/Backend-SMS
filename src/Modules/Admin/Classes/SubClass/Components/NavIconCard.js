import React from "react";
import { NavLink } from "react-router-dom";

const NavIconCard = ({ icon, text, url }) => {
  return (
    <NavLink
      to={url}
      className="flex flex-col w-[24%]  items-center p-3 border hover:bg-gray-50 rounded-lg  transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
    >
      <div className="text-4xl mb-2 p-2">{icon}</div>
      <div className="text-lg text-center">{text}</div>
    </NavLink>
  );
};

export default NavIconCard;
