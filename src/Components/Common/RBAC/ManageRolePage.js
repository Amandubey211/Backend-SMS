import React, { useEffect, useState, useMemo, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  FiEdit2,
  FiTrash2,
  FiMaximize,
  FiMinimize,
  FiEye,
  FiEdit,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { Tooltip, Input, Modal, Select, Tag, Skeleton, Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import DeleteModal from "../DeleteModal";
import ProtectedSection from "../../../Routes/ProtectedRoutes/ProtectedSection";
import ProtectedAction from "../../../Routes/ProtectedRoutes/ProtectedAction";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import {
  getAllRolesThunk,
  getPermissionsThunk,
  deleteRoleThunk,
  editRoleThunk,
} from "../../../Store/Slices/Common/RBAC/rbacThunks";
import { PERMISSIONS } from "../../../config/permission";

const { Search, TextArea } = Input;
const { Option } = Select;

/**
 * Hook: Debounced value
 */
const useDebouncedValue = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
};

/**
 * Custom skeleton to mimic the final PermissionList layout
 */
const PermissionSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx}>
          <Skeleton.Input
            active
            style={{ width: 180, marginBottom: 10 }}
            size="small"
          />
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton.Input active style={{ width: 140 }} size="small" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((__, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton.Input
                    active
                    style={{ width: 20, marginRight: 8 }}
                    size="small"
                  />
                  <Skeleton.Input active style={{ width: 100 }} size="small" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * PermissionList Component
 */
const PermissionList = ({
  loading,
  filteredPermissionDepartments,
  department,
  debouncedSearchQuery,
  isEditMode,
  selectedPermissions,
  handleGroupChange,
  handleRouteChange,
  checkboxColor,
  inModal = false,
  hasRoleSelected,
}) => {
  if (loading) {
    return <PermissionSkeleton />;
  }

  // If user selected a department that doesn't exist, or there's no data
  if (!filteredPermissionDepartments?.length && department) {
    return (
      <div className="text-sm text-gray-500">
        No Permission Or Department Found.
      </div>
    );
  }

  // In normal mode, limit to 70% of viewport height; in full-screen, fill height
  const containerClasses = inModal
    ? "overflow-y-auto pr-2 h-full"
    : "overflow-y-auto pr-2 max-h-[70vh]";

  return (
    <div className={containerClasses}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {filteredPermissionDepartments
            ?.filter(
              (deptObj) => !department || deptObj.department === department
            )
            .map((deptObj) => (
              <div key={deptObj.department}>
                <h4 className="text-xl font-semibold mb-2">
                  {deptObj.department.charAt(0).toUpperCase() +
                    deptObj.department.slice(1)}
                </h4>
                {deptObj.groups?.map((groupObj) => {
                  const filteredRoutes = groupObj.routes?.filter((route) =>
                    route.name
                      .toLowerCase()
                      .includes(debouncedSearchQuery.toLowerCase())
                  );

                  const allGroupSelected =
                    filteredRoutes?.length > 0 &&
                    filteredRoutes.every((r) =>
                      selectedPermissions.includes(r._id)
                    );
                  const someSelected =
                    !allGroupSelected &&
                    filteredRoutes?.some((r) =>
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
                              filteredRoutes?.length > 0 && allGroupSelected
                            }
                            disabled={
                              !isEditMode ||
                              !hasRoleSelected ||
                              (filteredRoutes?.length || 0) < 1
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
                      {filteredRoutes?.length === 0 ? (
                        <div className="text-xs text-gray-500">
                          No routes match your search.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {filteredRoutes?.map((route) => (
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
                                  disabled={!isEditMode || !hasRoleSelected}
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
};

/**
 * RoleSelect
 */
const RoleSelect = ({ roles, value, onChange, groupRoleNames, error }) => (
  <Select
    value={value}
    onChange={onChange}
    placeholder="Select a role"
    style={{ width: "100%", minHeight: "40px" }}
    showSearch
    optionFilterProp="children"
    filterOption={(input, option) =>
      (option?.children?.[0] ?? "").toLowerCase().includes(input.toLowerCase())
    }
  >
    {error && <Option disabled>{error}</Option>}
    {roles?.map((roleObj) => {
      const isGroupRole = groupRoleNames.includes(roleObj.name);
      return (
        <Option key={roleObj.id} value={roleObj.name} disabled={isGroupRole}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span>{roleObj.name}</span>
            {isGroupRole && (
              <Tag
                color="red"
                style={{ marginLeft: "auto", fontSize: "0.75rem" }}
              >
                Restricted Role
              </Tag>
            )}
          </div>
        </Option>
      );
    })}
  </Select>
);

/**
 * DepartmentSelect
 */
const DepartmentSelect = ({
  department,
  onChange,
  departmentNames,
  disabled,
}) => (
  <Select
    value={department}
    onChange={onChange}
    placeholder="Select Department"
    style={{ width: "100%", minHeight: "40px" }}
    disabled={disabled}
  >
    <Option value="">All Departments</Option>
    {departmentNames?.map((dept) => (
      <Option key={dept} value={dept}>
        {dept.charAt(0).toUpperCase() + dept.slice(1)}
      </Option>
    ))}
  </Select>
);

/**
 * HeaderActions
 */
const HeaderActions = ({
  isEditMode,
  onToggleEdit,
  onDelete,
  disableEdit,
  disableDelete,
  computedSelectedRoleObj,
  groupRoleNames,
  highlightEditButton,
}) => {
  const isGroupRole =
    computedSelectedRoleObj &&
    groupRoleNames.includes(computedSelectedRoleObj.name);

  return (
    <div className="flex justify-between bg-gray-50 items-center mb-4 px-4 py-3 rounded-t-lg">
      <h2 className="text-lg font-bold">Manage Role Permissions</h2>
      <div className="flex items-center gap-4">
        {/* Toggle Edit Mode (still protected by EDIT_ROLE) */}
        <ProtectedAction requiredPermission={PERMISSIONS.EDIT_ROLE}>
          <Tooltip
            title={isGroupRole ? "Cannot edit group role" : "Toggle Edit Mode"}
          >
            <motion.button
              onClick={onToggleEdit}
              aria-label="Toggle edit mode"
              disabled={disableEdit || isGroupRole}
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

        {/* Delete Role (only show if in edit mode & user has permission & not a group role) */}
        {isEditMode && (
          <ProtectedAction requiredPermission={PERMISSIONS.REMOVE_ROLE}>
            <Tooltip
              title={isGroupRole ? "Cannot delete group role" : "Delete Role"}
            >
              <button
                className="hover:text-gray-500"
                onClick={onDelete}
                aria-label="Delete role"
                disabled={disableDelete || isGroupRole}
              >
                <FiTrash2 size={20} />
              </button>
            </Tooltip>
          </ProtectedAction>
        )}
      </div>
    </div>
  );
};

/**
 * FullScreenModal
 */
const FullScreenModal = ({
  isOpen,
  onClose,
  children,
  onSetPermissions,
  disableSetPermissions,
  isSettingPermissions,
}) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <motion.div
      className="fixed inset-0 z-50 bg-white overflow-auto h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Full Screen Permissions Modal"
    >
      <div className="p-4 h-full flex flex-col">
        {/* Top bar with "Set Permissions" + Close */}
        <div className="flex justify-between items-center mb-4">
          <div />
          <div className="flex items-center gap-2">
            {/* Wrap the button in ProtectedAction to hide from unauthorized users */}
            <ProtectedAction requiredPermission={PERMISSIONS.EDIT_ROLE}>
              <Tooltip title="Save Permissions for This Role">
                <Button
                  type="primary"
                  onClick={onSetPermissions}
                  disabled={disableSetPermissions}
                  loading={isSettingPermissions}
                >
                  {isSettingPermissions ? "Saving..." : "Set Permissions"}
                </Button>
              </Tooltip>
            </ProtectedAction>
            <Tooltip title="Close Full Screen">
              <button
                onClick={onClose}
                aria-label="Exit full screen"
                className="p-1 hover:text-gray-600"
              >
                <FiMinimize size={20} />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </motion.div>,
    document.body
  );
};

const ManageRolePage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  useNavHeading("User", "Manage Role");

  // Global state
  const userType = useSelector((state) => state.common.auth?.role);
  const userRoles = useSelector((state) => state.common.auth?.userRoles);
  const { roles, permissions, loading, error } = useSelector(
    (state) => state.admin.rbac
  );
  const userTypeNormalized = userType?.toLowerCase() || "";

  // Pre-fill from location.state (with optional chaining for safety)
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
  const [highlightEditButton, setHighlightEditButton] = useState(false);

  // For the "Add Description" modal
  const [descModalOpen, setDescModalOpen] = useState(false);
  const [descModalValue, setDescModalValue] = useState("");

  // Debounced search
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  // Compute group role names
  const groupRoleNames = useMemo(() => {
    if (!Array.isArray(userRoles)) return [];
    return userRoles.reduce((acc, curr) => {
      if (Array.isArray(curr.role)) {
        return [...acc, ...curr.role];
      }
      return acc;
    }, []);
  }, [userRoles]);

  // Load roles/permissions
  useEffect(() => {
    dispatch(getAllRolesThunk());
    dispatch(getPermissionsThunk());
  }, [dispatch]);

  // Force department if not admin
  useEffect(() => {
    if (userTypeNormalized !== "admin") {
      setDepartment(userTypeNormalized);
    }
  }, [userTypeNormalized]);

  // Flatten roles
  const availableRoles = useMemo(() => {
    if (!Array.isArray(roles)) return [];
    return roles.flatMap(
      (deptObj) =>
        deptObj.roles?.map((r) => ({
          ...r,
          department: deptObj.department?.toLowerCase() || "",
        })) || []
    );
  }, [roles]);

  // Normalize permission departments
  const permissionDepartments = useMemo(() => {
    if (!Array.isArray(permissions)) return [];
    return permissions.map((dept) => ({
      ...dept,
      department: dept.department?.toLowerCase() || "",
    }));
  }, [permissions]);

  // Filter permissions by user type
  const filteredPermissionDepartments = useMemo(() => {
    if (!permissionDepartments?.length) return [];
    return userTypeNormalized === "admin"
      ? permissionDepartments
      : permissionDepartments.filter(
          (deptObj) => deptObj.department === userTypeNormalized
        );
  }, [permissionDepartments, userTypeNormalized]);

  // Department names
  const departmentNames = useMemo(
    () => (permissionDepartments || []).map((d) => d.department),
    [permissionDepartments]
  );

  // Filter roles by department
  const filteredRoles = useMemo(() => {
    if (!department) return availableRoles;
    return availableRoles.filter((r) => r.department === department);
  }, [availableRoles, department]);

  // Selected role object
  const computedSelectedRoleObj = useMemo(() => {
    return filteredRoles?.find((r) => r.name === role);
  }, [filteredRoles, role]);

  // Check if selected role is group role
  const isGroupRoleSelected =
    computedSelectedRoleObj &&
    groupRoleNames.includes(computedSelectedRoleObj.name);

  // Update local states on role change
  useEffect(() => {
    if (computedSelectedRoleObj) {
      setSelectedPermissions(computedSelectedRoleObj.permission || []);
      setOriginalPermissions(computedSelectedRoleObj.permission || []);
      setDescription(computedSelectedRoleObj.description || "");
    } else {
      setSelectedPermissions([]);
      setOriginalPermissions([]);
      setDescription("");
    }
  }, [computedSelectedRoleObj]);

  // All route IDs for "Select All"
  const allDisplayedRouteIds = useMemo(() => {
    return filteredPermissionDepartments
      ?.filter((deptObj) => !department || deptObj.department === department)
      .flatMap(
        (deptObj) =>
          deptObj.groups?.flatMap((groupObj) =>
            groupObj.routes?.map((r) => r._id)
          ) || []
      );
  }, [filteredPermissionDepartments, department]);

  // Whether a role is currently selected
  const hasRoleSelected = !!computedSelectedRoleObj;

  // Checkbox color
  const checkboxColor = isEditMode ? "text-blue-500" : "text-green-500";

  /**
   * Handlers
   */
  const handleSearchChange = useCallback((e) => {
    // Keep search always enabled
    setSearchQuery(e.target.value);
  }, []);

  const handleGlobalChange = useCallback(
    (isChecked) => {
      if (!isEditMode) {
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
              <span className="text-green-500 font-semibold">View Mode</span>.
              To modify permissions, please switch to{" "}
              <span className="text-blue-500 font-semibold">Edit Mode</span>.
            </div>
          ),
          okText: "Switch",
          cancelText: "Cancel",
          centered: true,
          width: 600,
          okButtonProps: {
            className:
              "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
          },
          onOk: () => {
            setIsEditMode(true);
          },
        });
        return;
      }
      if (isChecked) {
        setSelectedPermissions((prev) =>
          Array.from(new Set([...prev, ...(allDisplayedRouteIds || [])]))
        );
      } else {
        setSelectedPermissions((prev) =>
          prev.filter((id) => !(allDisplayedRouteIds || []).includes(id))
        );
      }
    },
    [isEditMode, allDisplayedRouteIds]
  );

  const handleGroupChange = useCallback(
    (groupRoutes, isChecked) => {
      if (!isEditMode) {
        Modal.confirm({
          title: (
            <div className="flex items-center">
              <FiEdit2 className="text-purple-500 mr-3" size={30} />
              <span className="text-2xl font-bold">Switch to Edit Mode</span>
            </div>
          ),
          content: (
            <div className="text-xl">
              You are in View Mode. To modify permissions, please switch to Edit
              Mode.
            </div>
          ),
          okText: "Switch",
          cancelText: "Cancel",
          centered: true,
          width: 600,
          okButtonProps: {
            className:
              "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
          },
          onOk: () => {
            setIsEditMode(true);
          },
        });
        return;
      }
      const groupRouteIds = (groupRoutes || []).map((r) => r._id);
      setSelectedPermissions((prev) => {
        const prevSet = new Set(prev);
        groupRouteIds.forEach((id) => {
          isChecked ? prevSet.add(id) : prevSet.delete(id);
        });
        return Array.from(prevSet);
      });
    },
    [isEditMode]
  );

  const handleRouteChange = useCallback(
    (routeId, isChecked) => {
      if (!isEditMode) {
        Modal.confirm({
          title: (
            <div className="flex items-center">
              <FiEdit2 className="text-purple-500 mr-3" size={30} />
              <span className="text-2xl font-bold">Switch to Edit Mode</span>
            </div>
          ),
          content: (
            <div className="text-xl">
              You are in View Mode. To modify permissions, please switch to Edit
              Mode.
            </div>
          ),
          okText: "Switch",
          cancelText: "Cancel",
          centered: true,
          width: 600,
          okButtonProps: {
            className:
              "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
          },
          onOk: () => {
            setIsEditMode(true);
          },
        });
        return;
      }
      setSelectedPermissions((prev) => {
        const prevSet = new Set(prev);
        isChecked ? prevSet.add(routeId) : prevSet.delete(routeId);
        return Array.from(prevSet);
      });
    },
    [isEditMode]
  );

  const handleSetPermissions = async () => {
    if (!computedSelectedRoleObj) {
      toast.error("Please select a role before setting permissions");
      return;
    }
    setIsSettingPermissions(true);
    try {
      const updates = {
        name: role,
        permission: selectedPermissions,
        description,
      };
      await dispatch(
        editRoleThunk({ roleId: computedSelectedRoleObj.id, updates })
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
    if (!computedSelectedRoleObj) {
      toast.error("Please select a role before attempting to delete");
      return;
    }
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!computedSelectedRoleObj) return;
    setIsDeletingRole(true);
    try {
      await dispatch(deleteRoleThunk(computedSelectedRoleObj.id)).unwrap();
      if (role === computedSelectedRoleObj.name) setRole("");
      toast.success("Role deleted successfully");
    } catch (err) {
      console.error("Error deleting role:", err);
      toast.error("Failed to delete role");
    } finally {
      setIsDeletingRole(false);
      setDeleteModalOpen(false);
    }
  };

  const handleToggleEdit = () => {
    if (isGroupRoleSelected) {
      // No toggling if group role
      return;
    }
    if (isEditMode) {
      // Check for unsaved changes
      const sortedSelected = [...selectedPermissions].sort();
      const sortedOriginal = [...originalPermissions].sort();
      const changesUnsaved =
        JSON.stringify(sortedSelected) !== JSON.stringify(sortedOriginal) ||
        description !== (computedSelectedRoleObj?.description || "");

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
            setDescription(computedSelectedRoleObj?.description || "");
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

  const handleDepartmentChange = (value) => {
    setDepartment(value?.toLowerCase() || "");
    setRole("");
    setSelectedPermissions([]);
    setOriginalPermissions([]);
    setDescription("");
  };

  const openDescModal = () => {
    setDescModalValue(description || "");
    setDescModalOpen(true);
  };

  const handleDescModalOk = () => {
    setDescription(descModalValue);
    setDescModalOpen(false);
  };

  // Word count for the description modal
  const maxWords = 100;
  const splitted = descModalValue?.trim().split(/\s+/) || [];
  const wordCount = splitted[0] === "" ? 0 : splitted.length;
  const wordsLeft = Math.max(0, maxWords - wordCount);

  return (
    <Layout title="Manage Roles | Student Diwan">
      <DashLayout>
        <div className="min-h-screen relative">
          <motion.div
            className="bg-white rounded-lg w-full p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header */}
            <HeaderActions
              isEditMode={isEditMode}
              onToggleEdit={handleToggleEdit}
              onDelete={handleDeleteClick}
              disableEdit={isGroupRoleSelected}
              disableDelete={
                !computedSelectedRoleObj ||
                loading ||
                isDeletingRole ||
                isGroupRoleSelected
              }
              computedSelectedRoleObj={computedSelectedRoleObj}
              groupRoleNames={groupRoleNames}
              highlightEditButton={highlightEditButton}
            />

            <ProtectedSection
              requiredPermission={PERMISSIONS.GET_ALL_ROLE}
              title="Select Permission"
            >
              {/* Top Filters Row */}
              <div className="grid grid-cols-3 gap-4 items-center mb-4">
                {/* Department */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Department
                  </label>
                  <DepartmentSelect
                    department={department}
                    onChange={handleDepartmentChange}
                    departmentNames={departmentNames}
                    disabled={userTypeNormalized !== "admin"}
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Role
                  </label>
                  <RoleSelect
                    roles={filteredRoles}
                    value={role}
                    onChange={setRole}
                    groupRoleNames={groupRoleNames}
                    error={error}
                  />
                </div>

                {/* Add Description */}
                <div>
                  <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
                    Add Description
                    {isEditMode && hasRoleSelected && !isGroupRoleSelected && (
                      <Tooltip title="Add / Edit Description">
                        <button
                          onClick={openDescModal}
                          className="p-1 hover:text-gray-600"
                        >
                          <FiEdit size={16} />
                        </button>
                      </Tooltip>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder="Write here"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none px-3"
                    style={{ minHeight: "40px" }}
                    disabled={
                      !isEditMode ||
                      !computedSelectedRoleObj ||
                      isGroupRoleSelected
                    }
                    aria-label="Description"
                  />
                </div>
              </div>

              {/* Permission Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">Give Permission</h3>
                    <Tooltip title="Select or Deselect All Permissions">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          id="select-all-checkbox"
                          className={`form-checkbox ${checkboxColor}`}
                          disabled={!isEditMode || !hasRoleSelected}
                          onChange={(e) => handleGlobalChange(e.target.checked)}
                        />
                        <span className="text-sm font-medium">Select All</span>
                      </label>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip title="Search Permissions by Name">
                      {/* Search is always enabled now (removed the !hasRoleSelected check) */}
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
                        disabled={!hasRoleSelected}
                      >
                        <FiMaximize size={20} />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <PermissionList
                  loading={loading}
                  filteredPermissionDepartments={filteredPermissionDepartments}
                  department={department}
                  debouncedSearchQuery={debouncedSearchQuery}
                  isEditMode={isEditMode}
                  selectedPermissions={selectedPermissions}
                  handleGroupChange={handleGroupChange}
                  handleRouteChange={handleRouteChange}
                  checkboxColor={checkboxColor}
                  inModal={false}
                  hasRoleSelected={hasRoleSelected}
                />
              </div>
            </ProtectedSection>
          </motion.div>

          {/* 
            "Set Permissions" button (Fixed at bottom-right).
            Wrap with ProtectedAction so only those with EDIT_ROLE permission see it.
          */}
          {!isGroupRoleSelected && (
            <ProtectedAction requiredPermission={PERMISSIONS.EDIT_ROLE}>
              <div className="fixed bottom-4 right-4 z-50">
                <Tooltip title="Save Permissions for This Role">
                  <Button
                    type="primary"
                    onClick={handleSetPermissions}
                    disabled={
                      !isEditMode ||
                      isSettingPermissions ||
                      !computedSelectedRoleObj
                    }
                    loading={isSettingPermissions}
                  >
                    {isSettingPermissions ? "Saving..." : "Set Permissions"}
                  </Button>
                </Tooltip>
              </div>
            </ProtectedAction>
          )}
        </div>
      </DashLayout>

      {/* Delete Role Modal */}
      {computedSelectedRoleObj && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title={computedSelectedRoleObj.name}
        />
      )}

      {/* Full Screen Modal */}
      <FullScreenModal
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        onSetPermissions={handleSetPermissions}
        disableSetPermissions={
          !isEditMode ||
          isSettingPermissions ||
          !computedSelectedRoleObj ||
          isGroupRoleSelected
        }
        isSettingPermissions={isSettingPermissions}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Tooltip title="Select or Deselect All Permissions">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="select-all-checkbox"
                  className={`form-checkbox ${checkboxColor}`}
                  disabled={!isEditMode || !hasRoleSelected}
                  onChange={(e) => handleGlobalChange(e.target.checked)}
                />
                <span className="text-sm font-medium">Select All</span>
              </label>
            </Tooltip>
          </div>
          <Tooltip title="Search Permissions by Name">
            {/* Search always enabled here as well */}
            <Search
              placeholder="Search permission..."
              onChange={handleSearchChange}
              style={{ width: 200 }}
              allowClear
              aria-label="Search Permissions in Full Screen"
            />
          </Tooltip>
        </div>
        <PermissionList
          loading={loading}
          filteredPermissionDepartments={filteredPermissionDepartments}
          department={department}
          debouncedSearchQuery={debouncedSearchQuery}
          isEditMode={isEditMode}
          selectedPermissions={selectedPermissions}
          handleGroupChange={handleGroupChange}
          handleRouteChange={handleRouteChange}
          checkboxColor={checkboxColor}
          inModal={true}
          hasRoleSelected={hasRoleSelected}
        />
      </FullScreenModal>

      {/* Add Description Modal */}
      <Modal
        title="Add Description"
        visible={descModalOpen}
        centered
        onOk={handleDescModalOk}
        onCancel={() => setDescModalOpen(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <TextArea
          value={descModalValue}
          onChange={(e) => setDescModalValue(e.target.value)}
          rows={5}
          placeholder="Write a detailed description..."
        />
        <div className="mt-2 text-right text-gray-500">
          Words left: {wordsLeft}
        </div>
      </Modal>
    </Layout>
  );
};

export default ManageRolePage;
