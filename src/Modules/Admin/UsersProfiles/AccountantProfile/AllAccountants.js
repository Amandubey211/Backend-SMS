// AllAccountants.js
import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import ViewAccountant from "./ViewAccountant";
import ProfileCard from "../SubComponents/ProfileCard";
import AddUser from "../StaffProfile/AddUser";
import Spinner from "../../../../Components/Common/Spinner";
import CreateRole from "../../../../Components/Common/RBAC/CreateRole";
import NoDataFound from "../../../../Components/Common/NoDataFound";

import { fetchAllStaff } from "../../../../Store/Slices/Admin/Users/Staff/staff.action";
import { getAllRolesThunk } from "../../../../Store/Slices/Common/RBAC/rbacThunks"; // Ensure this path is correct
import Header from "../Component/Header";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";

const AllAccountants = () => {
  const { t } = useTranslation("admAccounts");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State Variables
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [selectedAccountant, setSelectedAccountant] = useState(null);
  const [accountantData, setAccountantData] = useState(null);
  const [sortOption, setSortOption] = useState(null); // "by_date" or "by_roles"
  const [filterRoles, setFilterRoles] = useState([]); // Array of role names
  const [sortedAccountants, setSortedAccountants] = useState([]);

  // Redux Selectors
  const { finance, loading: accountantLoading } = useSelector(
    (store) => store.admin.all_staff
  );
  const role = useSelector((store) => store.common.auth.role);
  const { roles: AllRoles } = useSelector((state) => state.admin.rbac); // Ensure RBAC is set up correctly

  // Fetch Accountants and Roles on Mount
  useEffect(() => {
    dispatch(fetchAllStaff());
    dispatch(getAllRolesThunk()); // Fetch roles for filtering
  }, [dispatch]);

  // Initialize sortedAccountants with finance data
  useEffect(() => {
    setSortedAccountants(finance);
  }, [finance]);

  // Apply Sorting and Filtering
  useEffect(() => {
    let filtered = [...finance];

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

    setSortedAccountants(filtered);
  }, [sortOption, filterRoles, finance]);

  // Handlers
  const handleSidebarOpen = (content, data = null) => {
    setSidebarContent(content);
    setSelectedAccountant(data);
    setAccountantData(data);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => setSidebarOpen(false);

  const editUser = (event, data) => {
    event.stopPropagation();
    handleSidebarOpen("editAccountant", data);
  };

  const handleAccountantClick = (accountantMember) => {
    handleSidebarOpen("viewAccountant", accountantMember);
  };

  const handleAddAccountantClick = () => {
    handleSidebarOpen("addAccountant");
    setAccountantData(null);
  };

  // Extract Accountant Roles from AllRoles
  const accountantRoles =
    AllRoles?.filter(
      (dept) => dept.department.toLowerCase() === "finance"
    )?.flatMap((dept) => dept.roles) || [];

  // Define Sort and Filter Options
  const sortOptions = [
    { label: "By Date", value: "by_date" },
    { label: "By Roles", value: "by_roles" },
  ];

  const filterOptionsList = accountantRoles.map((roleItem) => ({
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

  useNavHeading("User", "Finance"); // Ensure correct import and usage

  // Define the renderSidebarContent function
  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewAccountant":
        return <ViewAccountant finance={selectedAccountant} />;
      case "addAccountant":
        return <AddUser role="finance" />;
      case "editAccountant":
        return <AddUser role="finance" data={accountantData} />;
      case "createRole":
        return <CreateRole onClose={handleSidebarClose} department="Finance" />;
      default:
        return <div>{t("Select an action")}</div>;
    }
  };

  return (
    <Layout title={t("All Accountants")}>
      <DashLayout>
        {accountantLoading ? (
          <div className="flex w-full h-[90vh] flex-col items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ProtectedSection requiredPermission={PERMISSIONS} title={"All Accountants"}>
          <div className="p-4 relative">
            {/* Reusable Header Component with currentSort and currentFilters */}
            <Header
              title={t("All Finance")}
              count={finance?.length || 0}
              sortOptions={sortOptions}
              filterOptions={filterOptionsList}
              department="Finance"
              onSortFilterApply={handleSortFilterApply}
              navigateToManageRoles={navigateToManageRoles}
              handleCreateRole={handleCreateRole}
              isAdmin={role === "admin"}
              currentSort={sortOption} // Pass current sort
              currentFilters={filterRoles} // Pass current filters
            />

            {/* Accountant List */}
            <div className="flex flex-wrap -mx-2">
              {sortedAccountants?.length > 0 ? (
                sortedAccountants.map((acc) => (
                  <ProfileCard
                    key={acc._id} // Use a unique identifier
                    profile={acc}
                    onClick={() => handleAccountantClick(acc)}
                    editUser={
                      role === "admin" ? (event) => editUser(event, acc) : null
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
                onClick={handleAddAccountantClick}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition duration-200"
                aria-label="Add New Accountant"
              >
                <GoPlus className="text-2xl" />
              </button>
            )}
          </div>
          </ProtectedSection>
        )}
      </DashLayout>

      {/* Sidebar */}
      <SidebarSlide
        key={sidebarContent} // Use the key to force re-render
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title={
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
            {sidebarContent === "viewAccountant"
              ? t("Quick View of Accountant")
              : sidebarContent === "createRole"
              ? t("Create New Role")
              : accountantData ? t("Edit Finance User") : t("Add Finance User")}
          </span>
        }
        width={
          sidebarContent === "viewAccountant"
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

export default AllAccountants;
