// components/RBAC/PermissionsGroup.js
import React from "react";
import PermissionsRoute from "./PermissionsRoute";

const PermissionsGroup = ({
  department,
  groups,
  selectedPermissions,
  onGroupChange,
  onRouteChange,
  isEditMode,
}) => {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">{department}</h4>
      {groups.map((groupObj) => {
        const allGroupSelected = groupObj.routes.every((r) =>
          selectedPermissions.includes(r._id)
        );
        const someSelected =
          !allGroupSelected &&
          groupObj.routes.some((r) => selectedPermissions.includes(r._id));

        return (
          <div
            key={groupObj.groupName}
            className="border border-gray-200 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                className="form-checkbox text-purple-500"
                onChange={(e) =>
                  onGroupChange(groupObj.routes, e.target.checked)
                }
                checked={allGroupSelected}
                disabled={!isEditMode}
                aria-label={`Select all routes in ${groupObj.groupName}`}
                ref={(el) => {
                  if (el) {
                    el.indeterminate = someSelected;
                  }
                }}
              />
              <span className="text-sm font-bold">{groupObj.groupName}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {groupObj.routes.map((route) => (
                <PermissionsRoute
                  key={route._id}
                  route={route}
                  isSelected={selectedPermissions.includes(route._id)}
                  onChange={onRouteChange}
                  isEditMode={isEditMode}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PermissionsGroup;
