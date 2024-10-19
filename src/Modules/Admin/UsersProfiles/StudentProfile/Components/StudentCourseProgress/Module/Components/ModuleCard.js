import React, { useState, useRef, useEffect } from 'react';
import {
  FaEllipsisV,
  FaCheckCircle,
  FaBan,
  FaPen,
  FaCopy,
  FaArrowRight,
  FaIndent,
  FaShareAlt,
  FaTrashAlt,
} from 'react-icons/fa';

const ModuleCard = ({ title = "Untitled Module", moduleNumber = "N/A", imageUrl, isCompleted = false }) => {
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative mb-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Module Thumbnail */}
      <img
        src={imageUrl || "https://via.placeholder.com/150"} // Fallback image if imageUrl is missing
        alt={title}
        className="w-full h-36 object-cover rounded-t-lg"
      />

      {/* Module Info */}
      <div className="p-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <div className="flex justify-between items-center mt-2">
          <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full py-1 px-4">
            Module {moduleNumber}
          </p>

          <div className="flex items-center space-x-2">
            {isCompleted ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaBan className="text-gray-500" />
            )}

            {/* Dropdown Button */}
            <button
              className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
              onClick={toggleMenu}
              aria-label="More options"
            >
              <FaEllipsisV />
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div ref={menuRef} className="absolute top-12 right-4 bg-white border rounded-lg shadow-lg w-48 z-10">
          <ul className="py-2">
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <FaPen className="mr-2" /> Edit
            </li>
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <FaCopy className="mr-2" /> Duplicate
            </li>
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <FaArrowRight className="mr-2" /> Move to...
            </li>
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <FaIndent className="mr-2" /> Increase indent
            </li>
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <FaShareAlt className="mr-2" /> Share to Commons
            </li>
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <FaTrashAlt className="mr-2" /> Remove
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
