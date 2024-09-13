import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import { useSelector } from "react-redux";
import useChangePassword from "../../../../Hooks/AuthHooks/Staff/Admin/resetPassword/useResetPassword";
import toast from "react-hot-toast";
import EditAdmin from "./EditProfile";
import useGetUserDetail from "../../../../Hooks/AuthHooks/Staff/useGetUserDetail";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
const UserProfile = () => {
  const { userDetail } = useGetUserDetail();
  const user = useSelector((store) => store.User.userDetails);

  useEffect(() => {
    const getData = async () => {
      await userDetail();
    };
    getData();
  }, []);

  // useEffect(() => {
  //   setUserData(user);
  // }, [user]);

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
    console.log("Profile updated:", user);
  };

  const { ChangePassword } = useChangePassword();

  const updatePassword = () => {
    if (passwordData.newPassword === passwordData.confirmPassword) {
      ChangePassword(passwordData)
        .then(() => {
          toast.success("Password updated successfully.");
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        })
        .catch(() => {
          toast.error("Failed to update password.");
        });
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
  const [showPaasword, setShowPassword] = useState(false);
  return (
    <>
      <Layout title="MY Profile">
        <DashLayout>
          <div className="flex flex-col  w-full p-4 gap-3 ">
            <div className="flex items-center px-6 py-4 gap-3 border rounded-md">
              <img
                src={user.profile ? user?.profile : profileIcon}
                alt="Cameron Williamson"
                className="w-20 h-20 rounded-full shadow-lg border "
              />
              <div className="flex flex-row justify-between w-full">
                <h2 className="text-xl font-semibold">{user.adminName}</h2>
                <button
                  onClick={handleSidebarOpen}
                  className="px-4 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600"
                >
                  Edit
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="flex flex-row gap-28 px-6 py-8 border items-center rounded-md">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <span className="font-normal text-gray-500">First name</span>
                  <span className="font-medium text-gray-800">
                    {/* {user.adminName?.split(" ")[0]} */}
                    {user.fullName}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-normal text-gray-500">Email</span>
                  <span className="font-medium text-gray-800">
                    {user.email}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <span className="font-normal text-gray-500">Last Name</span>
                  <span className="font-medium text-gray-800">
                    {user?.adminName?.split(" ")[1]
                      ? user.adminName.split(" ")[1]
                      : "-"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-normal text-gray-500">Phone</span>
                  <span className="font-medium text-gray-800">
                    {user.contactNumber}
                  </span>
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
                  type={showPaasword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => handleInputChange(e, setPasswordData)}
                  className="border p-2 rounded w-[30%]"
                  placeholder="New Password"
                />{" "}
                <span className="text-2xl cursor-pointer">
                  {!showPaasword ? (
                    <FaEye onClick={() => setShowPassword(true)} />
                  ) : (
                    <FaEyeSlash onClick={() => setShowPassword(false)} />
                  )}
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
              <EditAdmin data={user} />
            </SidebarSlide>
          </div>
        </DashLayout>
      </Layout>
    </>
  );
};

export default UserProfile;
