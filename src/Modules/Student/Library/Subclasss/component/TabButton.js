import React from "react";

const TabButton = ({ isActive, onClick, children, ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      className={`h-12 px-12 inline-flex items-center justify-center border text-sm font-medium rounded-md shadow-sm transition-colors duration-300 ${
        isActive
          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
          : "bg-white border-gray-300 text-black"
      }`}
      aria-pressed={isActive}
      aria-label={ariaLabel}
      role="tab"
    >
      {children}
    </button>
  );
};

export default TabButton;
