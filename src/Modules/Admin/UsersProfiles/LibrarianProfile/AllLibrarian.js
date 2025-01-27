// AllLibrarian.js
import React, { useEffect, useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import ViewLibrarian from "./ViewLibrarian";
import ProfileCard from "../SubComponents/ProfileCard";
import AddUser from "../StaffProfile/AddUser";
import Spinner from "../../../../Components/Common/Spinner";
import CreateRole from "../../../../Components/Common/RBAC/CreateRole";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { fetchAllStaff } from "../../../../Store/Slices/Admin/Users/Staff/staff.action";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import Header from "../Component/Header";
import { getAllRolesThunk } from "../../../../Store/Slices/Common/RBAC/rbacThunks";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";

const AllLibrarian = () => {
  const { t } = useTranslation("admAccounts");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State Variables
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [selectedLibrarian, setSelectedLibrarian] = useState(null);
  const [librarianData, setLibrarianData] = useState(null);
  const [sortOption, setSortOption] = useState(null); // "by_date" or "by_roles"
  const [filterRoles, setFilterRoles] = useState([]); // Array of role names
  const [sortedLibrarians, setSortedLibrarians] = useState([]);

  // Redux Selectors
  const { librarian, loading: librarianLoading } = useSelector(
    (store) => store.admin.all_staff
  );
  const role = useSelector((store) => store.common.auth.role);
  const { roles: AllRoles } = useSelector((state) => state.admin.rbac); // Assuming RBAC is set up similarly

  // Fetch Librarians and Roles on Mount
  useEffect(() => {
    dispatch(fetchAllStaff());
    dispatch(getAllRolesThunk()); // Ensure roles are fetched if needed for filtering
  }, [dispatch]);

  // Initialize sortedLibrarians with librarian data
  useEffect(() => {
    setSortedLibrarians(librarian);
  }, [librarian]);

  // Apply Sorting and Filtering
  useEffect(() => {
    let filtered = [...librarian];

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

    setSortedLibrarians(filtered);
  }, [sortOption, filterRoles, librarian]);

  // Handlers
  const handleSidebarOpen = (content, data = null) => {
    setSidebarContent(content);
    setSelectedLibrarian(data);
    setLibrarianData(data);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => setSidebarOpen(false);

  const editUser = (event, data) => {
    event.stopPropagation();
    handleSidebarOpen("editLibrarian", data);
  };

  const handleLibrarianClick = (librarianMember) => {
    handleSidebarOpen("viewLibrarian", librarianMember);
  };

  const handleAddLibrarianClick = () => {
    handleSidebarOpen("addLibrarian");
    setLibrarianData(null);
  };

  // Extract Librarian Roles from AllRoles
  const librarianRoles =
    AllRoles?.filter(
      (dept) => dept.department.toLowerCase() === "librarian"
    )?.flatMap((dept) => dept.roles) || [];

  // Define Sort and Filter Options
  const sortOptions = [
    { label: "By Date", value: "by_date" },
    { label: "By Roles", value: "by_roles" },
  ];

  const filterOptionsList = librarianRoles.map((roleItem) => ({
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

  useNavHeading("User", "Librarians"); // Ensure correct import and usage

  // Define the renderSidebarContent function
  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewLibrarian":
        return <ViewLibrarian librarian={selectedLibrarian} />;
      case "addLibrarian":
        return <AddUser role="librarian" />;
      case "editLibrarian":
        return <AddUser role="librarian" data={librarianData} />;
      case "createRole":
        return (
          <CreateRole onClose={handleSidebarClose} department="Librarian" />
        );
      default:
        return <div>{t("Select an action")}</div>;
    }
  };

  return (
    <Layout title={t("All Librarians")}>
      <DashLayout>
        {librarianLoading ? (
          <div className="flex w-full h-[90vh] flex-col items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ProtectedSection requiredPermission={PERMISSIONS.VIEW_LIBRARIAN} title={"All Librarians"}>
          <div className="p-4 relative">
            {/* Reusable Header Component with currentSort and currentFilters */}
            <Header
              title={t("All Librarians")}
              count={librarian?.length || 0}
              sortOptions={sortOptions}
              filterOptions={filterOptionsList}
              department="Librarians"
              onSortFilterApply={handleSortFilterApply}
              navigateToManageRoles={navigateToManageRoles}
              handleCreateRole={handleCreateRole}
              isAdmin={role === "admin"}
              currentSort={sortOption} // Pass current sort
              currentFilters={filterRoles} // Pass current filters
            />

            {/* Librarian List */}
            <div className="flex flex-wrap -mx-2">
              {sortedLibrarians?.length > 0 ? (
                sortedLibrarians.map((lib) => (
                  <ProfileCard
                    key={lib._id} // Use a unique identifier
                    profile={lib}
                    onClick={() => handleLibrarianClick(lib)}
                    editUser={
                      role === "admin" ? (event) => editUser(event, lib) : null
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
                onClick={handleAddLibrarianClick}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition duration-200"
                aria-label="Add New Librarian"
              >
                <GoPlus className="text-2xl" />
              </button>
            )}
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
            {sidebarContent === "viewLibrarian"
              ? t("Quick View of Librarian")
              : sidebarContent === "createRole"
              ? t("Create New Role")
              : t("Add/Edit Librarian")}
          </span>
        }
        width={
          sidebarContent === "viewLibrarian"
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

export default AllLibrarian;
