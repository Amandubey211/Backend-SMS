import React, { useEffect, useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import CreateRole from "../../../../Components/Common/RBAC/CreateRole";
import AddUser from "../StaffProfile/AddUser";
import ProfileCard from "../SubComponents/ProfileCard";
import ViewTeacher from "./SingleTeacher";
import Spinner from "../../../../Components/Common/Spinner";
import NoDataFound from "../../../../Components/Common/NoDataFound";

import { fetchAllTeachers } from "../../../../Store/Slices/Admin/Class/Teachers/teacherThunks";
import { getAllRolesThunk } from "../../../../Store/Slices/Common/RBAC/rbacThunks";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import Header from "../Component/Header";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";

const AllTeachers = () => {
  const { t } = useTranslation("admAccounts");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State Variables
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [sortOption, setSortOption] = useState(null);
  const [filterRoles, setFilterRoles] = useState([]);
  const [sortedTeachers, setSortedTeachers] = useState([]);

  // Redux Selectors
  const { allTeachers, loading: teacherLoading } = useSelector(
    (store) => store.admin.teacher
  );
  const { loading } = useSelector((store) => store.admin.all_staff);
  const role = useSelector((store) => store.common.auth.role);
  const { roles: AllRoles } = useSelector((state) => state.admin.rbac);

  // Fetch Teachers and Roles on Mount
  useEffect(() => {
    dispatch(fetchAllTeachers());
    dispatch(getAllRolesThunk());
  }, [dispatch]);

  // Initialize sortedTeachers with allTeachers
  useEffect(() => {
    setSortedTeachers(allTeachers);
  }, [allTeachers]);

  // Apply Sorting and Filtering
  useEffect(() => {
    let filtered = [...allTeachers];

    // Role Filtering
    if (filterRoles.length > 0) {
      filtered = filtered.filter((teacher) =>
        teacher.position.some((pos) => filterRoles.includes(pos))
      );
    }

    // Sorting
    if (sortOption) {
      switch (sortOption) {
        case "date_newest":
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "date_oldest":
          filtered.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          break;
        default:
          break;
      }
    }

    setSortedTeachers(filtered);
  }, [sortOption, filterRoles, allTeachers]);

  // Handlers
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
        return <AddUser role="teacher" data={null} />;
      case "editTeacher":
        return <AddUser role="teacher" data={teacherData} />;
      case "createRole":
        return <CreateRole onClose={handleSidebarClose} department="Teacher" />;
      default:
        return <div>{t("Select an action")}</div>;
    }
  };

  useNavHeading("User", "Teachers");

  // Extract Teacher Roles from AllRoles
  const teacherRoles =
    AllRoles?.filter(
      (dept) => dept.department.toLowerCase() === "teacher"
    )?.flatMap((dept) => dept.roles) || [];

  // Define Sort and Filter Options
  const sortOptions = [
    { label: "Newest First", value: "date_newest" },
    { label: "Oldest First", value: "date_oldest" },
  ];

  const filterOptions = teacherRoles.map((roleItem) => ({
    label: roleItem.name,
    value: roleItem.name,
  }));

  const handleSortFilterApply = ({ sortOption, filterOptions }) => {
    setSortOption(sortOption);
    setFilterRoles(filterOptions);
  };

  /**
   * Pass the department to the `navigate()` call via `state`.
   * This ensures `ManageRolePage` can pick it up from `location.state.department`.
   */
  const navigateToManageRoles = (dept) => {
    navigate("/users/manage-roles", {
      state: { department: dept },
    });
  };

  const handleCreateRole = () => {
    handleSidebarOpen("createRole");
  };

  return (
    <Layout title={t("All Teachers")}>
      <DashLayout>
        {loading || teacherLoading ? (
          <div className="flex w-full h-[90vh] flex-col items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ProtectedSection
            requiredPermission={PERMISSIONS.VIEW_TEACHER}
            title={"Teacher"}
          >
            <div className="p-4 relative">
              <Header
                title={t("All Teachers")}
                count={allTeachers?.length || 0}
                sortOptions={sortOptions}
                filterOptions={filterOptions}
                department="Teachers" // <--- Pass the department name here
                onSortFilterApply={handleSortFilterApply}
                navigateToManageRoles={() => navigateToManageRoles("teacher")}
                handleCreateRole={handleCreateRole}
                isAdmin={role === "admin"}
                currentSort={sortOption}
                currentFilters={filterRoles}
              />

              {/* Teachers List */}
              <div className="flex flex-wrap -mx-2">
                {sortedTeachers?.length > 0 ? (
                  sortedTeachers.map((teacher) => (
                    <ProfileCard
                      key={teacher._id}
                      profile={teacher}
                      editUser={editUser}
                      onClick={handleStaffClick}
                    />
                  ))
                ) : (
                  <div className="flex w-full text-gray-500 h-[90vh] items-center justify-center flex-col text-2xl">
                    <NoDataFound />
                  </div>
                )}
              </div>

              <ProtectedAction requiredPermission={PERMISSIONS.ADD_TEACHER}>
                <button
                  onClick={() => handleSidebarOpen("addTeacher")}
                  className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition duration-200"
                  aria-label="Add New Teacher"
                >
                  <GoPlus className="text-2xl" />
                </button>
              </ProtectedAction>
            </div>
          </ProtectedSection>
        )}
      </DashLayout>

      {/* Sidebar Slide */}
      <SidebarSlide
        key={sidebarContent}
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title={
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
            {sidebarContent === "viewTeacher"
              ? t("Quick View of Teacher")
              : sidebarContent === "createRole"
              ? t("Create New Role")
              : teacherData
              ? t("Edit Teacher")
              : t("Add Teacher")}
          </span>
        }
        width={sidebarContent === "viewTeacher" ? "30%" : "75%"}
        height="100%"
      >
        {renderSidebarContent()}
      </SidebarSlide>
    </Layout>
  );
};

export default AllTeachers;
