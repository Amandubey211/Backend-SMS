// CreateRole.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Modal, Input } from "antd";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FullscreenOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import Spinner from "../Spinner";
import {
  createRoleThunk,
  getPermissionsThunk,
} from "../../../Store/Slices/Common/RBAC/rbacThunks";

const { Search } = Input;

const CreateRole = ({ onClose, department }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, permissions } = useSelector(
    (state) => state.admin.rbac
  );

  // Local States
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [errors, setErrors] = useState({ roleName: "", description: "" });
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [searchQueryMain, setSearchQueryMain] = useState("");
  const [searchQueryModal, setSearchQueryModal] = useState("");

  // Fetch Permissions initially
  useEffect(() => {
    dispatch(getPermissionsThunk());
  }, [dispatch]);

  // Filter departments by the chosen `department`
  const permissionDepartments = permissions || [];
  const displayedDepartments = permissionDepartments.filter(
    (deptObj) => deptObj.department.toLowerCase() === department.toLowerCase()
  );

  // Helper function to filter permissions based on search query
  const filterPermissions = (departments, query) => {
    if (!query) return departments;

    const lowerQuery = query.toLowerCase();

    return departments
      .map((dept) => {
        const deptMatches = dept.department.toLowerCase().includes(lowerQuery);

        const filteredGroups = dept.groups
          .map((group) => {
            const groupMatches = group.groupName
              .toLowerCase()
              .includes(lowerQuery);

            const filteredRoutes = group.routes.filter((route) =>
              route.name.toLowerCase().includes(lowerQuery)
            );

            // If group name matches, include all routes
            if (groupMatches) {
              return { ...group };
            }
            // Else if some routes match, include only those
            if (filteredRoutes.length > 0) {
              return { ...group, routes: filteredRoutes };
            }
            // Exclude group if no match
            return null;
          })
          .filter(Boolean);

        // If department name matches fully, include entire department
        if (deptMatches) {
          return { ...dept };
        }
        // Else if some groups match, include partial dept
        if (filteredGroups.length > 0) {
          return { ...dept, groups: filteredGroups };
        }
        // Exclude dept if no match
        return null;
      })
      .filter(Boolean);
  };

  // Filtered data for main view and modal
  const filteredDisplayedDepartmentsMain = filterPermissions(
    displayedDepartments,
    searchQueryMain
  );
  const filteredDisplayedDepartmentsModal = filterPermissions(
    displayedDepartments,
    searchQueryModal
  );

  // Flatten route IDs from each group
  const getAllDisplayedRouteIds = (filteredDeps) =>
    filteredDeps.flatMap((dept) =>
      dept.groups.flatMap((group) => group.routes.map((r) => r._id))
    );

  const allDisplayedRouteIdsMain = getAllDisplayedRouteIds(
    filteredDisplayedDepartmentsMain
  );
  const allDisplayedRouteIdsModal = getAllDisplayedRouteIds(
    filteredDisplayedDepartmentsModal
  );

  // Global select/deselect in main section
  const handleGlobalChangeMain = (isChecked) => {
    if (isChecked) {
      // Combine existing and new route IDs, ensuring uniqueness
      setSelectedPermissions((prev) =>
        Array.from(
          new Set([
            ...prev,
            ...allDisplayedRouteIdsMain, // add all displayed routes
          ])
        )
      );
    } else {
      // Remove all displayed route IDs from selection
      setSelectedPermissions((prev) =>
        prev.filter((id) => !allDisplayedRouteIdsMain.includes(id))
      );
    }
  };

  // Global select/deselect in modal
  const handleGlobalChangeModal = (isChecked) => {
    if (isChecked) {
      setSelectedPermissions((prev) =>
        Array.from(
          new Set([
            ...prev,
            ...allDisplayedRouteIdsModal, // add all displayed routes
          ])
        )
      );
    } else {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !allDisplayedRouteIdsModal.includes(id))
      );
    }
  };

  // Group-level select/deselect (e.g., entire group)
  const handleGroupChange = (groupRoutes, isChecked) => {
    const groupRouteIds = groupRoutes.map((r) => r._id);
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      groupRouteIds.forEach((id) =>
        isChecked ? newSet.add(id) : newSet.delete(id)
      );
      return Array.from(newSet);
    });
  };

  // Single route-level selection toggle
  const handleRouteChange = (routeId, isChecked) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      isChecked ? newSet.add(routeId) : newSet.delete(routeId);
      return Array.from(newSet);
    });
  };

  // Reflect partial select states in checkboxes
  useEffect(() => {
    const manageSelectAllCheckbox = (id, displayedIds) => {
      const checkbox = document.querySelector(`#${id}`);
      if (!checkbox) return;

      const totalCount = displayedIds.length;
      const selectedCount = selectedPermissions.filter((permId) =>
        displayedIds.includes(permId)
      ).length;

      if (selectedCount === 0) {
        checkbox.checked = false;
        checkbox.indeterminate = false;
      } else if (selectedCount === totalCount) {
        checkbox.checked = true;
        checkbox.indeterminate = false;
      } else {
        checkbox.indeterminate = true;
      }
    };

    // Main
    manageSelectAllCheckbox(
      "select-all-checkbox-main",
      allDisplayedRouteIdsMain
    );
    // Modal
    manageSelectAllCheckbox(
      "select-all-checkbox-modal",
      allDisplayedRouteIdsModal
    );
  }, [
    selectedPermissions,
    allDisplayedRouteIdsMain,
    allDisplayedRouteIdsModal,
  ]);

  // Handle create role click
  const handleCreate = async () => {
    const trimmedName = roleName.trim();
    const trimmedDesc = description.trim();

    const newErrors = { roleName: "", description: "" };
    let hasError = false;

    if (!trimmedName) {
      newErrors.roleName = "Role name is required.";
      hasError = true;
    }
    if (!trimmedDesc) {
      newErrors.description = "Description is required.";
      hasError = true;
    }
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    // Clear previous errors
    setErrors({ roleName: "", description: "" });

    // Update department: if department (lowercase) is "otherstaff", send "otherStaff", otherwise lowercase
    const departmentPayload =
      department.toLowerCase() === "staff" ? "staff" : department.toLowerCase();

    try {
      await dispatch(
        createRoleThunk({
          name: trimmedName,
          description: trimmedDesc,
          department: departmentPayload,
          permission: selectedPermissions,
        })
      ).unwrap();

      toast.success("Role created successfully!");
      setRoleName("");
      setDescription("");
      onClose(); // closes the CreateRole UI

      // Navigate to Manage Roles page in "edit mode"
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

  /**
   * Renders the permission selection UI (reused in main and modal).
   */
  const renderPermissionsSection = (filteredDeps, handleGroupChangeFn) => {
    if (filteredDeps?.length === 0) {
      return (
        <div className="text-sm text-gray-500 mt-4">
          No Permissions Found for this Department.
        </div>
      );
    }

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {filteredDeps?.map((deptObj) => (
            <div key={deptObj.department}>
              <h4 className="text-sm font-semibold  uppercase">
                {deptObj.department}
              </h4>
              {deptObj.groups.map((groupObj) => {
                // Check if all routes are selected or partially selected
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
                    className="border border-gray-200 rounded p-3 mb-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        className="form-checkbox text-pink-500"
                        onChange={(e) =>
                          handleGroupChangeFn(groupObj.routes, e.target.checked)
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
                    {/* Individual routes */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {groupObj.routes.map((route) => (
                        <label
                          key={route._id}
                          className="inline-flex items-center space-x-2"
                          aria-label={`Permission: ${route.name}`}
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox text-pink-500"
                            checked={selectedPermissions.includes(route._id)}
                            onChange={(e) =>
                              handleRouteChange(route._id, e.target.checked)
                            }
                          />
                          <span className="text-xs md:text-sm">
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
    );
  };

  return (
    <>
      {/* Main Container with sticky footer */}
      <motion.div
        className="flex flex-col h-full bg-white"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* 1) Top: Role Details */}
        <div className="p-2 px-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              {/* Department */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  readOnly
                  className="w-full px-3 capitalize py-2 border border-gray-300 rounded bg-gray-100 text-gray-700"
                />
              </div>
              {/* Role Name */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  placeholder="Enter role"
                  value={roleName}
                  onChange={(e) => {
                    setRoleName(e.target.value);
                    if (errors.roleName) {
                      setErrors((prev) => ({ ...prev, roleName: "" }));
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-pink-500 focus:outline-none ${
                    errors.roleName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.roleName && (
                  <p className="text-red-500 text-xs mt-1">{errors.roleName}</p>
                )}
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
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) {
                    setErrors((prev) => ({ ...prev, description: "" }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded h-32 resize-vertical focus:ring-2 focus:ring-pink-500 focus:outline-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 2) Middle: Permissions Selection + "Select All" & Search */}
        <div className="flex flex-col flex-1 overflow-hidden px-4 py-3">
          {/* Header Row: "Give Permission", "Select All", Search, Fullscreen */}
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            {/* Left: Title + Select All */}
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-pink-600">
                Give Permission
              </h3>
              <label
                className="inline-flex items-center gap-2 cursor-pointer"
                aria-label="Select all permissions"
              >
                <span className="text-xs font-medium">Select All</span>
                <input
                  type="checkbox"
                  id="select-all-checkbox-main"
                  className="form-checkbox text-pink-500"
                  onChange={(e) => handleGlobalChangeMain(e.target.checked)}
                />
              </label>
              <Button
                type="text"
                icon={<FullscreenOutlined />}
                onClick={() => setIsFullScreen(true)}
                aria-label="Open permissions in full screen"
                className="text-pink-600 hover:text-pink-800"
              />
            </div>
            {/* Right: Search + Full-Screen Button */}
            <div className="flex items-center gap-2">
              <Search
                placeholder="Search permissions..."
                value={searchQueryMain}
                onChange={(e) => setSearchQueryMain(e.target.value)}
                allowClear
                enterButton={<SearchOutlined />}
                size="middle"
                aria-label="Search permissions in main view"
                className="rounded focus:ring-pink-500"
              />
              <button
                onClick={handleCreate}
                disabled={loading}
                className={`px-4 w-40 py-1 text-white rounded bg-gradient-to-r from-pink-600 to-pink-800 hover:opacity-90 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creating..." : "Create Role"}
              </button>
            </div>
          </div>

          {/* Scrollable Permissions List */}
          <div className="flex-1 overflow-auto border border-gray-200 rounded p-3">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Spinner />
              </div>
            ) : (
              renderPermissionsSection(
                filteredDisplayedDepartmentsMain,
                (routes, checked) => handleGroupChange(routes, checked)
              )
            )}
          </div>
        </div>

        {/* 3) Sticky Bottom Bar: Create Role Button */}
        <div className="sticky bottom-0 left-0 right-0 bg-white p-4 border-t flex justify-end z-10"></div>

        {/* Show potential error at the bottom (optional) */}
        {error && (
          <div className="text-red-500 text-sm px-4 pb-2 mt-1">{error}</div>
        )}
      </motion.div>

      {/* Full-Screen Modal */}
      <Modal
        visible={isFullScreen}
        onCancel={() => setIsFullScreen(false)}
        footer={null}
        width="100%"
        style={{
          top: 0,
          padding: 0,
          height: "100vh",
          maxWidth: "100%",
        }}
        bodyStyle={{
          height: "100vh",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        closable={false}
        maskClosable={false}
        destroyOnClose
      >
        <div className="flex flex-col h-full">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-pink-600">
              Manage Permissions
            </h2>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setIsFullScreen(false)}
              aria-label="Close full screen"
              className="text-pink-600 hover:text-pink-800"
            />
          </div>

          {/* Modal Search */}
          <div className="mb-4">
            <Search
              placeholder="Search permissions..."
              value={searchQueryModal}
              onChange={(e) => setSearchQueryModal(e.target.value)}
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              aria-label="Search permissions in full screen"
              className="rounded focus:ring-pink-500 w-full md:w-96"
            />
          </div>

          {/* Modal Select All */}
          <div className="flex justify-between items-center mb-2">
            {/* spacer div to center "Select All" horizontally */}
            <div />
            <label
              className="inline-flex items-center gap-2 cursor-pointer"
              aria-label="Select all permissions in modal"
            >
              <span className="text-sm font-medium">Select All</span>
              <input
                type="checkbox"
                id="select-all-checkbox-modal"
                className="form-checkbox text-pink-500"
                onChange={(e) => handleGlobalChangeModal(e.target.checked)}
              />
            </label>
          </div>

          {/* Modal Permissions List */}
          <div className="flex-1 overflow-auto border border-gray-200 rounded p-3 mb-4">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Spinner />
              </div>
            ) : (
              renderPermissionsSection(
                filteredDisplayedDepartmentsModal,
                (routes, checked) => handleGroupChange(routes, checked)
              )
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end">
            <Button
              type="primary"
              onClick={() => setIsFullScreen(false)}
              className="bg-gradient-to-r from-pink-600 to-pink-800 hover:opacity-90"
              aria-label="Done managing permissions"
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateRole;
