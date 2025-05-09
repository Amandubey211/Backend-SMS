// AllLibrarian.js
import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import Spinner from "../../../../Components/Common/Spinner";
import CreateRole from "../../../../Components/Common/RBAC/CreateRole";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { fetchAllStaff } from "../../../../Store/Slices/Admin/Users/Staff/staff.action";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import Header from "../Component/Header";
import { getAllRolesThunk } from "../../../../Store/Slices/Common/RBAC/rbacThunks";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import ViewHelper from "./ViewHelper";
import { fetchHelperList } from "../../../../Store/Slices/Transportation/Helper/helper.action";
import ProfileHelperCard from "../SubComponents/ProfileHelperCard";
import AddHelper from "./AddHelper";

const AllHelper = () => {
    const { t } = useTranslation("admAccounts");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarContent, setSidebarContent] = useState(null);
    const [selectedHelper, setSelectedHelper] = useState(null);
    const [helperData, setHelperData] = useState(null);
    const [sortOption, setSortOption] = useState(null);
    const [filterRoles, setFilterRoles] = useState([]);
    const [sortedHelpers, setSortedHelpers] = useState([]);

    const { helpers, loading: helperLoading } = useSelector(
        (store) => store.transportation.transportHelper
    );
    const role = useSelector((store) => store.common.auth.role);
    const { roles: AllRoles } = useSelector((state) => state.admin.rbac);

    useEffect(() => {
        dispatch(fetchHelperList());
        dispatch(getAllRolesThunk());
    }, [dispatch]);

    useEffect(() => {
        setSortedHelpers(helpers);
    }, [helpers]);

    useEffect(() => {
        let filtered = [...helpers];

        if (filterRoles.length > 0) {
            filtered = filtered.filter((member) =>
                member.position.some((pos) => filterRoles.includes(pos))
            );
        }

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

        setSortedHelpers(filtered);
    }, [sortOption, filterRoles, helpers]);

    const handleSidebarOpen = (content, data = null) => {
        setSidebarContent(content);
        setSelectedHelper(data);
        setHelperData(data);
        setSidebarOpen(true);
    };

    const handleSidebarClose = () => setSidebarOpen(false);

    const editUser = (event, data) => {
        event.stopPropagation();
        handleSidebarOpen("editHelper", data);
    };

    const handleHelperClick = (helperMember) => {
        handleSidebarOpen("viewHelper", helperMember);
    };

    const handleAddHelperClick = () => {
        handleSidebarOpen("addHelper");
        setHelperData(null);
    };

    const helperRoles =
        AllRoles?.filter(
            (dept) => dept.department.toLowerCase() === "helper"
        )?.flatMap((dept) => dept.roles) || [];

    const sortOptions = [
        { label: "By Date", value: "by_date" },
        { label: "By Roles", value: "by_roles" },
    ];

    const filterOptionsList = helperRoles.map((roleItem) => ({
        label: roleItem.name,
        value: roleItem.name,
    }));

    const handleSortFilterApply = ({ sortOption, filterOptions }) => {
        setSortOption(sortOption);
        setFilterRoles(filterOptions);
    };

    const navigateToManageRoles = () => {
        navigate("/users/manage-roles", {
            state: { department: "helper" },
        });
    };

    const handleCreateRole = () => {
        handleSidebarOpen("createRole");
    };

    useNavHeading("User", "Helpers");

    const renderSidebarContent = () => {
        switch (sidebarContent) {
            case "viewHelper":
                return <ViewHelper helper={selectedHelper} />; // You may want to rename ViewHelper to ViewHelper
            case "addHelper":
                return <AddHelper role="staff" />;
            case "editHelper":
                return <AddHelper role="staff" data={helperData} />;
            case "createRole":
                return (
                    <CreateRole onClose={handleSidebarClose} department="staff" />
                );
            default:
                return <div>{t("Select an action")}</div>;
        }
    };

    return (
        <Layout title={t("All Helpers")}>
            <DashLayout>
                {helperLoading ? (
                    <div className="flex w-full h-[90vh] flex-col items-center justify-center">
                        <Spinner />
                    </div>
                ) : (
                    <ProtectedSection
                        requiredPermission={PERMISSIONS.VIEW_HELPER}
                        title={"All Helpers"}
                    >
                        <div className="p-4 relative">
                            <Header
                                title={t("All Helpers")}
                                count={helpers?.length || 0}
                                sortOptions={sortOptions}
                                filterOptions={filterOptionsList}
                                department="Helpers"
                                onSortFilterApply={handleSortFilterApply}
                                navigateToManageRoles={navigateToManageRoles}
                                handleCreateRole={handleCreateRole}
                                isAdmin={role === "admin"}
                                currentSort={sortOption}
                                currentFilters={filterRoles}
                            />

                            <div className="flex flex-wrap -mx-2">
                                {sortedHelpers?.length > 0 ? (
                                    sortedHelpers.map((helper) => (
                                        <ProfileHelperCard
                                            key={helper._id}
                                            profile={helper}
                                            onClick={() => handleHelperClick(helper)}
                                            editUser={editUser}
                                        />
                                    ))
                                ) : (
                                    <div className="flex w-full text-gray-500 h-[90vh] items-center justify-center flex-col text-2xl">
                                        <NoDataFound />
                                    </div>
                                )}
                            </div>

                            <ProtectedAction requiredPermission={PERMISSIONS.ADD_HELPER}>
                                <button
                                    onClick={handleAddHelperClick}
                                    className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition duration-200"
                                    aria-label="Add New Helper"
                                >
                                    <GoPlus className="text-2xl" />
                                </button>
                            </ProtectedAction>
                        </div>
                    </ProtectedSection>
                )}
            </DashLayout>

            <SidebarSlide
                key={sidebarContent}
                isOpen={isSidebarOpen}
                onClose={handleSidebarClose}
                title={
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                        {sidebarContent === "viewHelper"
                            ? t("Quick View of Helper")
                            : sidebarContent === "createRole"
                                ? t("Create New Role")
                                : helperData
                                    ? t("Edit Helper")
                                    : t("Add Helper")}
                    </span>
                }
                width={
                    sidebarContent === "viewHelper"
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

export default AllHelper;

