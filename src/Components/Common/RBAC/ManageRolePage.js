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

    // Function to handle "Select All"
    const handleGlobalChange = (isChecked) => {
        const allCheckboxes = document.querySelectorAll(".permission-checkbox");
        allCheckboxes.forEach((checkbox) => (checkbox.checked = isChecked));
    };

    // Function to handle individual role-wise selection
    const handleCategoryChange = (roleCategory, isChecked) => {
        const roleCheckboxes = document.querySelectorAll(`.permission-${roleCategory}`);
        roleCheckboxes.forEach((checkbox) => (checkbox.checked = isChecked));
    };

    // Update "Select All" based on individual checkbox states
    const updateSelectAllState = () => {
        const allCheckboxes = document.querySelectorAll(".permission-checkbox");
        const selectAllCheckbox = document.querySelector("#select-all-checkbox");
        const allChecked = Array.from(allCheckboxes).every((checkbox) => checkbox.checked);
        const noneChecked = Array.from(allCheckboxes).every((checkbox) => !checkbox.checked);

        if (allChecked) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = true;
        } else if (noneChecked) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = false;
        } else {
            selectAllCheckbox.indeterminate = true;
        }
    };

    return (
        <Layout title="Manage Roles">
            <DashLayout>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">Manage Roles</h1>
                    </div>

                    <div className="bg-white rounded-lg w-full p-6 shadow-lg">
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

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold">Give Permission</h3>
                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="select-all-checkbox"
                                            onChange={(e) => handleGlobalChange(e.target.checked)}
                                            className="form-checkbox text-purple-500"
                                        />
                                        <span className="text-sm font-medium">Select All</span>
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-semibold">Set alerts to user</span>
                                    <div
                                        onClick={handleAlertToggle}
                                        className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${isAlertEnabled ? "bg-gradient-to-r from-pink-500 to-purple-500" : ""
                                            }`}
                                    >
                                        <div
                                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isAlertEnabled ? "translate-x-4" : ""
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {["Teacher", "Admin", "Staff", "Librarian"].map((roleCategory, categoryIndex) => (
                                    <div key={categoryIndex} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="checkbox"
                                                id={`role-category-${categoryIndex}`}
                                                className="form-checkbox text-purple-500"
                                                onChange={(e) => handleCategoryChange(roleCategory, e.target.checked)}
                                            />
                                            <label
                                                htmlFor={`role-category-${categoryIndex}`}
                                                className="text-sm font-bold cursor-pointer"
                                            >
                                                {roleCategory}
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {Array(4)
                                                .fill("Course complete progress")
                                                .map((permission, permissionIndex) => (
                                                    <label
                                                        key={permissionIndex}
                                                        className={`inline-flex items-center space-x-2 permission-${roleCategory}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox text-purple-500 permission-checkbox"
                                                            onChange={updateSelectAllState}
                                                        />
                                                        <span className="text-sm">{permission}</span>
                                                    </label>
                                                ))}
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-start mt-4">
                                    <button
                                        onClick={togglePermissions}
                                        className="text-center bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg px-4 py-2 hover:opacity-90"
                                    >
                                        See More
                                    </button>
                                </div>
                            </div>
                        </div>

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
