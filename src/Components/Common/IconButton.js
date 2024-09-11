import React from "react";

const IconButton = ({ icon: Icon, label, onClick }) => (
  <button onClick={onClick} aria-label={label}>
    <Icon className="w-8 h-8 text-purple-500 p-1 border rounded-full" />
  </button>
);

export default IconButton;
