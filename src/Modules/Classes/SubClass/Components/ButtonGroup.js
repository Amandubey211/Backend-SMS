// src/components/ButtonGroup.js
import React from "react";

const ButtonGroup = ({ onAddNewSubject }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex space-x-4">
        <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-md">
          Publish
        </button>
        <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md">
          Draft
        </button>
      </div>
      <button
        onClick={onAddNewSubject}
        className="flex items-center border border-gray-300 ps-5  pe-2 py-1 rounded-full"
      >
        <span className="mr-2">Add New Subject</span>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
          <span className="text-3xl -mt-2">+</span>
        </div>
      </button>
    </div>
  );
};

export default ButtonGroup;
