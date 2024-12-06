import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createRoleThunk } from "../../../Store/Slices/Common/RBAC/rbacThunks";

const CreateRole = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.admin.rbac);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    const trimmedName = roleName.trim();
    const trimmedDesc = description.trim();
    if (trimmedName && trimmedDesc) {
      dispatch(createRoleThunk({ name: trimmedName, description: trimmedDesc }))
        .unwrap()
        .then(() => {
          setRoleName("");
          setDescription("");
          onClose();
        })
        .catch((err) => console.error("Failed to create role:", err));
    } else {
      alert("Please fill in all fields");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Create Role</h2>

        {/* Department Field */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Department</label>
          <input
            type="text"
            value="Teacher"
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
          />
        </div>

        {/* Role Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Role name</label>
          <input
            type="text"
            placeholder="Enter role"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Description
          </label>
          <textarea
            placeholder="Type here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none h-20 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <NavLink className="text-blue-600" to="/manage-roles">
          Add Permission
        </NavLink>

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-100"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className={`px-4 py-2 text-white rounded-lg bg-gradient-to-r from-pink-600 to-purple-500 hover:opacity-90 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create role"}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default CreateRole;
