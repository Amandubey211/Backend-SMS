import React, { useEffect, useState, useRef } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import ViewStaff from "./ViewStaff";
import ProfileCard from "../SubComponents/ProfileCard";
import { useDispatch, useSelector } from "react-redux";
import AddUser from "./AddUser";
import { FiLoader } from "react-icons/fi";
import { GoAlertFill, GoPlus } from "react-icons/go";
import { fetchAllStaff } from "../../../../Store/Slices/Admin/Users/Staff/staff.action";
import Spinner from "../../../../Components/Common/Spinner";
import { useTranslation } from "react-i18next";
import CreateRole from "../../../../Components/Common/RBAC/CreateRole";

const AllStaff = () => {
  const { t } = useTranslation("admAccounts");

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffData, setStaffData] = useState(null);
  const [isCreateRoleOpen, setCreateRoleOpen] = useState(false);
  const [sortDropdown, setSortDropdown] = useState(false);
  const dropdownRef = useRef(null); // Ref for dropdown

  const role = useSelector((store) => store.common.auth.role);
  const { staff, loading } = useSelector((store) => store.admin.all_staff);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllStaff());
  }, [dispatch]);

  // Handle dropdown close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleStaffClick = (staff) => {
    setSelectedStaff(staff);
    setSidebarContent("viewStaff");
    setSidebarOpen(true);
  };

  const handleAddStaffClick = () => {
    setSidebarContent("addStaff");
    setSidebarOpen(true);
    setStaffData(null);
  };

  const editUser = (event, data) => {
    event.stopPropagation();
    setSidebarContent("editStaff");
    setSidebarOpen(true);
    setStaffData(data);
  };

  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewStaff":
        return <ViewStaff staff={selectedStaff} />;
      case "addStaff":
        return <AddUser role="staff" data={staffData} />;
      case "editStaff":
        return <AddUser role="staff" data={staffData} />;
      default:
        return <div>{t("Select an action")}</div>;
    }
  };

  return (
    <Layout title={t("All Staff")}>
      <DashLayout>
        {loading ? (
          <div className="flex w-full h-[90vh] flex-col items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="p-4 relative">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4 border-b-2 h-20">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {t("All Staff")}
                  <span className="bg-purple-400 px-2 text-sm py-1 rounded-full">
                    {staff?.length}
                  </span>
                </h2>

                {/* Sort Button */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setSortDropdown(!sortDropdown)}
                    className="bg-white text-black px-4 py-2 flex items-center gap-2 shadow hover:shadow-lg transition-all rounded-lg"
                    style={{
                      borderWidth: "2px",
                      borderImageSlice: 1,
                      borderImageSource: "linear-gradient(to right, #C83B62, #7F35CD)",
                    }}
                  >
                    <span className="font-medium">Sort</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h8m-8 6h16"
                      />
                    </svg>
                  </button>
                  {sortDropdown && (
                    <div className="absolute mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                      <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                        By Date
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                        By Roles
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => (window.location.href = "/manage-roles")}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md flex items-center gap-2 hover:opacity-90 transition duration-200"
                >
                  Manage Roles
                </button>
                <button
                  onClick={() => setCreateRoleOpen(true)}
                  className="px-6 py-2 border-2 border-transparent bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-full flex items-center gap-2 hover:shadow-lg transition duration-200"
                >
                  <span>Create Role</span>
                </button>
              </div>
            </div>

            {/* Staff List */}
            <div className="flex flex-wrap -mx-2">
              {staff?.length > 0 ? (
                staff?.map((profile, index) => (
                  <ProfileCard
                    key={index}
                    profile={profile}
                    onClick={handleStaffClick}
                    editUser={role === "admin" ? editUser : null}
                  />
                ))
              ) : (
                <div>
                  <div className="flex w-[80vw] text-gray-500 h-[90vh] items-center justify-center flex-col text-2xl">
                    <GoAlertFill className="text-[5rem]" />
                    {t("No Staff data Found")}
                  </div>
                </div>
              )}
            </div>

            {/* Floating Action Button */}
            {role === "admin" && (
              <button
                onClick={handleAddStaffClick}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition duration-200"
              >
                <GoPlus className="text-2xl" />
              </button>
            )}
          </div>
        )}

        {/* Sidebar */}
        <SidebarSlide
          key={sidebarContent} // Use the key to force re-render
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          title={
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
              {sidebarContent === "viewStaff"
                ? t("Quick View of Staff")
                : t("Add/Edit Staff")}
            </span>
          }
          width={sidebarContent === "viewStaff" ? "30%" : "60%"}
          height="100%"
        >
          {renderSidebarContent()}
        </SidebarSlide>

        {/* Create Role Modal */}
        {isCreateRoleOpen && (
          <CreateRole
            isOpen={isCreateRoleOpen}
            onClose={() => setCreateRoleOpen(false)}
          />
        )}
      </DashLayout>
    </Layout>
  );
};

export default AllStaff;
