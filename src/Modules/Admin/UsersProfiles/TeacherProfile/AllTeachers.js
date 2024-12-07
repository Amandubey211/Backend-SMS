// AllTeachers.js
import React, { useEffect, useState, useRef } from "react";
import { FiLoader } from "react-icons/fi";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import CreateRole from "../../../../Components/Common/RBAC/CreateRole";
import { useDispatch, useSelector } from "react-redux";
import AddUser from "../StaffProfile/AddUser";
import { GoAlertFill, GoPlus } from "react-icons/go";
import ProfileCard from "../SubComponents/ProfileCard";
import ViewTeacher from "./SingleTeacher";
import { fetchAllTeachers } from "../../../../Store/Slices/Admin/Class/Teachers/teacherThunks";
import Spinner from "../../../../Components/Common/Spinner";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FiLock, FiUserPlus } from "react-icons/fi";
const AllTeachers = () => {
  const { t } = useTranslation("admAccounts");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [sortDropdown, setSortDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { allTeachers, loading: teacherLoading } = useSelector(
    (store) => store.admin.teacher
  );
  const { loading } = useSelector((store) => store.admin.all_staff);
  const dispatch = useDispatch();
  const role = useSelector((store) => store.common.auth.role);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllTeachers());
  }, [dispatch]);

  useEffect(() => {
    // Close dropdown when clicking outside
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

  const handleSidebarOpen = (content, data = null) => {
    setSidebarContent(content);
    setTeacherData(data);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => setSidebarOpen(false);

  const editUser = (event, data) => {
    event.stopPropagation();
    handleSidebarOpen("editTeacher", data);
  };

  const handleStaffClick = (staff) => {
    handleSidebarOpen("viewTeacher", staff);
  };

  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewTeacher":
        return <ViewTeacher staff={teacherData} />;
      case "addTeacher":
        return <AddUser role="teacher" />;
      case "editTeacher":
        return <AddUser role="teacher" data={teacherData} />;
      case "createRole":
        return <CreateRole onClose={handleSidebarClose} department="Teacher" />;
      default:
        return <div>{t("Select an action")}</div>;
    }
  };

  return (
    <Layout title={t("All Teachers")}>
      <DashLayout>
        {loading || teacherLoading ? (
          <div className="flex w-full h-[90vh] flex-col items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="p-4 relative">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4 border-b-2 h-20">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  {t("All Teachers")}
                  {/* Gradient Circle Badge */}
                  <span className="inline-flex items-center justify-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-[2px]">
                      <span className="flex items-center justify-center w-full h-full bg-pink-50 rounded-full text-sm font-medium text-pink-600">
                        {allTeachers?.length}
                      </span>
                    </span>
                  </span>
                </h2>

                {/* Sort Button with Gradient Border */}
                <div className="relative" ref={dropdownRef}>
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-[2px] rounded-md">
                    <button
                      onClick={() => setSortDropdown(!sortDropdown)}
                      className="inline-flex items-center gap-2 px-4 py-1 bg-white rounded-md text-gray-800 font-medium"
                    >
                      <span>Sort</span>
                      {/* Icon can be replaced with a more appropriate "filter/sort" icon if desired */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-800"
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
                  </div>

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

              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/users/manage-roles")}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md inline-flex items-center gap-2 hover:opacity-90 transition duration-200"
                >
                  <FiLock className="text-white" />
                  Manage roles
                </button>

                <button
                  onClick={() => handleSidebarOpen("createRole")}
                  className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
                >
                  <span className="text-gray-800 font-medium">Create role</span>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                    <FiUserPlus size={16} />
                  </div>
                </button>
              </div>
            </div>

            {/* Teachers List */}
            <div className="flex flex-wrap -mx-2">
              {allTeachers?.length > 0 ? (
                allTeachers?.map((teacher, index) => (
                  <ProfileCard
                    key={index}
                    profile={teacher}
                    editUser={editUser}
                    onClick={handleStaffClick}
                  />
                ))
              ) : (
                <div className="flex w-[80vw] text-gray-500 h-[90vh] items-center justify-center flex-col text-2xl">
                  <GoAlertFill className="text-[5rem]" />
                  {t("No Teacher Found")}
                </div>
              )}
            </div>

            {/* Floating Action Button */}
            {role === "admin" && (
              <button
                onClick={() => handleSidebarOpen("addTeacher")}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition duration-200"
              >
                <GoPlus className="text-2xl" />
              </button>
            )}
          </div>
        )}

        {/* Sidebar */}
        <SidebarSlide
          key={sidebarContent}
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          title={
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
              {sidebarContent === "viewTeacher"
                ? t("Quick View of Teacher")
                : sidebarContent === "createRole"
                ? "Create New Role"
                : t("Add/Edit Teacher")}
            </span>
          }
          width={sidebarContent === "viewTeacher" ? "30%" : "75%"}
          height="100%"
        >
          {renderSidebarContent()}
        </SidebarSlide>
      </DashLayout>
    </Layout>
  );
};

export default AllTeachers;
