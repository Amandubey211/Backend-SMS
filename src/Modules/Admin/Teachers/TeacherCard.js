import React from "react";
import { TbUserEdit } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const TeacherCard = ({ name, role, phone, image }) => {
  return (
    <div className="relative w-64 h-70 rounded-md overflow-hidden hover:shadow-lg border border-gray-200 p-4 m-4 flex flex-col items-center transform transition-transform duration-300 hover:scale-105 group">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col space-y-2">
        <button
          className="bg-white rounded-full p-2 border"
          onClick={() => toast.success("Edit")}
        >
          <TbUserEdit className="text-green-500 w-4 h-4" />
        </button>
        <button
          className="bg-white rounded-full p-2 border"
          onClick={() => toast.success("Delete")}
        >
          <RiDeleteBinLine className="text-red-500 w-4 h-4" />
        </button>
      </div>
      <div className="flex justify-center">
        <img
          className="w-24 h-24 rounded-full"
          src={image || "https://avatars.githubusercontent.com/u/109097090?v=4"}
          alt={`${name}`}
        />
      </div>
      <div className="text-center mt-4">
        <div className="font-bold text-xl mb-1">{name}</div>
        <p className="text-gray-700 text-sm">{role}</p>
      </div>
      <div className="text-center mt-4 border-t pt-2 w-full">
        <p className="text-gray-500 text-xs uppercase">Phone</p>
        <p className="text-gray-700 text-base font-semibold">{phone}</p>
      </div>
    </div>
  );
};

TeacherCard.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default TeacherCard;
