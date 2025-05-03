import React from "react";

const TabButton = ({ isActive, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={` inline-flex items-center py-2 px-6  text-lg border border-gray-300  font-medium rounded-md  text-black ${
        isActive
          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600"
          : "bg-white text-gray-500"
      }`}
    >
      {children}
    </button>
  );
};

export default TabButton;