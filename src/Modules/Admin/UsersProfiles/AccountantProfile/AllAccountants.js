// AllAccountants.js
import React, { useEffect, useState, useRef } from "react";
import { FiLock, FiUserPlus } from "react-icons/fi";
import { GoAlertFill, GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import SidebarSlide from "../../../../Components/Common/SidebarSlide";
import CreateRole from "../../../../Components/Common/RBAC/CreateRole";
import AddUser from "../StaffProfile/AddUser";
import ProfileCard from "../SubComponents/ProfileCard";
import ViewAccountant from "./ViewAccountant";
import Spinner from "../../../../Components/Common/Spinner";

import { fetchAllStaff } from "../../../../Store/Slices/Admin/Users/Staff/staff.action";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";

const AllAccountants = () => {
  const { t } = useTranslation("admAccounts");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [selectedAccountant, setSelectedAccountant] = useState(null);
  const [accountantData, setAccountantData] = useState(null);
  const [sortDropdown, setSortDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { accountant, loading: accountantLoading } = useSelector(
    (store) => store.admin.all_staff
  );
  const { role } = useSelector((store) => store.common.auth);

  useEffect(() => {
    dispatch(fetchAllStaff());
  }, [dispatch]);

  // Handle dropdown close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSidebarOpen = (content, data = null) => {
    setSidebarContent(content);
    setSelectedAccountant(data);
    setAccountantData(data);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => setSidebarOpen(false);

  const editUser = (event, accountant) => {
    event.stopPropagation();
    handleSidebarOpen("editAccountant", accountant);
  };

  const handleAccountantClick = (accountant) => {
    handleSidebarOpen("viewAccountant", accountant);
  };

  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case "viewAccountant":
        return <ViewAccountant accountant={selectedAccountant} />;
      case "addAccountant":
        return <AddUser role="accountant" />;
      case "editAccountant":
        return <AddUser role="accountant" data={accountantData} />;
      case "createRole":
        return (
          <CreateRole onClose={handleSidebarClose} department="Accountant" />
        );
      default:
        return <div>{t("Select an action")}</div>;
    }
  };
  useNavHeading("User", "Accountants");

  return (
    <Layout title={t("All Accountants")}>
      <DashLayout>
        {accountantLoading ? (
          <div className="flex w-full h-[90vh] flex-col items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="p-4 relative">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4 border-b-2 h-20">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  {t("All Accountants")}
                  {/* Gradient Circle Badge */}
                  <span className="inline-flex items-center justify-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-[2px]">
                      <span className="flex items-center justify-center w-full h-full bg-pink-50 rounded-full text-sm font-medium text-pink-600">
                        {accountant?.length}
                      </span>
                    </span>
                  </span>
                </h2>

                {/* Sort Button with Gradient Border */}
                <div className="relative" ref={dropdownRef}>
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-[2px] rounded-md">
                    <button
                      onClick={() => setSortDropdown(!sortDropdown)}
                      className="inline-flex items-center gap-2 px-4 py-1 bg-white rounded-md text-gray-800 font-medium"
                    >
                      <span>{t("Sort")}</span>
                      {/* Sort Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h8m-8 6h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {sortDropdown && (
                    <div className="absolute mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                      <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                        {t("By Date")}
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                        {t("By Roles")}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section */}
              {role === "admin" && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/users/manage-roles")}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md inline-flex items-center gap-2 hover:opacity-90 transition duration-200"
                  >
                    <FiLock className="text-white" />
                    {t("Manage Roles")}
                  </button>

                  <button
                    onClick={() => handleSidebarOpen("createRole")}
                    className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
                  >
                    <span className="text-gray-800 font-medium">
                      {t("Create Role")}
                    </span>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                      <FiUserPlus size={16} />
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Accountant List */}
            <div className="flex flex-wrap -mx-2">
              {accountant?.length > 0 ? (
                accountant.map((acc, index) => (
                  <ProfileCard
                    key={index}
                    profile={acc}
                    onClick={() => handleAccountantClick(acc)}
                    editUser={
                      role === "admin" ? (event) => editUser(event, acc) : null
                    }
                  />
                ))
              ) : (
                <div className="flex w-[80vw] text-gray-500 h-[90vh] items-center justify-center flex-col text-2xl">
                  <GoAlertFill className="text-[5rem]" />
                  {t("No Accountant Found")}
                </div>
              )}
            </div>

            {/* Floating Action Button */}
            {role === "admin" && (
              <button
                onClick={() => handleSidebarOpen("addAccountant")}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition duration-200"
              >
                <GoPlus className="text-2xl" />
              </button>
            )}
          </div>
        )}

        {/* Sidebar */}
        <SidebarSlide
          key={sidebarContent}
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          title={
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
              {sidebarContent === "viewAccountant"
                ? t("Quick View of Accountant")
                : sidebarContent === "createRole"
                ? t("Create New Role")
                : t("Add/Edit Accountant")}
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
      </DashLayout>
    </Layout>
  );
};

export default AllAccountants;
