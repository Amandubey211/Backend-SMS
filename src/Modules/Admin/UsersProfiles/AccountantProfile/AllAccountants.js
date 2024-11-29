import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import ViewAccountant from "./ViewAccountant";
import ProfileCard from "../SubComponents/ProfileCard";
import { useDispatch, useSelector } from "react-redux";
import AddUser from "../StaffProfile/AddUser";
import { GoAlertFill } from "react-icons/go";
import Spinner from "../../../../Components/Common/Spinner";
import { useTranslation } from "react-i18next";
import { fetchAllStaff } from "../../../../Store/Slices/Admin/Users/Staff/staff.action";

const AllAccountants = () => {
  const { t } = useTranslation("admAccounts");

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [selectedAccountant, setSelectedAccountant] = useState(null);
  const [accountantData, setAccountantData] = useState(null);
  const { accountant, loading } = useSelector((store) => store.admin.all_staff);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllStaff());
  }, [dispatch]);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleAccountantClick = (accountant) => {
    setSelectedAccountant(accountant);
    setSidebarContent("viewAccountant");
    setSidebarOpen(true);
  };

  const handleAddAccountantClick = () => {
    setSidebarContent("addAccountant");
    setSidebarOpen(true);
    setAccountantData(null);
  };

  const editUser = (event, accountant) => {
    event.stopPropagation();
    setSidebarContent("editAccountant");
    setSidebarOpen(true);
    setAccountantData(accountant);
  };

  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewAccountant":
        return <ViewAccountant accountant={selectedAccountant} />;
      case "addAccountant":
        return <AddUser role={"accountant"} data={accountantData} />;
      case "editAccountant":
        return <AddUser role={"accountant"} data={accountantData} />;
      default:
        return <div>{t("Select an action")}</div>;
    }
  };

  return (
    <Layout title={t("All Accountants")}>
      <DashLayout>
        {loading ? (
          <div className="flex w-full h-[90vh] flex-col items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4 border-b-2 h-20">
              <h2 className="text-xl font-semibold">
                {t("All Accountants")}{" "}
                <span className="bg-purple-400 px-2 text-sm py-1 rounded-full">
                  {accountant?.length}
                </span>
              </h2>
              <button
                onClick={handleAddAccountantClick}
                className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              >
                <span>{t("Add New Accountant")}</span>
              </button>
            </div>
            <div className="flex flex-wrap -mx-2">
              {accountant.length > 0 ? (
                accountant?.map((accountant, index) => (
                  <ProfileCard
                    key={index}
                    profile={accountant}
                    onClick={handleAccountantClick}
                    editUser={editUser} // Pass the editUser function as a prop
                  />
                ))
              ) : (
                <div className="flex w-[80vw] text-gray-500 h-[90vh] items-center justify-center flex-col text-2xl">
                  <GoAlertFill className="text-[5rem]" />
                  {t("No Accountant Found")}
                </div>
              )}
            </div>
            <SidebarSlide
              key={sidebarContent} // Use the key to force re-render
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title={
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                  {sidebarContent === "viewAccountant"
                    ? t("Quick View of Accountant")
                    : t("Add/Edit Accountant")}
                </span>
              }
              width={sidebarContent === "viewAccountant" ? "30%" : "60%"}
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

export default AllAccountants;
