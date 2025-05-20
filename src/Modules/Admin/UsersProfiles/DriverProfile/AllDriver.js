// AllLibrarian.js
import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Skeleton, Card, Row, Col } from 'antd';

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
import { fetchDriverList } from "../../../../Store/Slices/Transportation/Driver/driver.action";
import AddDriver from "./AddDriver";
import ViewDriver from "./ViewDriver";
import ProfileDriverCard from "../SubComponents/ProfileDriverCard";
const DriverShimmer = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {[...Array(5)].map((_, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Skeleton.Avatar active size={64} shape="circle" style={{ marginBottom: '16px' }} />
                <Skeleton.Input active size="small" style={{ width: '80%', marginBottom: '8px' }} />
                <Skeleton.Input active size="small" style={{ width: '60%', marginBottom: '8px' }} />
                <Skeleton.Input active size="small" style={{ width: '90%' }} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
const AllDriver = () => {
    const { t } = useTranslation("admAccounts");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarContent, setSidebarContent] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [driverData, setDriverData] = useState(null);
    const [sortOption, setSortOption] = useState(null);
    const [filterRoles, setFilterRoles] = useState([]);
    const [sortedDrivers, setSortedDrivers] = useState([]);

    const { drivers, loading: driverLoading } = useSelector(
        (store) => store.transportation.transportDriver
    );
    const role = useSelector((store) => store.common.auth.role);
    const { roles: AllRoles } = useSelector((state) => state.admin.rbac);
    
    useEffect(() => {
        dispatch(fetchDriverList());
        dispatch(getAllRolesThunk());
    }, [dispatch]);
    
    useEffect(() => {
        setSortedDrivers(drivers);
    }, [drivers]);
    // console.log("drivers", drivers);

    useEffect(() => {
        let filtered = [...drivers];

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

        setSortedDrivers(filtered);
    }, [sortOption, filterRoles, drivers]);

    const handleSidebarOpen = (content, data = null) => {
        setSidebarContent(content);
        setSelectedDriver(data);
        setDriverData(data);
        setSidebarOpen(true);
    };

    const handleSidebarClose = () => setSidebarOpen(false);

    const editUser = (event, data) => {
        event.stopPropagation();
        handleSidebarOpen("editDriver", data);
    };

    const handleDriverClick = (driverMember) => {
        handleSidebarOpen("viewDriver", driverMember);
    };

    const handleAddDriverClick = () => {
        handleSidebarOpen("addDriver");
        setDriverData(null);
    };

    const driverRoles =
        AllRoles?.filter(
            (dept) => dept.department.toLowerCase() === "driver"
        )?.flatMap((dept) => dept.roles) || [];

    const sortOptions = [
        { label: "By Date", value: "by_date" },
        { label: "By Roles", value: "by_roles" },
    ];

    const filterOptionsList = driverRoles.map((roleItem) => ({
        label: roleItem.name,
        value: roleItem.name,
    }));

    const handleSortFilterApply = ({ sortOption, filterOptions }) => {
        setSortOption(sortOption);
        setFilterRoles(filterOptions);
    };

    const navigateToManageRoles = () => {
        navigate("/users/manage-roles", {
            state: { department: "driver" },
        });
    };

    const handleCreateRole = () => {
        handleSidebarOpen("createRole");
    };

    useNavHeading("User", "Drivers");

    const renderSidebarContent = () => {
        switch (sidebarContent) {
            case "viewDriver":
                return <ViewDriver driver={selectedDriver} />;
            case "addDriver":
                return <AddDriver role="staff" />;
            case "editDriver":
                return <AddDriver role="staff" data={driverData} />;
            case "createRole":
                return (
                    <CreateRole onClose={handleSidebarClose} department="staff" />
                );
            default:
                return <div>{t("Select an action")}</div>;
        }
    };

    return (
        <Layout title={t("All Drivers")}>
            <DashLayout>
                {driverLoading ? (
                    <div className="flex w-full h-[90vh] flex-col items-center justify-center">
                       <DriverShimmer />
                    </div>
                ) : (
                    <ProtectedSection
                        requiredPermission={PERMISSIONS.VIEW_DRIVER}
                        title={"All Drivers"}
                    >
                        <div className="p-4 relative">
                            <Header
                                title={t("All Drivers")}
                                count={drivers?.length || 0}
                                sortOptions={sortOptions}
                                filterOptions={filterOptionsList}
                                department="Drivers"
                                onSortFilterApply={handleSortFilterApply}
                                navigateToManageRoles={navigateToManageRoles}
                                handleCreateRole={handleCreateRole}
                                isAdmin={role === "admin"}
                                currentSort={sortOption}
                                currentFilters={filterRoles}
                            />

                            <div className="flex flex-wrap -mx-2">
                                {sortedDrivers?.length > 0 ? (
                                    sortedDrivers.map((driver) => (
                                        <ProfileDriverCard
                                            key={driver._id}
                                            profile={driver}
                                            onClick={() => handleDriverClick(driver)}
                                            editUser={editUser}
                                        />
                                    ))
                                ) : (
                                    <div className="flex w-full text-gray-500 h-[90vh] items-center justify-center flex-col text-2xl">
                                        <NoDataFound />
                                    </div>
                                )}
                            </div>

                            <ProtectedAction requiredPermission={PERMISSIONS.ADD_DRIVER}>
                                <button
                                    onClick={handleAddDriverClick}
                                    className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition duration-200"
                                    aria-label="Add New Driver"
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
                        {sidebarContent === "viewDriver"
                            ? t("Quick View of Driver")
                            : sidebarContent === "createRole"
                                ? t("Create New Role")
                                : driverData
                                    ? t("Edit Driver")
                                    : t("Add Driver")}
                    </span>
                }
                width={
                    sidebarContent === "viewDriver"
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

export default AllDriver;

