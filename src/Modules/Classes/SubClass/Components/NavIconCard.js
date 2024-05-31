import React from "react";

const NavIconCard = ({ icon, text }) => {
  return (
    <div className="flex flex-col items-center p-3 border rounded-lg w-64 h-28">
      <div className="text-[2rem] mb-2">{icon}</div>
      <div className="text-lg text-center">{text}</div>
    </div>
  );
};
export default NavIconCard;
