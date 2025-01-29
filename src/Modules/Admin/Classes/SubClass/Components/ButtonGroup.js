import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ProtectedAction from "../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../config/permission";

const ButtonGroup = ({
  onAddNewSubject,
  selectedTab,
  setSelectedTab,
  role,
}) => {
  const { t } = useTranslation("admClass");

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex space-x-4">
        <ProtectedAction requiredPermission={"dd"}>
          <button
            className={`px-4 py-2 rounded-md ${
              selectedTab === "Published"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : "border border-gray-300 text-gray-600"
            }`}
            onClick={() => setSelectedTab("Published")}
          >
            {t("Published")}
          </button>
        </ProtectedAction>

        <ProtectedAction>
          <button
            className={`px-4 py-2 rounded-md ${
              selectedTab === "Draft"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : "border border-gray-300 text-gray-600"
            }`}
            onClick={() => setSelectedTab("Draft")}
          >
            {t("Draft")}
          </button>
        </ProtectedAction>
      </div>
      {/* {role === "admin" && ( */}
      <ProtectedAction>
        <button
          onClick={onAddNewSubject}
          className="flex items-center border border-gray-300 ps-5 py-0 rounded-full"
        >
          <span className="mr-2">{t("Add New Subject")}</span>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
            <span className="text-3xl -mt-2">+</span>
          </div>
        </button>
      </ProtectedAction>

      {/* )} */}
    </div>
  );
};

export default ButtonGroup;
