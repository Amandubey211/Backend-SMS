import React, { useEffect, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRolesThunk,
  getPermissionsThunk,
  assignRoleThunk,
  deleteRoleThunk,
} from "../../../Store/Slices/Common/RBAC/rbacThunks";
import DeleteModal from "../DeleteModal";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "../Spinner";

const ManageRolePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roles, permissions, loading, error } = useSelector(
    (state) => state.admin.rbac
  );

  const [permissionsExpanded, setPermissionsExpanded] = useState(false);
  const [isAlertEnabled, setAlertEnabled] = useState(false);
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [originalPermissions, setOriginalPermissions] = useState([]); // To track unsaved changes

  // Edit mode for fields
  const [isEditMode, setIsEditMode] = useState(false);

  // Delete confirmation modal
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // Loading states for operations
  const [isSettingPermissions, setIsSettingPermissions] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState(false);

  useNavHeading("Admin", "Manage Role");

  useEffect(() => {
    dispatch(getAllRolesThunk());
    dispatch(getPermissionsThunk());
  }, [dispatch]);

  // Load persisted settings from localStorage
  useEffect(() => {
    const savedDepartment = localStorage.getItem("preferredDepartment");
    const savedAlert = localStorage.getItem("alertEnabled");

    if (savedDepartment) {
      setDepartment(savedDepartment);
    }
    if (savedAlert) {
      setAlertEnabled(savedAlert === "true");
    }
  }, []);

  // Whenever department or alert changes, persist them
  useEffect(() => {
    localStorage.setItem("preferredDepartment", department);
  }, [department]);

  useEffect(() => {
    localStorage.setItem("alertEnabled", isAlertEnabled.toString());
  }, [isAlertEnabled]);

  const availableRoles = roles || [];
  const permissionDepartments = permissions || [];
  const departmentNames = permissionDepartments.map((d) => d.department);

  const displayedDepartments = department
    ? permissionDepartments.filter(
        (deptObj) => deptObj.department === department
      )
    : permissionDepartments;

  const selectedRoleObj = availableRoles.find((r) => r.name === role);

  useEffect(() => {
    if (selectedRoleObj && Array.isArray(selectedRoleObj.routes)) {
      const assignedRouteIds = selectedRoleObj.routes.map((route) => route._id);
      setSelectedPermissions(assignedRouteIds);
      setOriginalPermissions(assignedRouteIds);
    } else {
      setSelectedPermissions([]);
      setOriginalPermissions([]);
    }
  }, [selectedRoleObj]);

  const togglePermissions = () => {
    setPermissionsExpanded(!permissionsExpanded);
  };

  const handleAlertToggle = () => {
    if (!isEditMode) return; // Only toggle alert if in edit mode
    setAlertEnabled(!isAlertEnabled);
  };

  // Compute all route IDs from the displayed departments for select-all logic
  const allDisplayedRouteIds = [];
  displayedDepartments.forEach((deptObj) => {
    deptObj.groups.forEach((groupObj) => {
      groupObj.routes.forEach((route) => {
        allDisplayedRouteIds.push(route._id);
      });
    });
  });

  // useEffect to update select-all checkbox state whenever selectedPermissions changes
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

  const handleGlobalChange = (isChecked) => {
    if (!isEditMode) return;
    if (isChecked) {
      // Select all displayed routes
      const uniqueRouteIds = Array.from(new Set([...allDisplayedRouteIds]));
      setSelectedPermissions((prev) => {
        // Also keep any previously selected routes that might not be displayed
        const combined = new Set([...prev, ...uniqueRouteIds]);
        return Array.from(combined);
      });
    } else {
      // Deselect all displayed routes
      setSelectedPermissions((prev) =>
        prev.filter((id) => !allDisplayedRouteIds.includes(id))
      );
    }
  };

  const handleGroupChange = (deptName, groupName, isChecked, groupRoutes) => {
    if (!isEditMode) return;
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
    if (!isEditMode) return;
    setSelectedPermissions((prev) => {
      const prevSet = new Set(prev);
      if (isChecked) prevSet.add(routeId);
      else prevSet.delete(routeId);
      return Array.from(prevSet);
    });
  };

  const handleSetPermissions = async () => {
    if (!selectedRoleObj) {
      toast.error("Please select a role before setting permissions");
      return;
    }
    setIsSettingPermissions(true);
    try {
      await dispatch(
        assignRoleThunk({
          roleId: selectedRoleObj.roleId,
          permission: selectedPermissions,
        })
      ).unwrap();
      toast.success("Permissions successfully updated!");
      setOriginalPermissions(selectedPermissions); // Now current permissions are saved
    } catch (err) {
      console.error("Error updating permissions:", err);
      toast.error("Failed to update permissions");
    } finally {
      setIsSettingPermissions(false);
    }
  };

  const handleDeleteClick = () => {
    if (!selectedRoleObj) {
      toast.error("Please select a role before attempting to delete");
      return;
    }
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRoleObj) return;
    setIsDeletingRole(true);
    try {
      await dispatch(deleteRoleThunk(selectedRoleObj.roleId)).unwrap();
      // Clear currently selected role if it was deleted
      if (role === selectedRoleObj?.name) {
        setRole("");
      }
      toast.success("Role deleted successfully");
    } catch (err) {
      console.error("Error deleting role:", err);
      toast.error("Failed to delete role");
    } finally {
      setIsDeletingRole(false);
      setDeleteModalOpen(false);
    }
  };

  const handleEditClick = () => {
    if (isEditMode) {
      // Check for unsaved changes
      const changesUnsaved =
        JSON.stringify(selectedPermissions.sort()) !==
        JSON.stringify(originalPermissions.sort());

      if (changesUnsaved) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Discard changes and exit edit mode?"
        );
        if (!confirmLeave) {
          return; // User canceled
        } else {
          // Discard changes
          setSelectedPermissions(originalPermissions);
        }
      }
      // Toggle off edit mode
      setIsEditMode(false);
    } else {
      // Toggle on edit mode
      setIsEditMode(true);
    }
  };

  const isOperationDisabled = loading || (!isEditMode && selectedRoleObj);

  return (
    <Layout title="Manage Roles | Student Diwan">
      <DashLayout>
        <div className="p-2">
          <motion.div
            className="bg-white rounded-lg w-full p-6 shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex justify-between items-center mb-4 bg-pink-500 text-white px-4 py-3 rounded-t-lg">
              <h2 className="text-lg font-bold">Manage Role Permissions</h2>
              <div className="flex items-center gap-4">
                <button
                  className={`text-white hover:text-gray-200 relative`}
                  onClick={handleEditClick}
                  aria-label="Toggle edit mode"
                >
                  <FiEdit2
                    size={20}
                    className={isEditMode ? "text-green-300" : ""}
                  />
                  {isEditMode && (
                    <span
                      className="absolute bottom-0 right-0 w-2 h-2 bg-green-300 rounded-full"
                      aria-hidden="true"
                    ></span>
                  )}
                </button>
                <button
                  className="text-white hover:text-gray-200"
                  onClick={handleDeleteClick}
                  aria-label="Delete role"
                  disabled={!selectedRoleObj || loading || isDeletingRole}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>

            {/* Department, Role, Description Inputs */}
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
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:cursor-not-allowed"
                  disabled={!isEditMode}
                  aria-label="Select Department"
                >
                  <option value="">All Departments</option>
                  {departmentNames.map((dept) => (
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
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:cursor-not-allowed"
                  disabled={!isEditMode}
                  aria-label="Select Role"
                >
                  <option value="">Select a role</option>
                  {error && <option disabled>{error}</option>}
                  {!error &&
                    availableRoles.map((r) => (
                      <option key={r.roleId} value={r.name}>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:cursor-not-allowed"
                  disabled={!isEditMode}
                  aria-label="Role description"
                />
              </div>
            </div>

            {/* Permissions Section */}
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
                      className="form-checkbox text-purple-500 disabled:cursor-not-allowed"
                      disabled={!isEditMode}
                    />
                    <span className="text-sm font-medium">Select All</span>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold">
                    Set alerts to user
                  </span>
                  <div
                    onClick={handleAlertToggle}
                    className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 ${
                      isAlertEnabled
                        ? "bg-gradient-to-r from-pink-500 to-purple-500"
                        : ""
                    } ${
                      !isEditMode
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    aria-label="Toggle user alerts"
                    tabIndex={!isEditMode ? -1 : 0}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        isAlertEnabled ? "translate-x-4" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                // If loading, show spinner in the group section center
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
                      {displayedDepartments.length === 0 && department && (
                        <div className="text-sm text-gray-500">
                          No groups available for the selected department.
                        </div>
                      )}

                      {displayedDepartments.map((deptObj) => (
                        <div key={deptObj.department}>
                          <h4 className="text-md font-semibold mb-2">
                            {deptObj.department}
                          </h4>
                          {deptObj.groups.map((groupObj) => (
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
                                  className="form-checkbox text-purple-500 disabled:cursor-not-allowed"
                                  onChange={(e) =>
                                    handleGroupChange(
                                      deptObj.department,
                                      groupObj.groupName,
                                      e.target.checked,
                                      groupObj.routes
                                    )
                                  }
                                  checked={groupObj.routes.every((r) =>
                                    selectedPermissions.includes(r._id)
                                  )}
                                  disabled={!isEditMode}
                                  aria-label={`Select all routes in ${groupObj.groupName}`}
                                  indeterminate={
                                    !groupObj.routes.every((r) =>
                                      selectedPermissions.includes(r._id)
                                    ) &&
                                    !groupObj.routes.every(
                                      (r) =>
                                        !selectedPermissions.includes(r._id)
                                    )
                                  }
                                />
                                <span className="text-sm font-bold">
                                  {groupObj.groupName}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {groupObj.routes.map((route) => (
                                  <label
                                    key={route._id}
                                    className={`inline-flex items-center space-x-2 permission-checkbox permission-${deptObj.department}-${groupObj.groupName}`}
                                    aria-label={`Permission: ${route.name}`}
                                  >
                                    <input
                                      type="checkbox"
                                      className="form-checkbox text-purple-500 permission-checkbox disabled:cursor-not-allowed"
                                      checked={selectedPermissions.includes(
                                        route._id
                                      )}
                                      onChange={(e) =>
                                        handleRouteChange(
                                          route._id,
                                          e.target.checked
                                        )
                                      }
                                      disabled={!isEditMode}
                                    />
                                    <span className="text-sm">
                                      {route.name}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ))}

                      <div className="flex justify-start mt-4">
                        <button
                          onClick={togglePermissions}
                          className="text-center bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg px-3 py-1 hover:opacity-90"
                          aria-label="Toggle permissions view"
                          style={{ fontSize: "0.875rem" }} // Slightly smaller text
                        >
                          {permissionsExpanded ? "Show Less" : "See More"}
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-white text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-100 disabled:cursor-not-allowed"
                aria-label="Go back"
                disabled={isOperationDisabled}
              >
                Back
              </button>
              <button
                onClick={handleSetPermissions}
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-500 text-white rounded-lg hover:opacity-90 disabled:cursor-not-allowed"
                aria-label="Set Permissions"
                disabled={
                  !isEditMode || isSettingPermissions || !selectedRoleObj
                }
              >
                {isSettingPermissions ? "Saving..." : "Set Permissions"}
              </button>
            </div>
          </motion.div>
        </div>
      </DashLayout>

      {selectedRoleObj && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title={selectedRoleObj.name}
        />
      )}
    </Layout>
  );
};

export default ManageRolePage;
