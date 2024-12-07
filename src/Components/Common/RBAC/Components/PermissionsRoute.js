// components/RBAC/PermissionsRoute.js
import React from "react";

const PermissionsRoute = ({ route, isSelected, onChange, isEditMode }) => {
  return (
    <label
      className={`inline-flex items-center space-x-2 ${
        !isEditMode && "cursor-not-allowed"
      }`}
    >
      <input
        type="checkbox"
        className="form-checkbox text-purple-500"
        checked={isSelected}
        onChange={(e) => onChange(route._id, e.target.checked)}
        disabled={!isEditMode}
        aria-label={`Permission: ${route.name}`}
      />
      <span className="text-sm">{route.name}</span>
    </label>
  );
};

export default PermissionsRoute;
