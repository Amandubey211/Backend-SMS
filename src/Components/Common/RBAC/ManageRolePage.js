import React, { useState } from "react";
import { FiRefreshCcw, FiEdit2, FiTrash2 } from "react-icons/fi";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";

const ManageRolePage = () => {
  const [permissionsExpanded, setPermissionsExpanded] = useState(false);
  const [isAlertEnabled, setAlertEnabled] = useState(false);
  const [department, setDepartment] = useState("Default by all");
  const [role, setRole] = useState("Default by all");

  const togglePermissions = () => {
    setPermissionsExpanded(!permissionsExpanded);
  };

  const handleAlertToggle = () => {
    setAlertEnabled(!isAlertEnabled);
  };

  return (
    <Layout title="Manage Roles">
      <DashLayout>
        <div className="p-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Manage Roles</h1>
          </div>

          {/* Manage Role Modal Content */}
          <div className="bg-white rounded-lg w-full p-6 shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 bg-pink-500 text-white px-4 py-3 rounded-t-lg">
              <h2 className="text-lg font-bold">Manage Role Permissions</h2>
              <div className="flex items-center gap-4">
                <button className="text-white hover:text-gray-200">
                  <FiRefreshCcw size={20} />
                </button>
                <button className="text-white hover:text-gray-200">
                  <FiEdit2 size={20} />
                </button>
                <button className="text-white hover:text-gray-200">
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>

            {/* Department and Role */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Write here"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Permissions and Alerts */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold">Give permission</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold">Set alerts to user</span>
                <div
                  onClick={handleAlertToggle}
                  className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                    isAlertEnabled ? "bg-gradient-to-r from-pink-500 to-purple-500" : ""
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isAlertEnabled ? "translate-x-4" : ""
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Permissions Grid */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <div
                className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${
                  permissionsExpanded ? "" : "max-h-24 overflow-hidden"
                }`}
              >
                {Array(8)
                  .fill("Course complete progress")
                  .map((permission, index) => (
                    <label key={index} className="inline-flex items-center space-x-2">
                      <input type="checkbox" className="form-checkbox text-purple-500" />
                      <span className="text-sm">{permission}</span>
                    </label>
                  ))}
              </div>
              {!permissionsExpanded && (
                <button
                  onClick={togglePermissions}
                  className="mt-2 text-center bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg px-4 py-2 hover:opacity-90"
                >
                  See more
                </button>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Updating date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Updating time</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-white text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-100"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-500 text-white rounded-lg hover:opacity-90">
                Set Permissions
              </button>
            </div>
          </div>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default ManageRolePage;
