import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { Tooltip, Spin } from "antd";
import { selectIcon } from "../../../../Store/Slices/Admin/Class/reducer/iconSlice";
import { deleteIcon } from "../../../../Store/Slices/Admin/Class/actions/iconThunk";
import { DEFAULT_CLASS_ICONS } from "../../../../config/classIcons.config";

const IconGrid = ({ activeIconId, onEdit, type, icons: propIcons }) => {
  const dispatch = useDispatch();
  const [deletingIconId, setDeletingIconId] = useState(null);
  // Use icons from props if available; otherwise fallback to Redux state
  const { icons, selectedIcon } = useSelector(
    (state) => state.admin.classIcons
  );

  const effectiveIcons =
    propIcons && propIcons.length
      ? propIcons
      : icons && icons.length
      ? icons
      : DEFAULT_CLASS_ICONS;

  const handleIconClick = (icon) => {
    dispatch(selectIcon(icon));
  };

  const handleDeleteIcon = async (iconId, e) => {
    e.stopPropagation();
    setDeletingIconId(iconId);
    try {
      await dispatch(deleteIcon({ iconId, type }));
    } finally {
      setDeletingIconId(null);
    }
  };

  return (
    <div className="flex justify-start gap-3 flex-wrap px-3">
      {effectiveIcons.map((icon) => {
        // Get unique identifier from either _id or id
        const iconId = icon._id || icon.id;
        // Check if icon is a default icon (assume default icons have IDs starting with "default-")
        const isDefault = iconId.startsWith("default-");
        // Determine active status: check if the passed activeIconId matches the icon's id
        // or if the selectedIcon (from Redux) is an object matching by id or if it's a string matching the imageLink
        const isActive =
          activeIconId === iconId ||
          (selectedIcon &&
            typeof selectedIcon === "object" &&
            (selectedIcon._id || selectedIcon.id) === iconId) ||
          (selectedIcon &&
            typeof selectedIcon !== "object" &&
            selectedIcon === icon.imageLink);
        return (
          <motion.div
            key={iconId}
            className="relative rounded-lg transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleIconClick(icon)}
          >
            <button
              type="button"
              className={`h-16 w-16 rounded-lg overflow-hidden ${
                isActive
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

            {/* Only show edit and delete if icon is NOT default */}
            {!isDefault && (
              <div className="absolute top-1 right-1 flex gap-1 rounded-full opacity-0 transition-opacity duration-200 hover:opacity-100">
                <Tooltip title="Edit Icon">
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(icon);
                    }}
                    className="text-gray-700 hover:text-green-400"
                    whileHover={{ scale: 1.2 }}
                    aria-label="Edit Icon"
                  >
                    <FaEdit size={14} />
                  </motion.button>
                </Tooltip>
                <Tooltip title="Delete Icon">
                  <motion.button
                    type="button"
                    onClick={(e) => handleDeleteIcon(iconId, e)}
                    className="text-gray-700 hover:text-red-400"
                    whileHover={{ scale: 1.2 }}
                    aria-label="Delete Icon"
                  >
                    {deletingIconId === iconId ? (
                      <Spin size="small" />
                    ) : (
                      <FaTrash size={14} />
                    )}
                  </motion.button>
                </Tooltip>
              </div>
            )}
          </motion.div>
        );
      })}

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="h-16 w-16 p-1 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer bg-gray-100 shadow-lg"
        onClick={() => onEdit(null)}
        aria-label="Add New Icon"
      >
        <Tooltip title="Add New Icon">
          <FaPlus className="text-gray-800" />
        </Tooltip>
      </motion.div>
    </div>
  );
};

export default IconGrid;
