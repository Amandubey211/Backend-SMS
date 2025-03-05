import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import profileIcon from "../../../Assets/DashboardAssets/profileIcon.png";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import StudentDashLayout from "../../../Components/Student/StudentDashLayout";
import { updatePasswordThunk } from "../../../Store/Slices/Common/User/actions/userActions";
import { ImSpinner3 } from "react-icons/im";
import { LuSchool } from "react-icons/lu";
import Cookies from "js-cookie";

const StudentProfile = () => {
  const { userDetails } = useSelector((store) => store.common.user);
  const [loading, setLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const schoolLogo = Cookies.get("logo");

  const handleInputChange = (e, dataSetter) => {
    dataSetter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    // console.log('ud',userDetails);
  }, []);
  const updateProfile = () => {
    // Logic to update profile
    // console.log("Profile updated:");
  };

  const dispatch = useDispatch();

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
      toast.error("confirm Password must be same ");
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

  // const [isSidebarOpen, setSidebarOpen] = useState(false);
  // const handleSidebarOpen = () => setSidebarOpen(true);
  // const handleSidebarClose = () => setSidebarOpen(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProfileClick = () => {
    if (userDetails?.profile) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  console.log("cookies", Cookies);
  return (
    <>
      <Toaster />
      <StudentDashLayout>
        <div className="flex flex-col w-full p-4 gap-3 ">
          <div className="flex items-center py-4 gap-3 rounded-md">
            <div
              className="flex items-center py-4 gap-3 rounded-md cursor-pointer"
              onClick={handleProfileClick}
            >
              <img
                src={userDetails?.profile ? userDetails?.profile : profileIcon}
                alt="Profile"
                className="w-22 h-20 rounded-full shadow-lg border"
              />
            </div>

            {isModalOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
                <div className="relative w-1/3 h-1/3 bg-white py-5 rounded-md">
                  {" "}
                  {/* Adjust width and height */}
                  <img
                    src={userDetails?.profile}
                    alt="Full Profile"
                    className="w-full h-full object-contain rounded-lg" // object-contain
                  />
                  <button
                    className="absolute top-4 right-4 text-gray-600 text-xl font-thin
                     cursor-pointer"
                    onClick={closeModal}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-row justify-between w-full">
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col w-[75%]">
                  <h2 className="text-xl font-semibold uppercase">
                    {userDetails?.fullName}
                  </h2>
                  <h2 className="text-md text-gray-600 flex flex-row items-center gap-2">
                    {" "}
                    <span>
                      {schoolLogo ? (
                        <img
                          alt="school-logo"
                          className="h-5 w-5"
                          src={schoolLogo}
                        ></img>
                      ) : (
                        <LuSchool />
                      )}
                    </span>
                    {userDetails?.schoolName}
                  </h2>
                </div>
              </div>
              <div className="w-[22%] flex items-center ">
                <div className="bg-purple-100 w-auto text-purple-800 text-sm  font-semibold rounded-full px-4 py-2">
                  Enrollment : {userDetails?.enrollment}
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-1 bg-gradient-to-r from-[#C83B62] to-[#7F35CD]  bg-clip-text text-transparent ">
            Personal Information
          </h3>
          <div className="flex flex-row gap-28 px-6 mb-2 py-4 border items-center rounded-md">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">Full Name</span>
                <span className="font-medium text-gray-800">
                  {userDetails?.fullName}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">
                  Contact Number
                </span>
                <span className="font-medium text-gray-800">
                  {userDetails?.mobileNumber}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">
                  Admission Number
                </span>
                <span className="font-medium text-gray-800">
                  {userDetails?.admissionNumber || "-"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">Email</span>
                <span className="font-medium text-gray-800">
                  {userDetails?.email || "-"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">Date Of Birth</span>
                <span className="font-medium text-gray-800">
                  {userDetails?.dateOfBirth?.slice(0, 10) || "-"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">QID</span>
                <span className="font-medium text-gray-800">
                  {userDetails?.Q_Id || "-"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">Section</span>
                <span className="font-medium text-gray-800">
                  {userDetails?.sectionName || "-"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-normal text-gray-500">Class</span>
                <span className="font-medium text-gray-800">
                  {userDetails?.className || "-"}
                </span>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-1 bg-gradient-to-r from-[#C83B62] to-[#7F35CD]  bg-clip-text text-transparent ">
            Reset Your Password
          </h3>
          <div className="flex flex-col gap-10 p-6 py-13 mb-2 border rounded-md">
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) => handleInputChange(e, setPasswordData)}
              className="border p-2 rounded w-[30%]"
              placeholder="Current Password"
            />
            <div className="relative w-[30%]">
              {" "}
              {/* Make the parent relative */}
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => handleInputChange(e, setPasswordData)}
                className="border p-2 rounded w-full pr-10" // Add padding-right for the icon
                placeholder="New Password"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" // Position absolutely
              >
                {!showPassword ? (
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
                onClick={cancelUpdatePassword}
                className="px-4 w-[150px] h-12 inline-flex items-center justify-center border border-transparent text-md font-medium shadow-sm bg-gray-200 text-black rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={updatePassword}
                className="px-4 w-[150px h-12 inline-flex items-center border border-transparent text-md font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600 justify-center"
              >
                {loading ? (
                  <ImSpinner3 className="w-8 h-8 animate-spin mb-3 text-white" />
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </div>
          {/* <SidebarSlide
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title="Edit Profile"
              width="50%"
            >
              <EditStudentProfile data={userDetails} />
            </SidebarSlide> */}
        </div>
      </StudentDashLayout>
    </>
  );
};

export default StudentProfile;
