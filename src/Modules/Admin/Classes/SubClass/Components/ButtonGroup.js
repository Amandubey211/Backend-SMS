import React from "react";

const ButtonGroup = ({ onAddNewSubject, selectedTab, setSelectedTab }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded-md ${
            selectedTab === "Published"
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              : "border border-gray-300 text-gray-600"
          }`}
          onClick={() => setSelectedTab("Published")}
        >
          Published
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            selectedTab === "Draft"
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              : "border border-gray-300 text-gray-600"
          }`}
          onClick={() => setSelectedTab("Draft")}
        >
          Draft
        </button>
      </div>
      <button
        onClick={onAddNewSubject}
        className="flex items-center border border-gray-300 ps-5  py-0 rounded-full"
      >
        <span className="mr-2">Add New Subject</span>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
          <span className="text-3xl -mt-2">+</span>
        </div>
      </button>
    </div>
  );
};

export default ButtonGroup;
