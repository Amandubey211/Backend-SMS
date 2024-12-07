// components/RBAC/RoleHeader.js
import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const RoleHeader = ({ isEditMode, onEditToggle, onDelete, isDeleteDisabled }) => {
  return (
    <div className="flex justify-between bg-gray-50 items-center mb-4 px-4 py-3 rounded-t-lg">
      <h2 className="text-lg font-bold">Manage Role Permissions</h2>
      <div className="flex items-center gap-4">
        <button
          className={`hover:text-gray-500 relative`}
          onClick={onEditToggle}
          aria-label="Toggle edit mode"
        >
          <FiEdit2 size={20} className={isEditMode ? "text-green-300" : ""} />
          {isEditMode && (
            <span
              className="absolute bottom-0 right-0 w-2 h-2 bg-green-300 rounded-full"
              aria-hidden="true"
            ></span>
          )}
        </button>
        <button
          className="hover:text-gray-500"
          onClick={onDelete}
          aria-label="Delete role"
          disabled={isDeleteDisabled}
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default RoleHeader;
