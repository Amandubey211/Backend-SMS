// components/RBAC/PermissionsSection.js
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PermissionsGroup from "./PermissionsGroup";
import Spinner from "../Spinner";

const PermissionsSection = ({
  loading,
  displayedDepartments,
  selectedPermissions,
  onSelectAll,
  onToggleAlerts,
  isEditMode,
  handleGroupChange,
  handleRouteChange,
}) => {
  // Compute all route IDs from the displayed departments for select-all logic
  const allDisplayedRouteIds = displayedDepartments.flatMap((deptObj) =>
    deptObj.groups.flatMap((groupObj) => groupObj.routes.map((r) => r._id))
  );

  useEffect(() => {
    const selectAllCheckbox = document.querySelector("#select-all-checkbox");
    if (!selectAllCheckbox) return;
    const allCount = allDisplayedRouteIds.length;
    const selectedCount = selectedPermissions.filter((id) =>
      allDisplayedRouteIds.includes(id)
    ).length;

    if (selectedCount === 0) {
      selectAllCheckbox.indeterminate = false;
      selectAllCheckbox.checked = false;
    } else if (selectedCount === allCount) {
      selectAllCheckbox.indeterminate = false;
      selectAllCheckbox.checked = true;
    } else {
      selectAllCheckbox.indeterminate = true;
    }
  }, [selectedPermissions, allDisplayedRouteIds]);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold">Give Permission</h3>
          <label
            className="inline-flex items-center gap-2 cursor-pointer"
            aria-label="Select all permissions"
          >
            <input
              type="checkbox"
              id="select-all-checkbox"
              className="form-checkbox text-purple-500"
              disabled={!isEditMode}
              onChange={(e) => onSelectAll(e.target.checked)}
            />
            <span className="text-sm font-medium">Select All</span>
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold">Set alerts to user</span>
          <div
            onClick={() => {
              if (isEditMode) onToggleAlerts();
            }}
            className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 ${
              isEditMode ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
            } ${isEditMode && "hover:bg-purple-400"}`}
            aria-label="Toggle user alerts"
            tabIndex={!isEditMode ? -1 : 0}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                selectedPermissions.includes("alert") ? "translate-x-4" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto pr-2">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {displayedDepartments.length === 0 && (
                <div className="text-sm text-gray-500">
                  No Permission Or Department Found.
                </div>
              )}

              {displayedDepartments.map((deptObj) => (
                <PermissionsGroup
                  key={deptObj.department}
                  department={deptObj.department}
                  groups={deptObj.groups}
                  selectedPermissions={selectedPermissions}
                  onGroupChange={handleGroupChange}
                  onRouteChange={handleRouteChange}
                  isEditMode={isEditMode}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default PermissionsSection;
