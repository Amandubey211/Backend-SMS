import React from "react";
import "tailwindcss/tailwind.css";
import { FaUserEdit, FaTrash } from "react-icons/fa";

const TeacherCard = ({ name, role, phone, image }) => {
  return (
    <div className="relative w-64 h-70 rounded-md overflow-hidden shadow-lg border border-gray-200 p-4 m-4 flex flex-col items-center transform transition-transform duration-300 hover:scale-105 group">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col space-y-2">
        <button className="bg-white rounded-full p-2 shadow-lg">
          <FaUserEdit className="text-green-500 w-4 h-4" />
        </button>
        <button className="bg-white rounded-full p-2 shadow-lg">
          <FaTrash className="text-red-500 w-4 h-4" />
        </button>
      </div>
      <div className="flex justify-center">
        <img className="w-24 h-24 rounded-full" src={image} alt={name} />
      </div>
      <div className="text-center mt-4">
        <div className="font-bold text-xl mb-1">{name}</div>
        <p className="text-gray-700 text-sm">{role}</p>
      </div>
      <div className="text-center mt-4 border-t pt-2 w-full">
        <p className="text-gray-500 text-xs uppercase">Phone</p>
        <p className="text-gray-700 text-base">{phone}</p>
      </div>
    </div>
  );
};

export default TeacherCard;
