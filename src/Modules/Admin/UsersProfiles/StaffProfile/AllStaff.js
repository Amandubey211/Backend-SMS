// AllStaff.js
import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import ViewStaff from "./ViewStaff";
import ProfileCard from "../SubComponents/ProfileCard";
import AddUser from "./AddUser";
import Spinner from "../../../../Components/Common/Spinner";
import CreateRole from "../../../../Components/Common/RBAC/CreateRole";
import NoDataFound from "../../../../Components/Common/NoDataFound";

import { fetchAllStaff } from "../../../../Store/Slices/Admin/Users/Staff/staff.action";
import Header from "../Component/Header";
import { getAllRolesThunk } from "../../../../Store/Slices/Common/RBAC/rbacThunks";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";

const AllStaff = () => {
  const { t } = useTranslation("admAccounts");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State Variables
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffData, setStaffData] = useState(null);
  const [sortOption, setSortOption] = useState(null); // "by_date" or "by_roles"
  const [filterRoles, setFilterRoles] = useState([]); // Array of role names
  const [sortedStaff, setSortedStaff] = useState([]);

  // Redux Selectors
  const { staff, loading: staffLoading } = useSelector(
    (store) => store.admin.all_staff
  );
  const role = useSelector((store) => store.common.auth.role);
  const { roles: AllRoles } = useSelector((state) => state.admin.rbac); // Ensure RBAC is set up correctly

  // Fetch Staff and Roles on Mount
  useEffect(() => {
    dispatch(fetchAllStaff());
    dispatch(getAllRolesThunk()); // Fetch roles for filtering
  }, [dispatch]);

  // Initialize sortedStaff with allStaff
  useEffect(() => {
    setSortedStaff(staff);
  }, [staff]);

  // Apply Sorting and Filtering
  useEffect(() => {
    let filtered = [...staff];

    // Apply Role Filtering
    if (filterRoles.length > 0) {
      filtered = filtered.filter((member) =>
        member.position.some((pos) => filterRoles.includes(pos))
      );
    }

    // Apply Sorting
    if (sortOption) {
      switch (sortOption) {
        case "by_date":
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "by_roles":
          filtered.sort((a, b) => a.position.length - b.position.length);
          break;
        default:
          break;
      }
    }

    setSortedStaff(filtered);
  }, [sortOption, filterRoles, staff]);

  // Handlers
  const handleSidebarOpen = (content, data = null) => {
    setSidebarContent(content);
    setSelectedStaff(data);
    setStaffData(data);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => setSidebarOpen(false);

  const editUser = (event, data) => {
    event.stopPropagation();
    handleSidebarOpen("editStaff", data);
  };

  const handleStaffClick = (staffMember) => {
    handleSidebarOpen("viewStaff", staffMember);
  };

  const handleAddStaffClick = () => {
    handleSidebarOpen("addStaff");
    setStaffData(null);
  };

  // Extract Staff Roles from AllRoles
  const staffRoles =
    AllRoles?.filter(
      (dept) => dept.department.toLowerCase() === "staff"
    )?.flatMap((dept) => dept.roles) || [];

  // Define Sort and Filter Options
  const sortOptions = [
    { label: "By Date", value: "by_date" },
    { label: "By Roles", value: "by_roles" },
  ];

  const filterOptionsList = staffRoles.map((roleItem) => ({
    label: roleItem.name,
    value: roleItem.name,
  }));

  // Handler for applying sort and filter
  const handleSortFilterApply = ({ sortOption, filterOptions }) => {
    setSortOption(sortOption);
    setFilterRoles(filterOptions);
  };

  // Handler for navigating to manage roles
  const navigateToManageRoles = () => {
    navigate("/users/manage-roles");
  };

  // Handler for creating a new role
  const handleCreateRole = () => {
    handleSidebarOpen("createRole");
  };

  useNavHeading("User", "Staff"); // Ensure correct import and usage

  // Define the renderSidebarContent function
  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewStaff":
        return <ViewStaff staff={selectedStaff} />;
      case "addStaff":
        return <AddUser role="staff" />;
      case "editStaff":
        return <AddUser role="staff" data={staffData} />;
      case "createRole":
        return <CreateRole onClose={handleSidebarClose} department="Staff" />;
      default:
        return <div>{t("Select an action")}</div>;
    }
  };

  return (
    <Layout title={t("Staff | Student Diwan")}>
      <DashLayout>
        {staffLoading ? (
          <div className="flex w-full h-[90vh] flex-col items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ProtectedSection requiredPermission={PERMISSIONS.VIEW_STAFF} title={"Staff"}>
            <div className="p-4 relative">
              {/* Reusable Header Component with currentSort and currentFilters */}
              <Header
                title={t("All Staff")}
                count={staff?.length || 0}
                sortOptions={sortOptions}
                filterOptions={filterOptionsList}
                department="Staff"
                onSortFilterApply={handleSortFilterApply}
                navigateToManageRoles={navigateToManageRoles}
                handleCreateRole={handleCreateRole}
                isAdmin={role === "admin"}
                currentSort={sortOption} // Pass current sort
                currentFilters={filterRoles} // Pass current filters
              />

              {/* Staff List */}
              <div className="flex flex-wrap -mx-2">
                {sortedStaff?.length > 0 ? (
                  sortedStaff.map((member) => (
                    <ProfileCard
                      key={member._id} // Use a unique identifier
                      profile={member}
                      onClick={() => handleStaffClick(member)}
                      editUser={
                        role === "admin"
                          ? (event) => editUser(event, member)
                          : null
                      }
                    />
                  ))
                ) : (
                  <div className="flex w-full text-gray-500 h-[90vh] items-center justify-center flex-col text-2xl">
                    <NoDataFound />
                  </div>
                )}
              </div>

              {/* Floating Action Button */}
              <ProtectedAction requiredPermission={PERMISSIONS.ADD_STAFF}>
                <button
                  onClick={handleAddStaffClick}
                  className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition duration-200"
                  aria-label="Add New Staff"
                >
                  <GoPlus className="text-2xl" />
                </button>
              </ProtectedAction>
            </div></ProtectedSection>
        )}
      </DashLayout>

      {/* Sidebar */}
      <SidebarSlide
        key={sidebarContent} // Use the key to force re-render
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title={
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
            {sidebarContent === "viewStaff"
              ? t("Quick View of Staff")
              : sidebarContent === "createRole"
                ? t("Create New Role")
                : staffData ? t("Edit Staff") : t("Add Staff")}
          </span>
        }
        width={
          sidebarContent === "viewStaff"
            ? "30%"
            : sidebarContent === "createRole"
              ? "60%"
              : "75%"
        }
        height="100%"
      >
        {renderSidebarContent()}
      </SidebarSlide>
    </Layout>
  );
};

export default AllStaff;
