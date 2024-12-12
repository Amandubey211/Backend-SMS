// src/Components/StaffMyProfile.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import profileIcon from "../../Assets/DashboardAssets/profileIcon.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ImSpinner3 } from "react-icons/im";
import { LuSchool } from "react-icons/lu";
import Layout from "./Layout";
import DashLayout from "../Admin/AdminDashLayout";
import { updatePasswordThunk } from "../../Store/Slices/Common/User/actions/userActions";

const StaffMyProfile = () => {
  const { userDetails } = useSelector((store) => store.common.user);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();

  const handleInputChange = (e, dataSetter) => {
    const { name, value } = e.target;
    dataSetter((prev) => ({ ...prev, [name]: value }));

    // Clear error message when user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePasswords = () => {
    const newErrors = {};
    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required.";
    }
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "New password is required.";
    }
    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password.";
    }
    if (
      passwordData.newPassword &&
      passwordData.confirmPassword &&
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Confirm Password must be the same as New Password.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const updatePassword = () => {
    setLoading(true);
    if (validatePasswords()) {
      dispatch(updatePasswordThunk(passwordData))
        .then(() => {
          setLoading(false);
          toast.success("Password updated successfully!");
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.message || "Failed to update password.");
        });
    } else {
      setLoading(false);
      toast.error("Please fix the errors before submitting.");
    }
  };

  const cancelUpdatePassword = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <Layout>
      <DashLayout>
        <div className="flex flex-col w-full p-4 gap-3">
          {/* Profile Image and Name */}
          <div className="flex items-center px-6 py-4 gap-3 border rounded-md">
            <img
              src={userDetails?.profile ? userDetails?.profile : profileIcon}
              alt="Profile"
              className="w-20 h-20 rounded-full shadow-lg border"
            />
            <div className="flex flex-row justify-between w-full">
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold">
                    {userDetails?.fullName}
                  </h2>
                  <h2 className="text-lg text-gray-600 flex flex-row items-center gap-2">
                    <span>
                      <LuSchool />
                    </span>
                    {userDetails?.schoolName}
                  </h2>
                </div>
              </div>
              <button
                className={`px-4 inline-flex items-center border border-transparent text-sm font-medium shadow-sm rounded-md ${
                  userDetails?.active
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                    : "bg-gray-300 text-black hover:bg-gray-400"
                } h-[2rem]`}
              >
                {userDetails?.active ? "Active" : "Deactive"}
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="flex flex-row gap-28 px-6 py-8 border items-center rounded-md">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">Full Name</span>
                <span className="font-medium text-gray-800">
                  {userDetails?.fullName || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">Email</span>
                <span className="font-medium text-gray-800">
                  {userDetails?.email || "N/A"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">Mobile Number</span>
                <span className="font-medium text-gray-800">
                  {userDetails?.mobileNumber || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">Position</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userDetails?.position?.length ? (
                    userDetails.position.map((pos, index) => (
                      <span
                        key={index}
                        className="bg-pink-100 text-pink-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm"
                      >
                        {pos}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
          <div className="flex flex-row gap-28 px-6 py-8 border items-center rounded-md">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">Role</span>
                <span className="font-medium text-gray-800">
                  {userDetails?.role || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">Date of Birth</span>
                <span className="font-medium text-gray-800">
                  {userDetails?.dateOfBirth?.slice(0, 10) || "N/A"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">Employee ID</span>
                <span className="font-medium text-gray-800">
                  {userDetails?.employeeID || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">
                  Monthly Salary
                </span>
                <span className="font-medium text-gray-800">
                  {userDetails?.monthlySalary || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Reset Password */}
          <h3 className="text-lg font-semibold mb-4">Reset Your Password</h3>
          <div className="flex flex-col gap-6 p-6 border rounded-md">
            {/* Current Password */}
            <div className="mb-4 relative w-1/2">
              <label htmlFor="currentPassword" className="sr-only">
                Current Password
              </label>
              <input
                type={showPassword.currentPassword ? "text" : "password"}
                name="currentPassword"
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => handleInputChange(e, setPasswordData)}
                placeholder="Current Password"
                className={`mt-1 block w-full px-3 py-3 border rounded-md shadow-sm sm:text-sm ${
                  errors.currentPassword
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("currentPassword")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={
                  showPassword.currentPassword
                    ? "Hide current password"
                    : "Show current password"
                }
              >
                {showPassword.currentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="mb-4 relative w-1/2">
              <label htmlFor="newPassword" className="sr-only">
                New Password
              </label>
              <input
                type={showPassword.newPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => handleInputChange(e, setPasswordData)}
                placeholder="New Password"
                className={`mt-1 block w-full px-3 py-3 border rounded-md shadow-sm sm:text-sm ${
                  errors.newPassword
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("newPassword")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={
                  showPassword.newPassword
                    ? "Hide new password"
                    : "Show new password"
                }
              >
                {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4 relative w-1/2">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => handleInputChange(e, setPasswordData)}
                placeholder="Re-enter Password"
                className={`mt-1 block w-full px-3 py-3 border rounded-md shadow-sm sm:text-sm ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => toggleShowPassword("confirmPassword")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={
                  showPassword.confirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={updatePassword}
                disabled={loading}
                className={`flex justify-center items-center px-4 w-[150px] h-12 border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600 ${
                  loading ? "cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <ImSpinner3 className="w-6 h-6 animate-spin text-white" />
                ) : (
                  "Update Password"
                )}
              </button>
              <button
                type="button"
                onClick={cancelUpdatePassword}
                className="px-4 w-[150px] h-12 inline-flex items-center justify-center border border-transparent text-lg font-medium shadow-sm bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default StaffMyProfile;
