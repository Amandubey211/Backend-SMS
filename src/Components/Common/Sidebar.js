// src/components/Sidebar.js
import React from "react";
import { RxCross2 } from "react-icons/rx";

const Sidebar = ({ isOpen, title, onClose, children, footer }) => {
  return (
    <div
      className={`fixed  z-30 top-0 right-0 w-1/3 h-full py-3 px-4 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform`}
    >
      <div className="flex justify-between items-center px-2">
        <h1 className="font-semibold">{title || "Please give title"}</h1>
        <button onClick={onClose} className="p-1 m-1 opacity-70">
          <RxCross2 className="text-xl" />
        </button>
      </div>

      {children}
    </div>
  );
};

export default Sidebar;
