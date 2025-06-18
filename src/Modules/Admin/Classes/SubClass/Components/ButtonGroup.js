import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ProtectedAction from "../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { gt } from "../../../../../Utils/translator/translation";
import { FiCalendar } from "react-icons/fi";
import { Tooltip } from "antd";
import { BiSpreadsheet } from "react-icons/bi";

const ButtonGroup = ({
  onAddNewSubject,
  onViewSemester,
  selectedTab,
  setSelectedTab,
  role,
  publishedCount,
  draftCount,
  cid,
}) => {
  const { t } = useTranslation("admClass");
  const navigate = useNavigate();

  // ───────────────────────────────────────────────
  // Role checks
  // ───────────────────────────────────────────────
  const isAdmin = role?.toLowerCase() === "admin";

  // Dynamic label for semester button
  const semesterLabel = isAdmin ? t("Manage Semester") : t("Select Semester");

  return (
    <div className="flex justify-between items-center mb-4">
      {/* ───────── Left: Published / Draft tabs ───────── */}
      <div className="flex space-x-4">
        <ProtectedAction requiredPermission="dd">
          <Tooltip title={t("Published")}>
            <button
              className={`px-4 py-2 rounded-md transition-all duration-200 focus:outline-none ${
                selectedTab === "Published"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:brightness-110"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
              onClick={() => setSelectedTab("Published")}
            >
              {t("Published")} ({publishedCount ?? 0})
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
              {t("Draft")} ({draftCount ?? 0})
            </button>
          </Tooltip>
        </ProtectedAction>
      </div>

      {/* ───────── Right: Action buttons ───────── */}
      <div className="flex items-center gap-2">
        {/* Add New Subject */}
        <ProtectedAction>
          <Tooltip title={t("Add New Subject")}>
            <button
              onClick={onAddNewSubject}
              className="flex items-center border border-gray-300 ps-5 py-0 rounded-full transition-all duration-200 focus:outline-none hover:shadow-lg hover:bg-gray-50"
            >
              <span className="mr-2">{t("Add New Subject")}</span>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                <span className="text-3xl">+</span>
              </div>
            </button>
          </Tooltip>
        </ProtectedAction>

        {/* Manage / Select Semester */}
        <Tooltip title={semesterLabel}>
          <button
            onClick={onViewSemester}
            className="px-4 py-3 rounded-md bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center transition-all duration-200 focus:outline-none hover:brightness-110 hover:shadow-md"
          >
            <FiCalendar className="mr-2" size={20} />
            {semesterLabel}
          </button>
        </Tooltip>

        {/* Manage Report Card – ADMIN ONLY */}
        {isAdmin && (
          <Tooltip title={t("Manage Report Card")}>
            <button
              onClick={() => navigate(`/admin/scorecard/${cid}`)}
              className="px-4 py-3 rounded-md bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center transition-all duration-200 focus:outline-none hover:brightness-110 hover:shadow-md"
            >
              <BiSpreadsheet className="text-lg mr-1" />
              {t("Manage Report Card", gt.setting)}
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default ButtonGroup;
