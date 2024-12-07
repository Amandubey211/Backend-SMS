import React, { useEffect, useState, useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRolesThunk,
  getPermissionsThunk,
  deleteRoleThunk,
  editRoleThunk,
} from "../../../Store/Slices/Common/RBAC/rbacThunks";
import DeleteModal from "../DeleteModal";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "../Spinner";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";

const ManageRolePage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { roles, permissions, loading, error } = useSelector(
    (state) => state.admin.rbac
  );

  // Flatten roles and include department information
  const availableRoles = useMemo(() => {
    if (!roles || !Array.isArray(roles)) return [];
    return roles.flatMap((deptObj) =>
      deptObj.roles.map((role) => ({
        ...role,
        department: deptObj.department ? deptObj.department.toLowerCase() : "",
      }))
    );
  }, [roles]);

  // Extract department names from permissions, ensuring consistent casing
  const permissionDepartments = useMemo(() => {
    if (!permissions || !Array.isArray(permissions)) return [];
    return permissions.map((dept) => ({
      ...dept,
      department: dept.department.toLowerCase(),
    }));
  }, [permissions]);

  const departmentNames = permissionDepartments.map((d) => d.department);

  // Pre-fill from location.state if available
  const initialDepartment = location.state?.department || "";
  const initialRole = location.state?.role || "";
  const initialEditMode = location.state?.editMode || false;

  const [department, setDepartment] = useState(
    initialDepartment ? initialDepartment.toLowerCase() : ""
  );
  const [role, setRole] = useState(initialRole);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [originalPermissions, setOriginalPermissions] = useState([]);
  const [description, setDescription] = useState("");
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [isAlertEnabled, setIsAlertEnabled] = useState(false); // Corrected setter

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

  // Filter roles based on selected department
  const filteredRoles = useMemo(() => {
    if (!department) return availableRoles;
    return availableRoles.filter((role) => role.department === department);
  }, [availableRoles, department]);

  // Find the selected role object
  const selectedRoleObj = useMemo(() => {
    return filteredRoles.find((r) => r.name === role);
  }, [filteredRoles, role]);

  // Update selected permissions and description when role changes
  useEffect(() => {
    if (selectedRoleObj) {
      setSelectedPermissions(selectedRoleObj.permission || []);
      setOriginalPermissions(selectedRoleObj.permission || []);
      setDescription(selectedRoleObj.description || "");
      setIsAlertEnabled(false); // Reset alert toggle on role change
    } else {
      setSelectedPermissions([]);
      setOriginalPermissions([]);
      setDescription("");
      setIsAlertEnabled(false);
    }
  }, [selectedRoleObj]);

  const handleAlertToggle = () => {
    if (!isEditMode) return;
    setIsAlertEnabled((prev) => !prev);
  };

  // Compute all route IDs from the displayed departments for select-all logic
  const allDisplayedRouteIds = useMemo(() => {
    return permissionDepartments
      .filter((deptObj) => !department || deptObj.department === department)
      .flatMap((deptObj) =>
        deptObj.groups.flatMap((groupObj) => groupObj.routes.map((r) => r._id))
      );
  }, [permissionDepartments, department]);

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
      const uniqueRouteIds = Array.from(new Set([...allDisplayedRouteIds]));
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
      const updates = {
        name: role,
        permission: selectedPermissions,
        description: description,
      };

      await dispatch(
        editRoleThunk({ roleId: selectedRoleObj.id, updates })
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
      await dispatch(deleteRoleThunk(selectedRoleObj.id)).unwrap();
      if (role === selectedRoleObj.name) setRole("");
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
          JSON.stringify(originalPermissions.sort()) ||
        description !== (selectedRoleObj?.description || "");

      if (changesUnsaved) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Discard changes and exit edit mode?"
        );
        if (!confirmLeave) {
          return; // User canceled
        } else {
          // Discard changes
          setSelectedPermissions(originalPermissions);
          setDescription(selectedRoleObj?.description || "");
          setIsAlertEnabled(false);
        }
      }
      setIsEditMode(false);
    } else {
      setIsEditMode(true);
    }
  };

  const handleDepartmentChange = (selectedDepartment) => {
    setDepartment(selectedDepartment.toLowerCase());
    setRole(""); // Reset role when department changes
    setSelectedPermissions([]);
    setOriginalPermissions([]);
    setDescription("");
    setIsAlertEnabled(false);
  };

  // Determine if operations should be disabled
  const isOperationDisabled = loading || (!isEditMode && selectedRoleObj);

  return (
    <Layout title="Manage Roles | Student Diwan">
      <DashLayout>
        <div className="p-4">
          <motion.div
            className="bg-white rounded-lg w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex justify-between bg-gray-50 items-center mb-4 px-4 py-3 rounded-t-lg">
              <h2 className="text-lg font-bold">Manage Role Permissions</h2>
              <div className="flex items-center gap-4">
                <button
                  className={`hover:text-gray-500 relative`}
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
                  className="hover:text-gray-500"
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
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full px-3 py-2 border capitalize border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  aria-label="Select Department"
                >
                  <option value="">All Departments</option>
                  {departmentNames.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept.charAt(0).toUpperCase() + dept.slice(1)}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  disabled={!isEditMode}
                  aria-label="Select Role"
                >
                  <option value="">Select a role</option>
                  {error && <option disabled>{error}</option>}
                  {!error &&
                    filteredRoles.map((r) => (
                      <option key={r.id} value={r.name}>
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
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  disabled={!isEditMode || !selectedRoleObj}
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
                      className="form-checkbox text-purple-500"
                      disabled={!isEditMode}
                      onChange={(e) => handleGlobalChange(e.target.checked)}
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
                      {permissionDepartments.length === 0 && department && (
                        <div className="text-sm text-gray-500">
                          No Permission Or Department Found.
                        </div>
                      )}

                      {permissionDepartments
                        .filter(
                          (deptObj) =>
                            !department || deptObj.department === department
                        )
                        .map((deptObj) => (
                          <div key={deptObj.department}>
                            <h4 className="text-md font-semibold mb-2">
                              {deptObj.department.charAt(0).toUpperCase() +
                                deptObj.department.slice(1)}
                            </h4>
                            {deptObj.groups.map((groupObj) => {
                              const allGroupSelected = groupObj.routes.every(
                                (r) => selectedPermissions.includes(r._id)
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
                                      disabled={!isEditMode}
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
                                        className={`inline-flex items-center space-x-2`}
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
                                          disabled={!isEditMode}
                                        />
                                        <span className="text-sm">
                                          {route.name}
                                        </span>
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

            <div className="flex justify-end">
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
