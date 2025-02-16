import React, { useEffect, useState, useMemo, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  FiEdit2,
  FiTrash2,
  FiMaximize,
  FiMinimize,
  FiEye,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { Tooltip, Input, Modal } from "antd";
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
import ProtectedSection from "../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../config/permission";
import ProtectedAction from "../../../Routes/ProtectedRoutes/ProtectedAction";
import { debounce } from "lodash"; // Using lodash for debouncing
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";

const { Search } = Input;

// Custom hook for debounced value
const useDebouncedValue = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
};

const ManageRolePage = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Grab the user’s role from Redux
  const userType = useSelector((state) => state.common.auth.role);
  const userTypeNormalized = userType?.toLowerCase() || "";

  const { roles, permissions, loading, error } = useSelector(
    (state) => state.admin.rbac
  );

  // Pre-fill from location.state if available
  const initialDepartment = location.state?.department || "";
  const initialRole = location.state?.role || "";
  const initialEditMode = location.state?.editMode || false;

  // Local states
  const [department, setDepartment] = useState(
    initialDepartment ? initialDepartment.toLowerCase() : ""
  );
  const [role, setRole] = useState(initialRole);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [originalPermissions, setOriginalPermissions] = useState([]);
  const [description, setDescription] = useState("");
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSettingPermissions, setIsSettingPermissions] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // State to highlight edit mode button if needed (optional)
  const [highlightEditButton, setHighlightEditButton] = useState(false);

  // Use debounced search query for performance
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  useNavHeading("User", "Manage Role");

  useEffect(() => {
    dispatch(getAllRolesThunk());
    dispatch(getPermissionsThunk());
  }, [dispatch]);

  // Force department to userType if not admin
  useEffect(() => {
    if (userTypeNormalized !== "admin") {
      setDepartment(userTypeNormalized);
    }
  }, [userTypeNormalized]);

  // Flatten roles with department info
  const availableRoles = useMemo(() => {
    if (!roles || !Array.isArray(roles)) return [];
    return roles.flatMap((deptObj) =>
      deptObj.roles.map((role) => ({
        ...role,
        department: deptObj.department ? deptObj.department.toLowerCase() : "",
      }))
    );
  }, [roles]);

  // Normalize permissions department info
  const permissionDepartments = useMemo(() => {
    if (!permissions || !Array.isArray(permissions)) return [];
    return permissions.map((dept) => ({
      ...dept,
      department: dept.department.toLowerCase(),
    }));
  }, [permissions]);

  // Filter permissions based on user type
  const filteredPermissionDepartments = useMemo(() => {
    if (!permissionDepartments.length) return [];
    return userTypeNormalized === "admin"
      ? permissionDepartments
      : permissionDepartments.filter(
          (deptObj) => deptObj.department === userTypeNormalized
        );
  }, [permissionDepartments, userTypeNormalized]);

  const departmentNames = useMemo(
    () => permissionDepartments.map((d) => d.department),
    [permissionDepartments]
  );

  // Filter roles based on selected department
  const filteredRoles = useMemo(() => {
    if (!department) return availableRoles;
    return availableRoles.filter((r) => r.department === department);
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
    } else {
      setSelectedPermissions([]);
      setOriginalPermissions([]);
      setDescription("");
    }
  }, [selectedRoleObj]);

  // Compute all route IDs from the displayed departments for "select all"
  const allDisplayedRouteIds = useMemo(() => {
    return filteredPermissionDepartments
      .filter((deptObj) => !department || deptObj.department === department)
      .flatMap((deptObj) =>
        deptObj.groups.flatMap((groupObj) => groupObj.routes.map((r) => r._id))
      );
  }, [filteredPermissionDepartments, department]);

  // Synchronize "select all" checkbox status
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

  // Determine checkbox color based on mode:
  // In edit mode, use blue; in view mode, use green.
  const checkboxColor = isEditMode ? "text-blue-500" : "text-green-500";

  // ----------------- Updated Confirmation Modals -----------------
  // Modal for switching to Edit Mode when a permission checkbox is clicked in view mode.
  const triggerEditHighlight = useCallback(() => {
    Modal.confirm({
      title: (
        <div className="flex items-center">
          <FiEdit2 className="text-purple-500 mr-3" size={30} />
          <span className="text-2xl font-bold">Switch to Edit Mode</span>
        </div>
      ),
      content: (
        <div className="text-xl">
          You are currently in{" "}
          <span className="text-green-500 font-semibold">View Mode</span>. To
          modify permissions, please switch to{" "}
          <span className="text-blue-500 font-semibold">Edit Mode</span>.
        </div>
      ),
      okText: "Switch",
      cancelText: "Cancel",
      centered: true,
      width: 600,
      okButtonProps: {
        className: "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
      },
      onOk: () => {
        setIsEditMode(true);
      },
    });
  }, []);

  // ----------------- Handlers -----------------
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleGlobalChange = useCallback(
    (isChecked) => {
      if (!isEditMode) {
        triggerEditHighlight();
        return;
      }
      if (isChecked) {
        setSelectedPermissions((prev) =>
          Array.from(new Set([...prev, ...allDisplayedRouteIds]))
        );
      } else {
        setSelectedPermissions((prev) =>
          prev.filter((id) => !allDisplayedRouteIds.includes(id))
        );
      }
    },
    [isEditMode, allDisplayedRouteIds, triggerEditHighlight]
  );

  const handleGroupChange = useCallback(
    (groupRoutes, isChecked) => {
      if (!isEditMode) {
        triggerEditHighlight();
        return;
      }
      const groupRouteIds = groupRoutes.map((r) => r._id);
      setSelectedPermissions((prev) => {
        const prevSet = new Set(prev);
        groupRouteIds.forEach((id) => {
          isChecked ? prevSet.add(id) : prevSet.delete(id);
        });
        return Array.from(prevSet);
      });
    },
    [isEditMode, triggerEditHighlight]
  );

  const handleRouteChange = useCallback(
    (routeId, isChecked) => {
      if (!isEditMode) {
        triggerEditHighlight();
        return;
      }
      setSelectedPermissions((prev) => {
        const prevSet = new Set(prev);
        isChecked ? prevSet.add(routeId) : prevSet.delete(routeId);
        return Array.from(prevSet);
      });
    },
    [isEditMode, triggerEditHighlight]
  );

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
      setOriginalPermissions(selectedPermissions);
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
      // Detect unsaved changes by comparing sorted arrays
      const sortedSelected = [...selectedPermissions].sort();
      const sortedOriginal = [...originalPermissions].sort();
      const changesUnsaved =
        JSON.stringify(sortedSelected) !== JSON.stringify(sortedOriginal) ||
        description !== (selectedRoleObj?.description || "");

      if (changesUnsaved) {
        Modal.confirm({
          title: (
            <div className="flex items-center">
              <FiEdit2 className="text-purple-500 mr-3" size={30} />
              <span className="text-2xl font-bold">Discard Changes?</span>
            </div>
          ),
          content: (
            <div className="text-xl">
              You have unsaved changes. Do you want to discard these changes and
              exit edit mode?
            </div>
          ),
          okText: "Discard",
          cancelText: "Cancel",
          centered: true,
          width: 600,
          okButtonProps: {
            className:
              "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
          },
          onOk: () => {
            setSelectedPermissions(originalPermissions);
            setDescription(selectedRoleObj?.description || "");
            setIsEditMode(false);
          },
        });
        return;
      }
      setIsEditMode(false);
    } else {
      setIsEditMode(true);
    }
  };

  const handleDepartmentChange = (selectedDepartment) => {
    setDepartment(selectedDepartment.toLowerCase());
    setRole("");
    setSelectedPermissions([]);
    setOriginalPermissions([]);
    setDescription("");
  };

  /**
   * Renders the list of permissions.
   * @param {boolean} inModal - If true, removes height restrictions.
   */
  const renderPermissionsContent = useCallback(
    (inModal = false) => {
      const containerClass = inModal
        ? "overflow-y-auto pr-2"
        : "max-h-64 overflow-y-auto pr-2";

      if (loading) {
        return (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        );
      }

      if (!filteredPermissionDepartments.length && department) {
        return (
          <div className="text-sm text-gray-500">
            No Permission Or Department Found.
          </div>
        );
      }

      return (
        <div className={containerClass}>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {filteredPermissionDepartments
                .filter(
                  (deptObj) => !department || deptObj.department === department
                )
                .map((deptObj) => (
                  <div key={deptObj.department}>
                    <h4 className="text-2xl font-semibold mb-2">
                      {deptObj.department.charAt(0).toUpperCase() +
                        deptObj.department.slice(1)}
                    </h4>
                    {deptObj.groups.map((groupObj) => {
                      // Filter routes based on debounced search query
                      const filteredRoutes = groupObj.routes.filter((route) =>
                        route.name
                          .toLowerCase()
                          .includes(debouncedSearchQuery.toLowerCase())
                      );

                      const allGroupSelected =
                        filteredRoutes.length > 0 &&
                        filteredRoutes.every((r) =>
                          selectedPermissions.includes(r._id)
                        );

                      const someSelected =
                        !allGroupSelected &&
                        filteredRoutes.some((r) =>
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
                            <Tooltip
                              title={`Select all routes in "${groupObj.groupName}"`}
                            >
                              <input
                                type="checkbox"
                                className={`form-checkbox ${checkboxColor}`}
                                onChange={(e) =>
                                  handleGroupChange(
                                    filteredRoutes,
                                    e.target.checked
                                  )
                                }
                                checked={
                                  filteredRoutes.length > 0 && allGroupSelected
                                }
                                disabled={
                                  !isEditMode || filteredRoutes.length < 1
                                }
                                aria-label={`Select all routes in ${groupObj.groupName}`}
                                ref={(el) => {
                                  if (el) el.indeterminate = someSelected;
                                }}
                              />
                            </Tooltip>
                            <span className="text-sm font-bold">
                              {groupObj.groupName}
                            </span>
                          </div>
                          {filteredRoutes.length === 0 ? (
                            <div className="text-xs text-gray-500">
                              No routes match your search.
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {filteredRoutes.map((route) => (
                                <label
                                  key={route._id}
                                  className="inline-flex items-center space-x-2"
                                  aria-label={`Permission: ${route.name}`}
                                >
                                  <Tooltip title={`Permission: ${route.name}`}>
                                    <input
                                      type="checkbox"
                                      className={`form-checkbox ${checkboxColor}`}
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
                                  </Tooltip>
                                  <span className="text-sm">{route.name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      );
    },
    [
      loading,
      filteredPermissionDepartments,
      department,
      debouncedSearchQuery,
      isEditMode,
      selectedPermissions,
      handleGroupChange,
      handleRouteChange,
      checkboxColor,
    ]
  );

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
            {/* HEADER */}
            <div className="flex justify-between bg-gray-50 items-center mb-4 px-4 py-3 rounded-t-lg">
              <h2 className="text-lg font-bold">Manage Role Permissions</h2>
              <div className="flex items-center gap-4">
                <ProtectedAction requiredPermission={PERMISSIONS.EDIT_ROLE}>
                  <Tooltip title="Toggle Edit Mode">
                    <motion.button
                      onClick={handleEditClick}
                      aria-label="Toggle edit mode"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        highlightEditButton
                          ? "ring-2 ring-red-500"
                          : "hover:bg-gray-100"
                      } ${isEditMode ? "text-blue-500" : "text-green-500"}`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isEditMode ? (
                        <>
                          <FiEdit2 size={20} />
                          <span>Edit Mode</span>
                        </>
                      ) : (
                        <>
                          <FiEye size={20} />
                          <span>View Mode</span>
                        </>
                      )}
                    </motion.button>
                  </Tooltip>
                </ProtectedAction>
                <ProtectedAction requiredPermission={PERMISSIONS.REMOVE_ROLE}>
                  <Tooltip title="Delete Role">
                    <button
                      className="hover:text-gray-500"
                      onClick={handleDeleteClick}
                      aria-label="Delete role"
                      disabled={!selectedRoleObj || loading || isDeletingRole}
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </Tooltip>
                </ProtectedAction>
              </div>
            </div>
            <ProtectedSection
              requiredPermission={PERMISSIONS.GET_ALL_ROLE}
              title={"Select Permission"}
            >
              {/* DEPARTMENT / ROLE / DESCRIPTION */}
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
                    disabled={userTypeNormalized !== "admin"}
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
                    disabled={false} // Role selection is always enabled
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
              {/* PERMISSIONS LIST */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">Give Permission</h3>
                    <Tooltip title="Select or Deselect All Permissions">
                      <label
                        className="inline-flex items-center gap-2 cursor-pointer"
                        aria-label="Select all permissions"
                      >
                        <input
                          type="checkbox"
                          id="select-all-checkbox"
                          className={`form-checkbox ${checkboxColor}`}
                          disabled={!isEditMode}
                          onChange={(e) => handleGlobalChange(e.target.checked)}
                        />
                        <span className="text-sm font-medium">Select All</span>
                      </label>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip title="Search Permissions by Name">
                      <Search
                        placeholder="Search permission..."
                        onChange={handleSearchChange}
                        style={{ width: 200 }}
                        allowClear
                        aria-label="Search Permissions"
                      />
                    </Tooltip>
                    <Tooltip title="Expand to Full Screen">
                      <button
                        onClick={() => setIsFullScreen(true)}
                        aria-label="Expand permissions to full screen"
                        className="p-1 hover:text-gray-600"
                      >
                        <FiMaximize size={20} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                {renderPermissionsContent(false)}
              </div>
              {/* SAVE BUTTON */}
              <div className="flex justify-end">
                <Tooltip title="Save Permissions for This Role">
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
                </Tooltip>
              </div>
            </ProtectedSection>
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

      {/* Full Screen Modal for Permissions */}
      {isFullScreen &&
        ReactDOM.createPortal(
          <motion.div
            className="fixed inset-0 z-50 bg-white overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Full Screen Permissions Modal"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Permissions (Full Screen)</h2>
                <Tooltip title="Close Full Screen">
                  <button
                    onClick={() => setIsFullScreen(false)}
                    aria-label="Exit full screen"
                    className="p-1 hover:text-gray-600"
                  >
                    <FiMinimize size={20} />
                  </button>
                </Tooltip>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Tooltip title="Select or Deselect All Permissions">
                    <label
                      className="inline-flex items-center gap-2 cursor-pointer"
                      aria-label="Select all permissions"
                    >
                      <input
                        type="checkbox"
                        id="select-all-checkbox"
                        className={`form-checkbox ${checkboxColor}`}
                        disabled={!isEditMode}
                        onChange={(e) => handleGlobalChange(e.target.checked)}
                      />
                      <span className="text-sm font-medium">Select All</span>
                    </label>
                  </Tooltip>
                </div>
                <Tooltip title="Search Permissions by Name">
                  <Search
                    placeholder="Search permission..."
                    onChange={handleSearchChange}
                    style={{ width: 200 }}
                    allowClear
                    aria-label="Search Permissions in Full Screen"
                  />
                </Tooltip>
              </div>
              {renderPermissionsContent(true)}
            </div>
          </motion.div>,
          document.body
        )}
    </Layout>
  );
};

export default ManageRolePage;
