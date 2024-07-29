import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import { useSelector } from "react-redux";
import useChangePassword from "../../../../Hooks/AuthHooks/Staff/Admin/resetPassword/useResetPassword";
import toast from "react-hot-toast";
import EditAdmin from "./EditProfile";
import useGetUserDetail from "../../../../Hooks/AuthHooks/Staff/useGetUserDetail";

const UserProfile = () => {
  const  {userDetail} = useGetUserDetail();
  const user = useSelector((store)=>store.Auth.userDetail);
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
const {ChangePassword} =  useChangePassword();
  const updatePassword = () => {
    console.log(passwordData);
    if (passwordData.newPassword === passwordData.confirmPassword) {
      ChangePassword(passwordData)
    } else {
      toast.error("Passwords do not match.");
    }
  };
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null)
  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  
  return (
    <>
    <Layout title="Admin">
      <DashLayout>
        <div className="flex flex-col h-screen w-full p-4 gap-3">
          <div className="flex  items-center px-6 py-4 gap-3 border rounded-md">
            <img
              src={userData.profile}
              alt="Cameron Williamson"
              className="w-20 h-20 rounded-full "
            />
            <div className="flex flex-row justify-between  w-full ">
              <h2 className="text-xl font-semibold">{userData.adminName
                }</h2>
              {/* <button onClick={updateProfile} className="text-blue-600">
                Edit
              </button> */}

              <button
                    onClick={handleSidebarOpen}
                    className="px-4 inline-flex items-center border border-transparent text-sm font-medium  shadow-sm    bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600"
                >
                   Edit            
                       </button>
            </div>
          </div>
                   <h3 className="text-lg font-semibold mb-4">Personal Information</h3>


          <div className="flex flex-row gap-28 px-6 py-8 border items-center rounded-md ">
          <div className="flex flex-col gap-5 ">
              <div className="flex  flex-col" >
                <span  className=" font-normal text-gray-500">First name</span>
                <span  className=" font-medium text-gray-800">{userData.adminName?.split(' ')[0]
                }</span>
              </div>
              <div className="flex flex-col ">
                <span   className=" font-normal text-gray-500">email</span>
                <span  className=" font-medium text-gray-800">{userData.email}</span>
              </div>
            </div>
            <div className="flex flex-col gap-5 ">
              <div className="flex  flex-col" >
                <span  className=" font-normal text-gray-500">Last Name</span>
                <span  className=" font-medium text-gray-800">{userData?.adminName?.split(' ')[1]?userData.adminName.split(' ')[1]:'-'}</span>
              </div>
              <div className="flex flex-col ">
                <span   className=" font-normal text-gray-500">Phone</span>
                <span  className=" font-medium text-gray-800">{userData.contactNumber}</span>
              </div>
            </div>
            {/* <div className="flex flex-col"></div> */}
          </div>

          <h3 className="text-lg font-semibold mb-4">Reset Your Password</h3> 
          <div className="flex flex-col  gap-10 p-6 py-13  border  rounded-md">
            
                    <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={(e) => handleInputChange(e, setPasswordData)}
                        className="border p-2 rounded w-[30%]"
                        placeholder="Current Password"
                    />
                    <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={(e) => handleInputChange(e, setPasswordData)}
                        className="border p-2 rounded  w-[30%]"
                        placeholder="New Password"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={(e) => handleInputChange(e, setPasswordData)}
                        className="border p-2 rounded  w-[30%]"
                        placeholder="Re-enter Password"
                    />

                <button
                    onClick={updatePassword}
                    className="px-4 w-[200px] h-12 inline-flex items-center border border-transparent text-sm font-medium  shadow-sm    bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600"
                >
                    Update Password
                </button>
                </div>
              
                <SidebarSlide
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title='Edit Profile'
            width="50%"
          >
            <EditAdmin data={userData} />
          </SidebarSlide>
        </div>
        {/* <div className="flex flex-col p-6 bg-white border rounded-lg max-w-screen-lg mx-auto my-4">
            <div className="flex flex-row items-center space-x-4 mb-6">
                <img src="https://i.imgur.com/6VDme5u.jpg" alt="Cameron Williamson" className="w-20 h-20 rounded-full" />
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold">Cameron Williamson</h2>
                    <button onClick={updateProfile} className="text-blue-600">Edit</button>
                </div>
            </div>
            <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        name="firstName"
                        value={userData.firstName}
                        onChange={(e) => handleInputChange(e, setUserData)}
                        className="border p-2 rounded"
                        placeholder="First name"
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={userData.lastName}
                        onChange={(e) => handleInputChange(e, setUserData)}
                        className="border p-2 rounded"
                        placeholder="Last name"
                    />
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={(e) => handleInputChange(e, setUserData)}
                        className="border p-2 rounded"
                        placeholder="Email"
                    />
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={userData.phoneNumber}
                        onChange={(e) => handleInputChange(e, setUserData)}
                        className="border p-2 rounded"
                        placeholder="Phone Number"
                    />
                </div>
                <h3 className="text-lg font-semibold mb-4">Reset Your Password</h3>
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={(e) => handleInputChange(e, setPasswordData)}
                        className="border p-2 rounded"
                        placeholder="Current Password"
                    />
                    <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={(e) => handleInputChange(e, setPasswordData)}
                        className="border p-2 rounded"
                        placeholder="New Password"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={(e) => handleInputChange(e, setPasswordData)}
                        className="border p-2 rounded"
                        placeholder="Re-enter Password"
                    />
                </div>
                <button
                    onClick={updatePassword}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Update Password
                </button>
            </div>
        </div> */}
      </DashLayout>
      
   
    </Layout>
    
    </>
  );
};

export default UserProfile;
