import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import profileIcon from "../../Assets/DashboardAssets/profileIcon.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ParentDashLayout from "./ParentDashLayout";
import Layout from "../Common/ParentLayout";
import { useTranslation } from "react-i18next";
import {
  updatePasswordThunk,
  updateParentInfoThunk,
} from "../../Store/Slices/Common/User/actions/userActions";
import { ImSpinner3 } from "react-icons/im";
import { LuSchool } from "react-icons/lu";
import Cookies from "js-cookie";
import { Modal, Button } from "antd";
import { RiEditLine } from "react-icons/ri";
import { setUserDetails } from "../../Store/Slices/Common/User/reducers/userSlice";
import ImageUpload from "../../Modules/Admin/Addmission/Components/ImageUpload";

const ParentProfile = () => {
  const { t } = useTranslation("prtProfile");
  const { userDetails, status } = useSelector((store) => store.common.user);
  const dispatch = useDispatch();

  // ---------------------------
  // Password Update Logic
  // ---------------------------
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Independent state variables for each password field's visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e, dataSetter) => {
    dataSetter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      toast.error(t("confirm Password must be same"));
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

  // ---------------------------
  // Edit Profile Image Functionality
  // ---------------------------
  const [profileImage, setProfileImage] = useState(
    userDetails?.profile || profileIcon
  );
  const [tempImage, setTempImage] = useState(profileImage);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageError, setImageError] = useState("");

  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    const initialImage = userDetails?.profile || profileIcon;
    setProfileImage(initialImage);
    setTempImage(initialImage);
  }, [userDetails]);

  const openPreviewModal = () => setPreviewModalVisible(true);
  const closePreviewModal = () => setPreviewModalVisible(false);
  const openEditModal = (e) => {
    e?.stopPropagation();
    setEditModalVisible(true);
    setPreviewModalVisible(false);
  };
  const closeEditModal = () => {
    setTempImage(profileImage);
    setEditModalVisible(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageError("Please select a valid image file.");
        return;
      }
      setImageError("");
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setTempImage("");
    setSelectedFile(null);
  };

  // Update the profile image link in the userDetails object.
  const handleSaveImage = () => {
    if (!selectedFile) {
      toast.error("No new image selected.");
      return;
    }
    const formData = new FormData();
    formData.append("id", userDetails?.userId || userDetails?._id);
    formData.append(
      "guardianEmail",
      userDetails?.guardianEmail || userDetails?.email
    );
    formData.append("profile", selectedFile);

    dispatch(updateParentInfoThunk(formData))
      .unwrap()
      .then((res) => {
        dispatch(setUserDetails({ ...userDetails, profile: res.profile }));
        setProfileImage(tempImage);
        setEditModalVisible(false);
        toast.success("Profile image updated successfully");
      })
      .catch(() => {
        toast.error("Failed to update profile image");
      });
  };

  const schoolLogo = Cookies.get("logo");

  return (
    <>
      <Layout title={t("My Profile")}>
        <ParentDashLayout>
          <div className="flex flex-col w-full p-4 gap-3 ">
            {/* Profile Section */}
            <div className="flex items-center px-6 py-4 gap-3 border rounded-md">
              <div className="relative">
                <img
                  src={profileImage}
                  alt={t("Profile")}
                  className="w-20 h-20 rounded-full shadow-lg border"
                />
                <button
                  onClick={openPreviewModal}
                  className="absolute top-0 right-0 bg-gray-200 p-1 rounded-full"
                >
                  <RiEditLine className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-col justify-between w-full">
                <h2 className="text-xl font-semibold">
                  {userDetails?.fatherName || userDetails?.guardianName}
                </h2>
                <h2 className="text-lg text-gray-600 flex items-center gap-2">
                  <LuSchool />
                  {userDetails?.schoolName}
                </h2>
              </div>
            </div>

            {/* Preview Modal for Profile Image */}
            <Modal
              visible={previewModalVisible}
              title="Profile Preview"
              onCancel={closePreviewModal}
              width={500}
              footer={[
                <Button key="edit" type="primary" onClick={openEditModal}>
                  {t("Edit")}
                </Button>,
                <Button key="close" onClick={closePreviewModal}>
                  {t("Close")}
                </Button>,
              ]}
            >
              <img
                src={profileImage}
                alt="Profile Preview"
                className="w-full object-contain rounded"
              />
            </Modal>

            {/* Edit Modal for Profile Image */}
            <Modal
              visible={editModalVisible}
              title="Edit Profile Image"
              onCancel={closeEditModal}
              width={500}
              footer={[
                <Button key="cancel" onClick={closeEditModal}>
                  {t("Cancel")}
                </Button>,
                <Button
                  key="save"
                  type="primary"
                  onClick={handleSaveImage}
                  disabled={status.loading}
                >
                  <span className="flex items-center justify-center">
                    {status.loading ? "Saving..." : t("Save")}
                  </span>
                </Button>,
              ]}
            >
              <div className="flex justify-center">
                <ImageUpload
                  imagePreview={tempImage}
                  handleImageChange={handleImageChange}
                  handleRemoveImage={handleRemoveImage}
                  error={imageError}
                  width="w-64"
                  height="h-64"
                />
              </div>
            </Modal>

            {/* Personal Information */}
            <h3 className="text-lg font-semibold mb-4">
              {t("Personal Information")}
            </h3>
            <div className="flex flex-row gap-28 px-6 py-8 border items-start rounded-md">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <span className="font-normal text-gray-500">
                    {t("Father's Name")}
                  </span>
                  <span className="font-medium text-gray-800">
                    {userDetails?.fatherName || userDetails?.guardianName}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-normal text-gray-500">
                    {t("Email")}
                  </span>
                  <span className="font-medium text-gray-800">
                    {userDetails?.email}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <span className="font-normal text-gray-500">
                    {t("Mother's Name")}
                  </span>
                  <span className="font-medium text-gray-800">
                    {userDetails?.motherName || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Reset Password Section */}
            <h3 className="text-lg font-semibold mb-4">
              {t("Reset Your Password")}
            </h3>
            <div className="flex flex-col gap-4 p-6 border rounded-md w-full md:w-1/2">
              {/* Current Password */}
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => handleInputChange(e, setPasswordData)}
                  className="w-full border p-3 rounded pr-10"
                  placeholder={t("Current Password")}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* New Password */}
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => handleInputChange(e, setPasswordData)}
                  className="w-full border p-3 rounded pr-10"
                  placeholder={t("New Password")}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handleInputChange(e, setPasswordData)}
                  className="w-full border p-3 rounded pr-10"
                  placeholder={t("Re-enter Password")}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-4">
                <button
                  onClick={cancelUpdatePassword}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {t("Cancel")}
                </button>
                <button
                  disabled={loading}
                  onClick={updatePassword}
                  className="inline-flex items-center justify-center px-6 py-3 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full hover:from-pink-600 hover:to-purple-600"
                >
                  {loading ? (
                    <ImSpinner3 className="w-5 h-5 animate-spin" />
                  ) : (
                    t("Update Password")
                  )}
                </button>
              </div>
            </div>
          </div>
        </ParentDashLayout>
      </Layout>
    </>
  );
};

export default ParentProfile;
