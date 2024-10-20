import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";

const ModuleCard = ({ title, moduleNumber, imageUrl }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative mb-4 border-2 bg-white rounded-lg">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-36 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <div className="flex justify-between items-center mt-2">
          <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full py-1 px-4">
            Module {moduleNumber}
          </p>
        </div>
      </div>
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-12 right-4 bg-white border rounded-lg shadow-lg w-48 z-10"
        >
          <ul className="py-2">
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <FaEllipsisV className="mr-2" /> Menu Item
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
