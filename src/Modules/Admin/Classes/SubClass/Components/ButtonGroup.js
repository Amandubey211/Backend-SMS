import React from "react";
import { useTranslation } from "react-i18next";
import ProtectedAction from "../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../config/permission";
import { FiCalendar } from "react-icons/fi"; // Import the calendar icon
import { Tooltip } from "antd"; // Import antd's Tooltip

const ButtonGroup = ({
  onAddNewSubject,
  onViewSemester,
  selectedTab,
  setSelectedTab,
  role,
}) => {
  const { t } = useTranslation("admClass");

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex space-x-4">
        <ProtectedAction requiredPermission={"dd"}>
          <Tooltip title={t("Published")}>
            <button
              className={`px-4 py-2 rounded-md transition-all duration-200 focus:outline-none ${
                selectedTab === "Published"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:brightness-110"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
              onClick={() => setSelectedTab("Published")}
            >
              {t("Published")}
            </button>
          </Tooltip>
        </ProtectedAction>

        <ProtectedAction>
          <Tooltip title={t("Draft")}>
            <button
              className={`px-4 py-2 rounded-md transition-all duration-200 focus:outline-none ${
                selectedTab === "Draft"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:brightness-110"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
              onClick={() => setSelectedTab("Draft")}
            >
              {t("Draft")}
            </button>
          </Tooltip>
        </ProtectedAction>
      </div>
      {role === "admin" && (
        <div className="flex justify-between items-center gap-2">
          <ProtectedAction>
            <Tooltip title={t("Add New Subject")}>
              <button
                onClick={onAddNewSubject}
                className="flex items-center border border-gray-300 ps-5 py-0 rounded-full transition-all duration-200 focus:outline-none hover:shadow-lg hover:bg-gray-50"
              >
                <span className="mr-2">{t("Add New Subject")}</span>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-3xl -mt-2">+</span>
                </div>
              </button>
            </Tooltip>
          </ProtectedAction>
          {role === "admin" && (
            <ProtectedAction>
              <Tooltip title={t("Manage Semester")}>
                <button
                  onClick={onViewSemester}
                  className="px-4 py-3 rounded-md bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center transition-all duration-200 focus:outline-none hover:brightness-110 hover:shadow-md"
                >
                  <FiCalendar className="mr-2" size={20} />
                  {t("Manage Semester")}
                </button>
              </Tooltip>
            </ProtectedAction>
          )}
        </div>
      )}
    </div>
  );
};

export default ButtonGroup;
