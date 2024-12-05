import React, { useEffect, useState, useRef } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import ViewLibrarian from "./ViewLibrarian";
import ProfileCard from "../SubComponents/ProfileCard";
import { useDispatch, useSelector } from "react-redux";
import AddUser from "../StaffProfile/AddUser";
import { GoAlertFill, GoPlus } from "react-icons/go";
import Spinner from "../../../../Components/Common/Spinner";
import { useTranslation } from "react-i18next";
import { fetchAllStaff } from "../../../../Store/Slices/Admin/Users/Staff/staff.action";
import CreateRole from "../../../../Components/Common/RBAC/CreateRole";

const AllLibrarian = () => {
  const { t } = useTranslation("admAccounts");

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [selectedLibrarian, setSelectedLibrarian] = useState(null);
  const [librarianData, setLibrarianData] = useState(null);
  const [isCreateRoleOpen, setCreateRoleOpen] = useState(false);
  const [sortDropdown, setSortDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { librarian, loading } = useSelector((store) => store.admin.all_staff);
  const role = useSelector((store) => store.common.auth.role);
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

  const handleAppointmentClick = (librarian) => {
    setSelectedLibrarian(librarian);
    setSidebarContent("viewLibrarian");
    setSidebarOpen(true);
  };

  const handleAddLibrarianClick = () => {
    setSidebarContent("addLibrarian");
    setSidebarOpen(true);
    setLibrarianData(null);
  };

  const editUser = (event, librarian) => {
    event.stopPropagation();
    setSidebarContent("editLibrarian");
    setSidebarOpen(true);
    setLibrarianData(librarian);
  };

  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewLibrarian":
        return <ViewLibrarian librarian={selectedLibrarian} />;
      case "addLibrarian":
        return <AddUser role="librarian" data={librarianData} />;
      case "editLibrarian":
        return <AddUser role="librarian" data={librarianData} />;
      default:
        return <div>{t("Select an action")}</div>;
    }
  };

  return (
    <Layout title={t("All Librarian")}>
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
                  {t("All Librarian")}
                  <span className="bg-purple-400 px-2 text-sm py-1 rounded-full">
                    {librarian?.length}
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

            {/* Librarian List */}
            <div className="flex flex-wrap -mx-2">
              {librarian?.length > 0 ? (
                librarian?.map((librarian, index) => (
                  <ProfileCard
                    key={index}
                    profile={librarian}
                    onClick={handleAppointmentClick}
                    editUser={role === "admin" ? editUser : null}
                  />
                ))
              ) : (
                <div>
                  <div className="flex w-[80vw] text-gray-500 h-[90vh] items-center justify-center flex-col text-2xl">
                    <GoAlertFill className="text-[5rem]" />
                    {t("No Librarian Found")}
                  </div>
                </div>
              )}
            </div>

            {/* Floating Action Button */}
            {role === "admin" && (
              <button
                onClick={handleAddLibrarianClick}
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
              {sidebarContent === "viewLibrarian"
                ? t("Quick View of Librarian")
                : t("Add/Edit Librarian")}
            </span>
          }
          width={sidebarContent === "viewLibrarian" ? "30%" : "60%"}
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

export default AllLibrarian;
