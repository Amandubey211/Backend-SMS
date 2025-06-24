import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import profileIcon from "../../../Assets/DashboardAssets/profileIcon.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import StudentDashLayout from "../../../Components/Student/StudentDashLayout";
import {
  updatePasswordThunk,
  updateStudentInfoThunk,
} from "../../../Store/Slices/Common/User/actions/userActions";
import { ImSpinner3 } from "react-icons/im";
import { LuSchool } from "react-icons/lu";
import Cookies from "js-cookie";
import { Modal, Button, Tag } from "antd";
import { RiEditLine } from "react-icons/ri";
import { IdcardOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import ImageUpload from "../../Admin/Addmission/Components/ImageUpload";
import { setUserDetails } from "../../../Store/Slices/Common/User/reducers/userSlice";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";

const StudentProfile = () => {
  const { userDetails, status } = useSelector((store) => store.common.user);
  const dispatch = useDispatch();
  useNavHeading("Student", "Profile");

  // ---------------------------
  // Password Update Logic
  // ---------------------------
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
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
      toast.error("Confirm Password must be the same");
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
  // Profile Image Editing Logic
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

  // Only update the profile image link in the userDetails object.
  // Append default empty JSON strings for addresses to satisfy the backend.
  const handleSaveImage = async () => {
    if (!selectedFile) {
      toast.error("No new image selected.");
      return;
    }
    const formData = new FormData();
    formData.append("id", userDetails?.userId); // Adjust if your backend expects _id
    formData.append("profile", selectedFile);
    formData.append("permanentAddress", JSON.stringify({}));
    formData.append("residentialAddress", JSON.stringify({}));

    dispatch(updateStudentInfoThunk(formData))
      .unwrap()
      .then((res) => {
        // Update only the profile field in the existing userDetails object.
        dispatch(
          setUserDetails({ ...userDetails, profile: res.student.profile })
        );
        setProfileImage(tempImage);
        setEditModalVisible(false);
      })
      .catch(() => {
        toast.error("Failed to update profile image");
      });
  };

  const schoolLogo = Cookies.get("logo");

  return (
    <StudentDashLayout>
      <div className="flex flex-col w-full gap-6">
        {/* Profile Header Section */}
        <div className="relative bg-white shadow rounded-lg p-6 m-2">
          <div className="absolute top-2 right-2">
            <Tag
              icon={<IdcardOutlined style={{ fontSize: "1.2em" }} />}
              color="purple"
              className="text-sm px-3 py-1"
            >
              Enrollment: {userDetails?.enrollment}
            </Tag>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative cursor-pointer"
              onClick={openPreviewModal}
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border"
              />
              <div className="absolute top-0 right-0">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<RiEditLine />}
                  size="small"
                  onClick={openEditModal}
                />
              </div>
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold uppercase text-gray-800">
                {userDetails?.fullName}
              </h2>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {schoolLogo ? (
                    <img
                      alt="school-logo"
                      className="w-8 h-8"
                      src={schoolLogo}
                    />
                  ) : (
                    <LuSchool className="w-5 h-5" />
                  )}
                  <span className="text-lg text-gray-600">
                    {userDetails?.schoolName}
                  </span>
                </div>
                {userDetails?.className && (
                  <Tag color="magenta" className="text-xs mt-2 w-fit">
                    {userDetails.className}
                  </Tag>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        <Modal
          visible={previewModalVisible}
          title="Profile Preview"
          onCancel={closePreviewModal}
          footer={[
            <Button key="edit" type="primary" onClick={openEditModal}>
              Edit
            </Button>,
            <Button key="close" onClick={closePreviewModal}>
              Close
            </Button>,
          ]}
        >
          <motion.img
            src={profileImage}
            alt="Profile Preview"
            className="w-full object-contain rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          visible={editModalVisible}
          title="Edit Profile Image"
          onCancel={closeEditModal}
          footer={[
            <Button key="cancel" onClick={closeEditModal}>
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={handleSaveImage}
              disabled={status.loading}
            >
              <span className="flex items-center justify-center">
                {status.loading
                  ? // <ImSpinner3 className="w-5 h-5 animate-spin" />
                    "saving..."
                  : "Save"}
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

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Personal Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Full Name</span>
              <span className="text-gray-800 font-medium">
                {userDetails?.fullName}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Contact Number</span>
              <span className="text-gray-800 font-medium">
                {userDetails?.mobileNumber}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Admission Number</span>
              <span className="text-gray-800 font-medium">
                {userDetails?.admissionNumber || "-"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Email</span>
              <span className="text-gray-800 font-medium">
                {userDetails?.email || "-"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Date Of Birth</span>
              <span className="text-gray-800 font-medium">
                {userDetails?.dateOfBirth?.slice(0, 10) || "-"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">QID</span>
              <span className="text-gray-800 font-medium">
                {userDetails?.Q_Id || "-"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Section</span>
              <span className="text-gray-800 font-medium">
                {userDetails?.sectionName || "-"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Class</span>
              <span className="text-gray-800 font-medium">
                {userDetails?.className || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Reset Password Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Reset Your Password
          </h3>
          <div className="max-w-md space-y-4">
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => handleInputChange(e, setPasswordData)}
                className="w-full border p-3 rounded pr-10"
                placeholder="Current Password"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => handleInputChange(e, setPasswordData)}
                className="w-full border p-3 rounded pr-10"
                placeholder="New Password"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => handleInputChange(e, setPasswordData)}
                className="w-full border p-3 rounded pr-10"
                placeholder="Re - enter Password"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="mt-6 flex items-center justify-end gap-4">
              <button
                onClick={cancelUpdatePassword}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={updatePassword}
                className="inline-flex items-center justify-center px-6 py-3 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full hover:from-pink-600 hover:to-purple-600"
              >
                {loading ? (
                  <ImSpinner3 className="w-5 h-5 animate-spin" />
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </StudentDashLayout>
  );
};

export default StudentProfile;
