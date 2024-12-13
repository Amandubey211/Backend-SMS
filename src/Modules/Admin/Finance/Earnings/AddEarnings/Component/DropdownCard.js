import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IoIosArrowForward } from "react-icons/io";

const DropdownCard = ({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  bgColor,
  borderColor,
}) => {
  const dropdownRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        onToggle(); // Close the dropdown if clicked outside
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onToggle]);

  return (
    <div
      className={`relative w-full ${bgColor} border ${borderColor} rounded-lg px-4 pt-2`}
      ref={dropdownRef}
    >
      <label className="text-sm text-gray-800 block mb-2">{label}</label>
      <div
        className="bg-white rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer shadow-lg"
        onClick={onToggle}
      >
        <span className="text-gray-800 font-medium">{value}</span>
        <span className="border flex justify-center items-center rounded-full w-6 h-6">
          <IoIosArrowForward className="text-purple-500 text-lg" />
        </span>
      </div>
      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10"
        >
          {options.map((item, index) => (
            <li
              key={index}
              className="px-3 py-1 hover:bg-pink-100 cursor-pointer text-gray-800 text-sm"
              onClick={() => onSelect(item)}
            >
              {item}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default DropdownCard;
