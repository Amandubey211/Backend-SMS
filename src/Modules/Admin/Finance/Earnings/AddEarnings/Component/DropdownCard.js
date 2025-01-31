// src/Components/Admin/Finance/Earnings/Component/DropdownCard.jsx

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IoIosArrowForward } from "react-icons/io";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../config/permission";

const DropdownCard = ({
  label,
  name,
  id, // Added id prop
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  bgColor,
  borderColor,
  disabled = false, // Added default value for disabled
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
      {/* Label with id for ARIA */}
      <label id={`label-${id}`} className="text-sm text-gray-800 block mb-2">
        {label}
      </label>

      {/* Custom Dropdown */}
      <div
        className={`relative bg-white rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer shadow-lg ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={() => {
          if (!disabled) onToggle();
        }}
        onMouseEnter={() => {
          if (!disabled && !isOpen) onToggle();
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`label-${id}`}
        role="combobox"
        tabIndex={disabled ? -1 : 0} // Make focusable if not disabled
      >
        <span className="text-gray-800 font-medium">
          {value || `Select ${label}`}
        </span>
        <span className="border flex justify-center items-center rounded-full w-6 h-6">
          <IoIosArrowForward
            className={`text-lg transition-transform ${
              isOpen ? "rotate-90" : ""
            } text-purple-500`}
          />
        </span>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10"
          role="listbox"
          aria-labelledby={`label-${id}`}
        >
          {options?.map((item, index) => {
    const permissionKey = `ADD_NEW_${item?.slice(0,3)}_REVENUE`;
    return name === "category" && PERMISSIONS[permissionKey] ? (
      <ProtectedAction requiredPermission={PERMISSIONS[permissionKey]}>
        <li
          key={index}
          className={`px-3 py-2 hover:bg-pink-100 cursor-pointer text-sm ${
            item === value ? "bg-pink-200 font-bold text-gray-900" : ""
          }`}
          onClick={() => onSelect(item)}
          role="option"
          aria-selected={item === value}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onSelect(item);
            }
          }}
        >
          {item} - {permissionKey}
        </li>
      </ProtectedAction>
    ) : (
      <li
        key={index}
        className={`px-3 py-2 hover:bg-pink-100 cursor-pointer text-sm ${
          item === value ? "bg-pink-200 font-bold text-gray-900" : ""
        }`}
        onClick={() => onSelect(item)}
        role="option"
        aria-selected={item === value}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onSelect(item);
          }
        }}
      >
        {item}
      </li>
    );
  })}

        </motion.ul>
      )}
    </div>
  );
};

export default DropdownCard;
