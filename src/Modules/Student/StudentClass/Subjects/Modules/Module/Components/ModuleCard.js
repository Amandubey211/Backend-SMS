import React, { useState, useRef, useEffect } from "react";
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
} from "react-icons/fa";
import { TbProgress } from "react-icons/tb";
const ModuleCard = ({ title, moduleNumber, imageUrl, isCompleted }) => {
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
    <div className="relative mb-4 border-2 border-rose-400  bg-white rounded-lg ">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-36 object-cover rounded-t-lg"
      />
      <div className="p-4 " >
        <h2 className="font-semibold text-lg">{title}</h2>
        <div className="flex justify-between items-center mt-2">
          <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full py-1 px-4">
            {" "}
            <span className="text-gradient"> Module {moduleNumber}</span>{" "}
          </p>

{/* Here it will be progress bar */}
<TbProgress size={40}/>
         
        </div>
      </div>
      
    </div>
  );
};

export default ModuleCard;
