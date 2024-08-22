import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import profileIcon from '../../Assets/DashboardAssets/profileIcon.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useGetUserDetail from "../../Hooks/AuthHooks/Staff/useGetUserDetail";
import useChangePassword from "../../Hooks/AuthHooks/Staff/Admin/resetPassword/useResetPassword";
import ParentDashLayout from "./ParentDashLayout";
import EditParentProfile from "./EditParentProfile";
import SidebarSlide from "../Common/SidebarSlide";

const ParentProfile = () => {
  const { userDetail } = useGetUserDetail();
  const user = useSelector((store) => store.Auth.userDetail);
  const [userData, setUserData] = useState(user);

  useEffect(() => {
    const getData = async () => {
      await userDetail();
    };
    getData();
  }, []);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e, dataSetter) => {
    dataSetter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateProfile = () => {
    // Logic to update profile
    console.log("Profile updated:", userData);
  };

  const { ChangePassword } = useChangePassword();

  const updatePassword = () => {
    if (passwordData.newPassword === passwordData.confirmPassword) {
      ChangePassword(passwordData)
    } else {
      toast.error("Passwords do not match.");
    }
  };

  const cancelUpdatePassword = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
     <ParentDashLayout>
          <div className="flex flex-col w-full p-4 gap-3 ">
            <div className="flex items-center px-6 py-4 gap-3 border rounded-md">
              <img
                src={userData?.profile ? userData?.profile : profileIcon}
                alt="Profile"
                className="w-20 h-20 rounded-full shadow-lg border"
              />
              <div className="flex flex-row justify-between w-full">
                <h2 className="text-xl font-semibold">{userData?.fatherName || userData?.motherName || userData?.guardianName}</h2>
                {/* <button
                  onClick={handleSidebarOpen}
                  className="px-4 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600"
                >
                  Edit
                </button> */}
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="flex flex-row gap-28 px-6 py-8 border items-center rounded-md">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <span className="font-normal text-gray-500">Father's Name</span>
                  <span className="font-medium text-gray-800">
                    {userData?.fatherName}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-normal text-gray-500">Email</span>
                  <span className="font-medium text-gray-800">{userData?.guardianEmail}</span>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <span className="font-normal text-gray-500">Mother's Name</span>
                  <span className="font-medium text-gray-800">
                    {userData?.motherName || '-'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-normal text-gray-500">Guardian's Name</span>
                  <span className="font-medium text-gray-800">{userData?.guardianName || '-'}</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Reset Your Password</h3>
            <div className="flex flex-col gap-10 p-6 py-13 border rounded-md">
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => handleInputChange(e, setPasswordData)}
                className="border p-2 rounded w-[30%]"
                placeholder="Current Password"
              />
              <div className="flex flex-row items-center gap-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => handleInputChange(e, setPasswordData)}
                  className="border p-2 rounded w-[30%]"
                  placeholder="New Password"
                />
                <span className="text-2xl cursor-pointer">
                  {!showPassword ? <FaEye onClick={() => setShowPassword(true)} /> : <FaEyeSlash onClick={() => setShowPassword(false)} />}
                </span>
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => handleInputChange(e, setPasswordData)}
                className="border p-2 rounded w-[30%]"
                placeholder="Re-enter Password"
              />
              <div className="flex gap-3">
                <button
                  onClick={updatePassword}
                  className="px-4 w-[200px] h-12 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600 justify-center"
                >
                  Update Password
                </button>
                <button
                  onClick={cancelUpdatePassword}
                  className="px-4 w-[200px] h-12 inline-flex items-center justify-center border border-transparent text-lg font-medium shadow-sm bg-gray-300 text-black rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div> 
            <SidebarSlide
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title="Edit Profile"
              width="50%"
            >
              <EditParentProfile data={userData} />
            </SidebarSlide>
          </div>
          </ParentDashLayout>
    </>
  );
};

export default ParentProfile;
