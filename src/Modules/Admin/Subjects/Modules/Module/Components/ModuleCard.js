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
import useDeleteModule from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useDeleteModule";
import toast from "react-hot-toast";
import DeleteModal from "../../../../../../Components/Common/DeleteModal";
import { BsPatchCheckFill } from "react-icons/bs";
import { MdOutlineBlock } from "react-icons/md";

const ModuleCard = ({
  title,
  moduleNumber,
  imageUrl,
  isPublished,
  isSelected,
  onSelect,
  onEdit,
  onMove, // Function to open the MoveModule sidebar
  onDelete,
  moduleId,
  fetchModules,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const menuRef = useRef();
  const { loading, deleteModule } = useDeleteModule();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  const handleDelete = async () => {
    await deleteModule(moduleId);
    onDelete();
    setIsDeleteModalOpen(false); // Close the modal on successful deletion
    fetchModules(); // Refetch modules after deletion
  };

  const handleMove = (e) => {
    e.stopPropagation();
    onMove(); // Open the MoveModule sidebar
    setMenuOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`relative mb-4 border ${
        isSelected ? "border-2 border-rose-400" : ""
      } bg-white rounded-lg cursor-pointer`}
      onClick={onSelect}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-36 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <div className="flex justify-between items-center mt-2">
          <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full py-1 px-4">
            <span className="text-gradient">Module {moduleNumber}</span>
          </p>

          <div className="flex items-center space-x-2">
            {isPublished ? (
              <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-8 w-8" />
            ) : (
              <MdOutlineBlock className="text-gray-600  p-1 border rounded-full h-7 w-7" />
            )}
            <button
              className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
              onClick={toggleMenu}
            >
              <FaEllipsisV />
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-0 right-12 bg-white border rounded-lg shadow-lg w-48 z-10"
        >
          <ul className="py-2">
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
                setMenuOpen(false);
              }}
            >
              <FaPen className="mr-2" /> Edit
            </li>
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={handleMove} // Call the move handler which opens the sidebar
            >
              <FaArrowRight className="mr-2" /> Move to...
            </li>
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toast.success("Duplicated");
                setMenuOpen(false);
              }}
            >
              <FaCopy className="mr-2" /> Duplicate
            </li>
            {/* <li
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toast.success("Increased indent");
                setMenuOpen(false);
              }}
            >
              <FaIndent className="mr-2" /> Increase indent
            </li> */}
            {/* <li
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toast.success("Shared to Commons");
                setMenuOpen(false);
              }}
            >
              <FaShareAlt className="mr-2" /> Share to Commons
            </li> */}
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true); // Show delete confirmation modal
                setMenuOpen(false);
              }}
            >
              <FaTrashAlt className="mr-2" /> Remove
            </li>
          </ul>
        </div>
      )}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={title}
      />
    </div>
  );
};

export default ModuleCard;
