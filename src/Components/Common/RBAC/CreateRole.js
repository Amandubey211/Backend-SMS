// CreateRole.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  createRoleThunk,
  getPermissionsThunk,
} from "../../../Store/Slices/Common/RBAC/rbacThunks";
import Spinner from "../Spinner";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateRole = ({ onClose, department }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, permissions } = useSelector(
    (state) => state.admin.rbac
  );

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [isAlertEnabled, setAlertEnabled] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    dispatch(getPermissionsThunk());
  }, [dispatch]);

  const permissionDepartments = permissions || [];
  const displayedDepartments = permissionDepartments.filter(
    (deptObj) => deptObj.department.toLowerCase() === department.toLowerCase()
  );

  const allDisplayedRouteIds = displayedDepartments.flatMap((deptObj) =>
    deptObj.groups.flatMap((groupObj) => groupObj.routes.map((r) => r._id))
  );

  const handleGlobalChange = (isChecked) => {
    if (isChecked) {
      const uniqueRouteIds = Array.from(new Set(allDisplayedRouteIds));
      setSelectedPermissions((prev) =>
        Array.from(new Set([...prev, ...uniqueRouteIds]))
      );
    } else {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !allDisplayedRouteIds.includes(id))
      );
    }
  };

  const handleGroupChange = (groupRoutes, isChecked) => {
    const groupRouteIds = groupRoutes.map((r) => r._id);
    setSelectedPermissions((prev) => {
      const prevSet = new Set(prev);
      if (isChecked) {
        groupRouteIds.forEach((id) => prevSet.add(id));
      } else {
        groupRouteIds.forEach((id) => prevSet.delete(id));
      }
      return Array.from(prevSet);
    });
  };

  const handleRouteChange = (routeId, isChecked) => {
    setSelectedPermissions((prev) => {
      const prevSet = new Set(prev);
      if (isChecked) prevSet.add(routeId);
      else prevSet.delete(routeId);
      return Array.from(prevSet);
    });
  };

  const handleAlertToggle = () => {
    setAlertEnabled(!isAlertEnabled);
  };

  const handleCreate = async () => {
    const trimmedName = roleName.trim();
    const trimmedDesc = description.trim();

    if (!trimmedName || !trimmedDesc) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await dispatch(
        createRoleThunk({
          name: trimmedName,
          description: trimmedDesc,
          permission: selectedPermissions,
        })
      ).unwrap();

      toast.success("Role created successfully!");
      setRoleName("");
      setDescription("");
      onClose();

      navigate("/users/manage-roles", {
        state: {
          department,
          role: trimmedName,
          editMode: true,
        },
      });
    } catch (err) {
      console.error("Failed to create role:", err);
      toast.error("Failed to create role");
    }
  };

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
    <motion.div
      className="flex flex-col h-full py-2 px-4"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {/* Non-scrollable top section (role details) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        {/* Left Column: Department & Role */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Department
            </label>
            <input
              type="text"
              value={department}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Role Name
            </label>
            <input
              type="text"
              placeholder="Enter role"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Column: Description */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Description
          </label>
          <textarea
            placeholder="Type here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 resize-vertical focus:ring-2 focus:ring-purple-500 focus:outline-none"
            style={{ resize: "vertical" }}
          />
        </div>
      </div>

      {/* Scrollable middle section (permissions) */}
      <div className="border border-gray-200 rounded-lg p-4  flex flex-col  overflow-hidden">
        <div className="flex justify-end items-center">
          <div className="flex items-center gap-2">
            {/* <h3 className="text-sm font-bold">Give Permission</h3> */}
            <label
              className="inline-flex items-center gap-2 cursor-pointer"
              aria-label="Select all permissions"
            >
              <span className="text-sm font-medium text-gradient">
                Select All
              </span>
              <input
                type="checkbox"
                id="select-all-checkbox"
                className="form-checkbox text-purple-500"
                onChange={(e) => handleGlobalChange(e.target.checked)}
              />
            </label>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 max-h-52">
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
                    No Permissions Found for this Department.
                  </div>
                )}

                {displayedDepartments.map((deptObj) => (
                  <div key={deptObj.department}>
                    <h4 className="text-md font-semibold mb-2 ">
                      {deptObj.department}
                    </h4>
                    {deptObj.groups.map((groupObj) => {
                      const allGroupSelected = groupObj.routes.every((r) =>
                        selectedPermissions.includes(r._id)
                      );
                      const someSelected =
                        !allGroupSelected &&
                        groupObj.routes.some((r) =>
                          selectedPermissions.includes(r._id)
                        );

                      return (
                        <motion.div
                          key={groupObj.groupName}
                          className="border border-gray-200 rounded-lg p-4 mb-4"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              className="form-checkbox text-purple-500"
                              onChange={(e) =>
                                handleGroupChange(
                                  groupObj.routes,
                                  e.target.checked
                                )
                              }
                              checked={allGroupSelected}
                              aria-label={`Select all routes in ${groupObj.groupName}`}
                              ref={(el) => {
                                if (el) {
                                  el.indeterminate = someSelected;
                                }
                              }}
                            />
                            <span className="text-sm font-bold">
                              {groupObj.groupName}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {groupObj.routes.map((route) => (
                              <label
                                key={route._id}
                                className="inline-flex items-center space-x-2"
                                aria-label={`Permission: ${route.name}`}
                              >
                                <input
                                  type="checkbox"
                                  className="form-checkbox text-purple-500"
                                  checked={selectedPermissions.includes(
                                    route._id
                                  )}
                                  onChange={(e) =>
                                    handleRouteChange(
                                      route._id,
                                      e.target.checked
                                    )
                                  }
                                />
                                <span className="text-sm">{route.name}</span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Always visible bottom section (action buttons) */}
      <div className="pt-2 mb-3 flex justify-end">
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
    </motion.div>
  );
};

export default CreateRole;
