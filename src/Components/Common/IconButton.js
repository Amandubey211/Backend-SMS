import React from "react";

const IconButton = ({ icon: Icon, label, onClick, className = "" }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`focus:outline-none focus:ring-2 focus:ring-purple-500 active:bg-purple-100 transition-all duration-200 ${className}`}
  >
    <Icon className="w-8 h-8 text-purple-500 p-1 border rounded-full" />
  </button>
);

export default IconButton;
