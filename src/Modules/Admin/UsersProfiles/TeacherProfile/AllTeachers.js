import React, { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import { useDispatch, useSelector } from "react-redux";
import AddUser from "../StaffProfile/AddUser";
import { GoAlertFill } from "react-icons/go";
import ProfileCard from "../SubComponents/ProfileCard";
import ViewTeacher from "./SingleTeacher";
import { fetchAllTeachers } from "../../../../Store/Slices/Admin/Class/Teachers/teacherThunks";
import Spinner from "../../../../Components/Common/Spinner";
import ManageRoles from "../../../../Components/Common/RBAC/ManageRole"; // Reusable Manage Roles Component
import CreateRole from "../../../../Components/Common/RBAC/CreateRole"; // Reusable Create Role Component
import { useTranslation } from "react-i18next";

const AllTeachers = () => {
  const { t } = useTranslation("admAccounts");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [isManageRoleOpen, setManageRoleOpen] = useState(false);
  const [isCreateRoleOpen, setCreateRoleOpen] = useState(false);
  const [sortDropdown, setSortDropdown] = useState(false);

  const { allTeachers, loading: teacherLoading } = useSelector(
    (store) => store.admin.teacher
  );
  const { loading } = useSelector((store) => store.admin.all_staff);
  const dispatch = useDispatch();
  const role = useSelector((store) => store.common.auth.role);

  useEffect(() => {
    dispatch(fetchAllTeachers());
  }, [dispatch]);

  const [sidebarContent, setSidebarContent] = useState(null);

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
    setTeacherData(null);
    setSidebarContent("addTeacher");
  };

  const handleSidebarClose = () => setSidebarOpen(false);

  const editUser = async (event, data) => {
    event.stopPropagation();
    setSidebarContent("editTeacher");
    setSidebarOpen(true);
    setTeacherData(data);
  };

  const handleStaffClick = (staff) => {
    setTeacherData(staff);
    setSidebarContent("viewTeacher");
    setSidebarOpen(true);
  };

  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewTeacher":
        return <ViewTeacher staff={teacherData} />;
      case "addTeacher":
        return <AddUser role="teacher" />;
      case "editTeacher":
        return <AddUser role={"teacher"} data={teacherData} />;
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
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {t("All Teachers")}
                <span className="bg-purple-400 px-2 text-sm py-1 rounded-full">
                  {allTeachers?.length}
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  // onClick={() => setManageRoleOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md flex items-center gap-2"
                >
                  <span>Manage Roles</span>
                </button>
                <button
                  onClick={() => setCreateRoleOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md flex items-center gap-2"
                >
                  <span>Create Role</span>
                </button>
              </div>
            </div>

            {/* Sort Button */}
            <div className="flex items-center mb-4">
              <div className="relative">
                <button
                  onClick={() => setSortDropdown(!sortDropdown)}
                  className="border border-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  Sort
                </button>
                {sortDropdown && (
                  <div className="absolute mt-2 bg-white border border-gray-300 rounded-lg shadow-md">
                    <button className="block px-4 py-2 hover:bg-gray-100">
                      By Date
                    </button>
                    <button className="block px-4 py-2 hover:bg-gray-100">
                      By Roles
                    </button>
                  </div>
                )}
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
                onClick={handleSidebarOpen}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
              >
                +
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
                : t("Add/Edit Teacher")}
            </span>
          }
          width={sidebarContent === "viewTeacher" ? "30%" : "60%"}
          height="100%"
        >
          {renderSidebarContent()}
        </SidebarSlide>

        {/* Manage Roles Modal */}
        {isManageRoleOpen && (
          <ManageRoles
            isOpen={isManageRoleOpen}
            onClose={() => setManageRoleOpen(false)}
          />
        )}

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

export default AllTeachers;
