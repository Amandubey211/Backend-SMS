import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import profileIcon from "../../../Assets/DashboardAssets/profileIcon.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import StudentDashLayout from "../../../Components/Student/StudentDashLayout";
import { updatePasswordThunk } from "../../../Store/Slices/Common/User/actions/userActions";
import { ImSpinner3 } from "react-icons/im";

const StudentProfile = () => {
  const {userDetails} = useSelector((store) => store.common.user);
;  const [loading ,setLoading] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e, dataSetter) => {
    dataSetter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(()=>{
    console.log('ud',userDetails);
    
  },[])
  const updateProfile = () => {
    // Logic to update profile
    console.log("Profile updated:");
  };

  const dispatch = useDispatch();

  const updatePassword = () => {
    setLoading(true)
    if (passwordData.newPassword === passwordData.confirmPassword) {
     dispatch(updatePasswordThunk(passwordData)).then(()=> {  setLoading(false);   setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });})
    } else {
      toast.error("confirm Password must be same ");
      setLoading(false)
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
    <Toaster/>
      <StudentDashLayout>
        <div className="flex flex-col w-full p-4 gap-3 ">
          <div className="flex items-center px-6 py-4 gap-3  rounded-md">
            <img
              src={userDetails?.profile ? userDetails?.profile : profileIcon}
              alt="Profile"
              className="w-20 h-20 rounded-full shadow-lg border"
            />
            <div className="flex flex-row justify-between w-full">
              <h2 className="text-xl font-semibold">{userDetails?.fullName}</h2>
              <button
                // onClick={handleSidebarOpen}
                className="px-4 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600"
              >
                Enrollment : {userDetails?.enrollment}
              </button>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="flex flex-row gap-28 px-6 py-8 border items-center rounded-md">
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
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => handleInputChange(e, setPasswordData)}
                className="border p-2 rounded w-[30%]"
                placeholder="New Password"
              />
              <span className="text-2xl cursor-pointer">
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
                disabled={loading}
                onClick={updatePassword}
                className="px-4 w-[150px h-12 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600 justify-center"
              >
                { loading ? <ImSpinner3 className="w-8 h-8 animate-spin mb-3 text-white" />: 'Update Password'}
              </button>
              <button
                onClick={cancelUpdatePassword}
                className="px-4 w-[150px] h-12 inline-flex items-center justify-center border border-transparent text-lg font-medium shadow-sm bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
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
