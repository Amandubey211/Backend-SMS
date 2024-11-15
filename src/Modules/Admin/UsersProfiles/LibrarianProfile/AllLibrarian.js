import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import ViewLibrarian from "./ViewLibrarian";
import ProfileCard from "../SubComponents/ProfileCard";
import { useDispatch, useSelector } from "react-redux";
import AddUser from "../StaffProfile/AddUser";
import { GoAlertFill } from "react-icons/go";
import Spinner from "../../../../Components/Common/Spinner";
import { useTranslation } from 'react-i18next';
import { fetchAllStaff } from "../../../../Store/Slices/Admin/Users/Staff/staff.action";

const AllLibrarian = () => {
  const { t } = useTranslation("admAccounts");

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [selectedLibrarian, setSelectedLibrarian] = useState(null);
  const [librarianData, setLibrarianData] = useState(null);
  const { librarian, loading } = useSelector((store) => store.admin.all_staff);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllStaff());
  }, [dispatch]);

  const role = useSelector((store) => store.common.auth.role);

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
          <div className="p-4">
            <div className="flex justify-between items-center mb-4 border-b-2 h-20">
              <h2 className="text-xl font-semibold">
                {t("All Librarian")}{" "}
                <span className="bg-purple-400 px-2 text-sm py-1 rounded-full">
                  {librarian?.length}
                </span>
              </h2>

              {role === "admin" && (
                <button
                  onClick={handleAddLibrarianClick}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                >
                  <span>{t("Add New Librarian")}</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap -mx-2">
              {librarian.length > 0 ? (
                librarian.map((librarian, index) => (
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
          </div>
        )}
      </DashLayout>
    </Layout>
  );
};

export default AllLibrarian;
