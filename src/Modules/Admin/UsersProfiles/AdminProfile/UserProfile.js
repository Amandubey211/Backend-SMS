import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import EditAdmin from "./EditProfile";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { updatePasswordThunk } from "../../../../Store/Slices/Common/User/actions/userActions";
import { ImSpinner3 } from "react-icons/im";
import { setUserDetails } from "../../../../Redux/Slices/Auth/AuthSlice";
import { useTranslation } from "react-i18next";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('admProfile');
  const { userDetails } = useSelector((store) => store.common.user);
  const [loading, setLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e, dataSetter) => {
    dataSetter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateProfile = () => {
    console.log("Profile updated:");
  };

  const updatePassword = () => {
    setLoading(true);
    if (passwordData.newPassword === passwordData.confirmPassword) {
      dispatch(updatePasswordThunk(passwordData)).then(() => {
        setLoading(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      });
    } else {
      toast.error(t("confirmPasswordError"));
      setLoading(false);
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
      <Layout title={t("myProfile")}>
        <DashLayout>
          <div className="flex flex-col w-full p-4 gap-3">
            <div className="flex items-center px-6 py-4 gap-3 border rounded-md">
              <img
                src={userDetails?.profile ? userDetails?.profile : profileIcon}
                alt={t("userAvatar")}
                className="w-20 h-20 rounded-full shadow-lg border"
              />
              <div className="flex flex-row justify-between w-full">
                <h2 className="text-xl font-semibold">{userDetails?.fullName}</h2>
                <button
                  onClick={handleSidebarOpen}
                  className="px-4 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600"
                >
                  {t("edit")}
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-4">{t("personalInformation")}</h3>
            <div className="flex flex-row gap-28 px-6 py-8 border items-center rounded-md">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <span className="font-normal text-gray-500">{t("firstName")}</span>
                  <span className="font-medium text-gray-800">
                    {userDetails?.fullName?.split(" ")[0] || "-"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-normal text-gray-500">{t("email")}</span>
                  <span className="font-medium text-gray-800">
                    {userDetails?.email}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <span className="font-normal text-gray-500">{t("lastName")}</span>
                  <span className="font-medium text-gray-800">
                    {userDetails?.fullName?.split(" ")[1] || "-"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-normal text-gray-500">{t("phone")}</span>
                  <span className="font-medium text-gray-800">
                    {userDetails?.mobileNumber}
                  </span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">{t("resetYourPassword")}</h3>
            <div className="flex flex-col gap-10 p-6 py-13 border rounded-md">
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => handleInputChange(e, setPasswordData)}
                className="border p-2 rounded w-[30%]"
                placeholder={t("currentPassword")}
              />
              <div className="flex flex-row items-center gap-2">
                <input
                  type={showPaasword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => handleInputChange(e, setPasswordData)}
                  className="border p-2 rounded w-[30%]"
                  placeholder={t("newPassword")}
                />
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
                placeholder={t("reEnterPassword")}
              />
              <div className="flex gap-3">
                <button
                  disabled={loading}
                  onClick={updatePassword}
                  className="px-4 w-[150px] h-12 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600 justify-center"
                >
                  {loading ? (
                    <ImSpinner3 className="w-8 h-8 animate-spin mb-3 text-white" />
                  ) : (
                    t("updatePassword")
                  )}
                </button>
                <button
                  onClick={cancelUpdatePassword}
                  className="px-4 w-[150px] h-12 inline-flex items-center justify-center border border-transparent text-lg font-medium shadow-sm bg-gray-300 text-black rounded-md hover:bg-gray-400"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>

            <SidebarSlide
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title={t("editProfile")}
              width="50%"
            >
              <EditAdmin data={userDetails} />
            </SidebarSlide>
          </div>
        </DashLayout>
      </Layout>
    </>
  );
};

export default UserProfile;
