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
import { Button, Modal, Input } from "antd";
import {
  FullscreenOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Search } = Input;

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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [errors, setErrors] = useState({ roleName: "", description: "" });
  const [searchQueryMain, setSearchQueryMain] = useState("");
  const [searchQueryModal, setSearchQueryModal] = useState("");

  useEffect(() => {
    dispatch(getPermissionsThunk());
  }, [dispatch]);

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
        const departmentMatches = dept.department
          .toLowerCase()
          .includes(lowerQuery);

        const filteredGroups = dept.groups
          .map((group) => {
            const groupMatches = group.groupName
              .toLowerCase()
              .includes(lowerQuery);

            const filteredRoutes = group.routes.filter((route) =>
              route.name.toLowerCase().includes(lowerQuery)
            );

            if (groupMatches) {
              // Include all routes if group matches
              return { ...group };
            } else if (filteredRoutes.length > 0) {
              // Include only matching routes
              return { ...group, routes: filteredRoutes };
            } else {
              // Exclude this group
              return null;
            }
          })
          .filter((group) => group !== null);

        if (departmentMatches) {
          // Include entire department if department matches
          return { ...dept };
        } else if (filteredGroups.length > 0) {
          // Include department with only matching groups and routes
          return { ...dept, groups: filteredGroups };
        } else {
          // Exclude this department
          return null;
        }
      })
      .filter((dept) => dept !== null);
  };

  const filteredDisplayedDepartmentsMain = filterPermissions(
    displayedDepartments,
    searchQueryMain
  );
  const filteredDisplayedDepartmentsModal = filterPermissions(
    displayedDepartments,
    searchQueryModal
  );

  // Helper function to get all displayed route IDs based on filtered departments
  const getAllDisplayedRouteIds = (filteredDepartments) =>
    filteredDepartments.flatMap((deptObj) =>
      deptObj.groups.flatMap((groupObj) => groupObj.routes.map((r) => r._id))
    );

  const allDisplayedRouteIdsMain = getAllDisplayedRouteIds(
    filteredDisplayedDepartmentsMain
  );
  const allDisplayedRouteIdsModal = getAllDisplayedRouteIds(
    filteredDisplayedDepartmentsModal
  );

  const handleGlobalChangeMain = (isChecked) => {
    if (isChecked) {
      const uniqueRouteIds = Array.from(new Set(allDisplayedRouteIdsMain));
      setSelectedPermissions((prev) =>
        Array.from(new Set([...prev, ...uniqueRouteIds]))
      );
    } else {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !allDisplayedRouteIdsMain.includes(id))
      );
    }
  };

  const handleGlobalChangeModal = (isChecked) => {
    if (isChecked) {
      const uniqueRouteIds = Array.from(new Set(allDisplayedRouteIdsModal));
      setSelectedPermissions((prev) =>
        Array.from(new Set([...prev, ...uniqueRouteIds]))
      );
    } else {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !allDisplayedRouteIdsModal.includes(id))
      );
    }
  };

  const handleGroupChangeMain = (groupRoutes, isChecked) => {
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

  const handleGroupChangeModal = (groupRoutes, isChecked) => {
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

    // Initialize error object
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

    try {
      await dispatch(
        createRoleThunk({
          name: trimmedName,
          description: trimmedDesc,
          department: department.toLowerCase().toString(),
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
    const selectAllCheckboxMain = document.querySelector(
      "#select-all-checkbox-main"
    );
    if (selectAllCheckboxMain) {
      const allCount = allDisplayedRouteIdsMain.length;
      const selectedCount = selectedPermissions.filter((id) =>
        allDisplayedRouteIdsMain.includes(id)
      ).length;

      if (selectedCount === 0) {
        selectAllCheckboxMain.indeterminate = false;
        selectAllCheckboxMain.checked = false;
      } else if (selectedCount === allCount) {
        selectAllCheckboxMain.indeterminate = false;
        selectAllCheckboxMain.checked = true;
      } else {
        selectAllCheckboxMain.indeterminate = true;
      }
    }

    const selectAllCheckboxModal = document.querySelector(
      "#select-all-checkbox-modal"
    );
    if (selectAllCheckboxModal) {
      const allCount = allDisplayedRouteIdsModal.length;
      const selectedCount = selectedPermissions.filter((id) =>
        allDisplayedRouteIdsModal.includes(id)
      ).length;

      if (selectedCount === 0) {
        selectAllCheckboxModal.indeterminate = false;
        selectAllCheckboxModal.checked = false;
      } else if (selectedCount === allCount) {
        selectAllCheckboxModal.indeterminate = false;
        selectAllCheckboxModal.checked = true;
      } else {
        selectAllCheckboxModal.indeterminate = true;
      }
    }
  }, [
    selectedPermissions,
    allDisplayedRouteIdsMain,
    allDisplayedRouteIdsModal,
  ]);

  // Function to render the permissions selection section
  const renderPermissionsSection = (filteredDisplayedDepartments) => (
    <div className="flex-1 overflow-y-auto pr-2">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {filteredDisplayedDepartments.length === 0 && (
            <div className="text-sm text-gray-500">
              No Permissions Found for this Department.
            </div>
          )}

          {filteredDisplayedDepartments.map((deptObj) => (
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
                        className="form-checkbox text-pink-500"
                        onChange={(e) =>
                          handleGroupChangeModal(
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
                            className="form-checkbox text-pink-500"
                            checked={selectedPermissions.includes(route._id)}
                            onChange={(e) =>
                              handleRouteChange(route._id, e.target.checked)
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
  );

  return (
    <>
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
                className="w-full px-3 capitalize py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
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
                onChange={(e) => {
                  setRoleName(e.target.value);
                  if (errors.roleName) {
                    setErrors((prev) => ({ ...prev, roleName: "" }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none ${
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
              className={`w-full px-3 py-2 border rounded-lg h-32 resize-vertical focus:ring-2 focus:ring-pink-500 focus:outline-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              style={{ resize: "vertical" }}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Scrollable middle section (permissions) */}
        <div className="border border-gray-200 rounded-lg p-4 flex flex-col overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-pink-600">Give Permission</h3>

            <div className="flex flex-col md:flex-row items-center gap-2 mt-2 md:mt-0">
              {/* Search Input in Main Permissions Section */}
              <div className="w-full md:w-64">
                <Search
                  placeholder="Search permissions..."
                  value={searchQueryMain}
                  onChange={(e) => setSearchQueryMain(e.target.value)}
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="middle"
                  aria-label="Search permissions in main view"
                  style={{
                    borderColor: "#ec4899", // Tailwind's pink-500
                  }}
                  className="rounded-lg focus:ring-pink-500"
                />
              </div>

              {/* Full-Screen Button */}
              <Button
                type="text"
                icon={<FullscreenOutlined />}
                onClick={() => setIsFullScreen(true)}
                aria-label="Open permissions in full screen"
                className="text-pink-600 hover:text-pink-800"
              />

              {/* Select All Checkbox */}
              <label
                className="inline-flex items-center gap-2 cursor-pointer"
                aria-label="Select all permissions"
              >
                <span className="text-sm font-medium ">Select All</span>
                <input
                  type="checkbox"
                  id="select-all-checkbox-main"
                  className="form-checkbox text-pink-500"
                  onChange={(e) => handleGlobalChangeMain(e.target.checked)}
                />
              </label>
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center py-10">
              <Spinner />
            </div>
          ) : (
            renderPermissionsSection(filteredDisplayedDepartmentsMain)
          )}
        </div>

        {/* Always visible bottom section (action buttons) */}
        <div className="pt-2 mb-3 flex justify-end">
          <button
            onClick={handleCreate}
            className={`px-4 py-2 text-white rounded-lg bg-gradient-to-r from-pink-600 to-pink-800 hover:opacity-90 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create role"}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
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
          {/* Header with Close Button */}
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

          {/* Search Input in Full-Screen Modal */}
          <div className="mb-4">
            <Search
              placeholder="Search permissions..."
              value={searchQueryModal}
              onChange={(e) => setSearchQueryModal(e.target.value)}
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              aria-label="Search permissions in full screen"
              style={{
                borderColor: "#ec4899", // Tailwind's pink-500
              }}
              className="rounded-lg focus:ring-pink-500"
            />
          </div>

          {/* Select All Checkbox in Modal */}
          <div className="flex justify-between items-center mb-2">
            <div></div> {/* Placeholder for alignment */}
            <label
              className="inline-flex items-center gap-2 cursor-pointer"
              aria-label="Select all permissions in modal"
            >
              <span className="text-sm font-medium ">Select All</span>
              <input
                type="checkbox"
                id="select-all-checkbox-modal"
                className="form-checkbox text-pink-500"
                onChange={(e) => handleGlobalChangeModal(e.target.checked)}
              />
            </label>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center py-10">
              <Spinner />
            </div>
          ) : (
            renderPermissionsSection(filteredDisplayedDepartmentsModal)
          )}

          {/* Action Buttons in Full-Screen Modal */}
          <div className="pt-4 flex justify-end">
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
