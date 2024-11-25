import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { selectIcon } from "../../../../Store/Slices/Admin/Class/reducer/iconSlice";
import { deleteIcon } from "../../../../Store/Slices/Admin/Class/actions/iconThunk";

const IconGrid = ({ activeIconId, onEdit }) => {
  const { icons, selectedIcon } = useSelector(
    (state) => state.admin.classIcons
  );
  const dispatch = useDispatch();

  // Function to handle icon selection
  const handleIconClick = (icon) => {
    dispatch(selectIcon(icon));
  };

  // Function to handle icon deletion
  const handleDeleteIcon = async (iconId) => {
    await dispatch(deleteIcon(iconId));
  };

  return (
    <div className="flex justify-start gap-3 flex-wrap px-3">
      {icons?.map((icon) => (
        <motion.div
          key={icon._id}
          className="relative rounded-lg transition-transform duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleIconClick(icon)}
        >
          <button
            type="button"
            className={`h-16 w-16 rounded-lg overflow-hidden ${
              activeIconId == icon._id || selectedIcon?._id == icon._id
                ? "border-2 border-purple-500 scale-125 mx-2"
                : "border border-gray-300"
            }`}
            aria-label={`Select icon ${icon.name}`}
          >
            <img
              src={icon.imageLink}
              alt={`Icon ${icon.name}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </button>

          {/* Edit/Delete icons only visible on hover */}
          <div className="absolute top-1 right-1 flex gap-1 rounded-full opacity-0 transition-opacity duration-200 hover:opacity-100">
            <motion.button
              onClick={() => onEdit(icon)}
              className="text-gray-700 hover:text-green-400"
              whileHover={{ scale: 1.2 }}
              aria-label="Edit Icon"
            >
              <FaEdit size={14} />
            </motion.button>
            <motion.button
              onClick={() => handleDeleteIcon(icon._id)}
              className="text-gray-700 hover:text-red-400"
              whileHover={{ scale: 1.2 }}
              aria-label="Delete Icon"
            >
              <FaTrash size={14} />
            </motion.button>
          </div>
        </motion.div>
      ))}

      {/* Add New Icon Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="h-16 w-16 p-1 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer bg-gray-100 shadow-lg"
        onClick={() => onEdit(null)}
        aria-label="Add New Icon"
      >
        <FaPlus className="text-gray-800" />
      </motion.div>
    </div>
  );
};

export default IconGrid;
