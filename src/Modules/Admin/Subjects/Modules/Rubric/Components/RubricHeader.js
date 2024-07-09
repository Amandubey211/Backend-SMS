import React from "react";
import { HiOutlinePlus } from "react-icons/hi2";

const RubricHeader = ({ onAddRubric }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-lg font-semibold">Rubrics</h1>
      <button 
        onClick={onAddRubric}
        className="flex items-center gap-2 font-semibold p-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-100 hover:shadow-md transition-shadow duration-300">
        <HiOutlinePlus className="text-red-600 text-2xl"  />
        <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">Add New Rubric</span>
      </button>
    </div>
  );
};

export default RubricHeader;
