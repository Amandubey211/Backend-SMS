// components/RBAC/RoleForm.js
import React from "react";

const RoleForm = ({
  department,
  onDepartmentChange,
  departments,
  role,
  onRoleChange,
  roles,
  description,
  onDescriptionChange,
  isEditMode,
  error,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label
          htmlFor="department-select"
          className="block text-sm font-semibold mb-1"
        >
          Department
        </label>
        <select
          id="department-select"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="w-full px-3 py-2 border capitalize border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          aria-label="Select Department"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="role-select"
          className="block text-sm font-semibold mb-1"
        >
          Role
        </label>
        <select
          id="role-select"
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          disabled={!isEditMode}
          aria-label="Select Role"
        >
          <option value="">Select a role</option>
          {error && <option disabled>{error}</option>}
          {!error &&
            roles.map((r) => (
              <option key={r._id} value={r.name}>
                {r.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="description-input"
          className="block text-sm font-semibold mb-1"
        >
          Description
        </label>
        <input
          id="description-input"
          type="text"
          placeholder="Write here"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          disabled={!isEditMode || !role}
          aria-label="Role description"
        />
      </div>
    </div>
  );
};

export default RoleForm;
