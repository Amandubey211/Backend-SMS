import React, { useState } from "react";

const CreateRole = ({ isOpen, onClose, onCreate }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (roleName.trim() && description.trim()) {
      onCreate({ roleName, description });
      onClose();
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
          <label className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            placeholder="Type here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none h-20 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-100"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-500 text-white rounded-lg hover:opacity-90"
          >
            Create role
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRole;
