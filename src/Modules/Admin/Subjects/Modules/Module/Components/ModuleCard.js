import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisV, FaPen, FaArrowRight, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { BsPatchCheckFill } from "react-icons/bs";
import { MdOutlineBlock } from "react-icons/md";
import { deleteModule } from "../../../../../../Store/Slices/Admin/Class/Module/moduleThunk";
import DeleteModal from "../../../../../../Components/Common/DeleteModal";
import { useParams } from "react-router-dom";

const ModuleCard = ({ module, onSelect, onEdit, onMove }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const menuRef = useRef();
  const dispatch = useDispatch();
  const { sid } = useParams();

  // Access selected module from the Redux store
  const { selectedModule } = useSelector((state) => state.admin.module);

  // Check if this module is the selected one
  const isSelected = selectedModule && selectedModule.moduleId === module._id;

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
    try {
      await dispatch(deleteModule({ sid, moduleId: module._id }));
      setIsDeleteModalOpen(false); // Close modal after deletion is successful
    } catch (error) {
      // Handle error (optional)
      console.error("Failed to delete module:", error);
    }
  };

  const handleMove = (e) => {
    e.stopPropagation();
    onMove();
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
      key={module._id}
      className={`relative mb-4 border ${
        isSelected ? "border-2 border-rose-400" : "border-gray-200"
      } bg-white rounded-lg cursor-pointer`}
      onClick={onSelect}
    >
      <img
        src={module.thumbnail}
        alt={module.moduleName}
        className="w-full h-36 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h2 className="font-semibold text-lg">{module.moduleName}</h2>
        <div className="flex justify-between items-center mt-2">
          <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full py-1 px-4">
            Module {module.moduleNumber}
          </p>

          <div className="flex items-center space-x-2">
            {!module?.isPublished ? (
              <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-8 w-8" />
            ) : (
              <MdOutlineBlock className="text-gray-600 p-1 border rounded-full h-7 w-7" />
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
              onClick={handleMove}
            >
              <FaArrowRight className="mr-2" /> Move to...
            </li>
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true);
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
        onConfirm={handleDelete} // Handle delete here
        title={module.moduleName}
      />
    </div>
  );
};

export default ModuleCard;
