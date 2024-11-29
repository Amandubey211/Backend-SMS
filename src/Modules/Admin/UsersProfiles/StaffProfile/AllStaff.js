import React, { useEffect, useState } from "react";
import Layout from '../../../../Components/Common/Layout';
import DashLayout from '../../../../Components/Admin/AdminDashLayout';
import SidebarSlide from '../../../../Components/Common/SidebarSlide';
import ViewStaff from "./ViewStaff";
import ProfileCard from "../SubComponents/ProfileCard";
import { useDispatch, useSelector } from "react-redux";
import AddUser from "./AddUser";
import { FiLoader } from "react-icons/fi";
import { GoAlertFill } from "react-icons/go";
import { fetchAllStaff } from "../../../../Store/Slices/Admin/Users/Staff/staff.action";
import Spinner from "../../../../Components/Common/Spinner";
import { useTranslation } from 'react-i18next';

const AllStaff = () => {
  const { t } = useTranslation("admAccounts");

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffData, setStaffData] = useState(null);

  // Fetch user role from the store
  const role = useSelector((store) => store.common.auth.role);

  const { staff, loading } = useSelector((store) => store.admin.all_staff);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllStaff());
  }, [dispatch]);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleStaffClick = (staff) => {
    setSelectedStaff(staff);
    setSidebarContent("viewStaff");
    setSidebarOpen(true);
  };

  const handleAddStaffClick = () => {
    setSidebarContent("addStaff");
    setSidebarOpen(true);
    setStaffData(null);
  };

  const editUser = (event, data) => {
    event.stopPropagation();
    setSidebarContent("editStaff");
    setSidebarOpen(true);
    setStaffData(data);
  };

  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewStaff":
        return <ViewStaff staff={selectedStaff} />;
      case "addStaff":
        return <AddUser role="staff" data={staffData} />;
      case "editStaff":
        return <AddUser role="staff" data={staffData} />;
      default:
        return <div>{t("Select an action")}</div>;
    }
  };

  return (
    <Layout title={t("All Staff")}>
      <DashLayout>
        {loading ? (
          <div className="flex w-full h-[90vh] flex-col items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4 border-b-2 h-20">
              <h2 className="text-xl font-semibold">
                {t("All Staff")}{" "}
                <span className="bg-purple-400 px-2 text-sm py-1 rounded-full">
                  {staff?.length}
                </span>
              </h2>

              {/* Conditionally render the "Add New Staff" button if role is not "teacher" */}
              {role === "admin" && (
                <button
                  onClick={handleAddStaffClick}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                >
                  <span>{t("Add New Staff")}</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap -mx-2">
              {staff.length > 0 ? (
                staff?.map((profile, index) => (
                  <ProfileCard
                    key={index}
                    profile={profile}
                    onClick={handleStaffClick}
                    editUser={role === "admin" ? editUser : null}
                  />
                ))
              ) : (
                <div>
                  <div className="flex w-[80vw] text-gray-500 h-[90vh] items-center justify-center flex-col text-2xl">
                    <GoAlertFill className="text-[5rem]" />
                    {t("No Staff data Found")}
                  </div>
                </div>
              )}
            </div>

            <SidebarSlide
              key={sidebarContent} // Use the key to force re-render
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title={
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                  {sidebarContent === "viewStaff"
                    ? t("Quick View of Staff")
                    : t("Add/Edit Staff")}
                </span>
              }
              width={sidebarContent === "viewStaff" ? "30%" : "60%"}
              height="100%"
            >
              {renderSidebarContent()}
            </SidebarSlide>
          </div>
        )}
      </DashLayout>
    </Layout>
  );
};

export default AllStaff;
