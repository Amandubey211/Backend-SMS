// AllStaff.js
import React, { useEffect, useState, useRef } from "react";
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
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import Header from "../Component/Header";
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
  const [filterOptions, setFilterOptions] = useState([]); // Array of filter criteria
  const [sortedStaff, setSortedStaff] = useState([]);

  // Redux Selectors
  const { staff, loading } = useSelector((store) => store.admin.all_staff);
  const role = useSelector((store) => store.common.auth.role);
  const { roles: AllRoles } = useSelector((state) => state.admin.rbac); // Assuming RBAC is set up similarly

  // Fetch Staff and Roles on Mount
  useEffect(() => {
    dispatch(fetchAllStaff());
    // If roles are needed for filtering, ensure they are fetched here
  }, [dispatch]);

  // Initialize sortedStaff with allStaff
  useEffect(() => {
    setSortedStaff(staff);
  }, [staff]);

  // Apply Sorting and Filtering
  useEffect(() => {
    let filtered = [...staff];

    // Apply Role Filtering
    if (filterOptions.length > 0) {
      filtered = filtered.filter((member) =>
        member.position.some((pos) => filterOptions.includes(pos))
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
  }, [sortOption, filterOptions, staff]);

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
    setFilterOptions(filterOptions);
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
        return <AddUser role="staff" data={staffData} />;
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
        {loading ? (
          <div className="flex w-full h-[90vh] flex-col items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="p-4 relative">
            {/* Reusable Header Component */}
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
            {role === "admin" && (
              <button
                onClick={handleAddStaffClick}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition duration-200"
                aria-label="Add New Staff"
              >
                <GoPlus className="text-2xl" />
              </button>
            )}
          </div>
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
              : t("Add/Edit Staff")}
          </span>
        }
        width={sidebarContent === "viewStaff" ? "30%" : "60%"}
        height="100%"
      >
        {renderSidebarContent()}
      </SidebarSlide>
    </Layout>
  );
};

export default AllStaff;
