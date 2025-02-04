import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../../Components/Common/Spinner";
import PropTypes from "prop-types";
import DeleteConfirmationModal from "../../../../Components/Common/DeleteConfirmationModal";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Dropdown, Menu, Tooltip, Badge } from "antd";
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../config/permission";

// React Icons
import { FaRegCalendarAlt, FaRegClock, FaRegSun } from "react-icons/fa";
import { AiOutlineFileSearch } from "react-icons/ai"; // For "No Results" icon

/**
 * Slightly lighter, pastel-like gradients that
 * still provide noticeable color variation.
 */
const GRADIENTS = [
  // Light Yellow -> Deeper Yellow-Orange
  "linear-gradient(to bottom right, #fde68a, #f59e0b)",
  // Light Blue -> Medium Blue
  "linear-gradient(to bottom right, #bfdbfe, #3b82f6)",
  // Light Green -> Medium Green
  "linear-gradient(to bottom right, #bbf7d0, #22c55e)",
  // Light Red -> Medium Red
  "linear-gradient(to bottom right, #fecaca, #ef4444)",
  // Light Purple -> Medium Purple
  "linear-gradient(to bottom right, #e9d5ff, #9333ea)",
  // Light Pink -> Medium Pink
  "linear-gradient(to bottom right, #fbcfe8, #ec4899)",
];

const hashCode = (str) => {
  let hash = 0;
  if (!str) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // 32-bit
  }
  return Math.abs(hash);
};

const getBgColor = (id) => {
  const hash = hashCode(id?.toString());
  return GRADIENTS[hash % GRADIENTS.length];
};

const TimeTableList = React.memo(({ timetables, loading, onDelete }) => {
  const { t } = useTranslation("admTimeTable");
  const navigate = useNavigate();
  const role = useSelector((store) => store.common.auth.role);

  // Modal states for deletion
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timetableToDelete, setTimetableToDelete] = useState(null);

  // Tabs: "all", "active", "draft"
  const [selectedTab, setSelectedTab] = useState("all");

  // Navigate to a single timetable’s details
  const handleCardClick = (timetable) => {
    navigate(`/timetable/viewtable/${timetable?.name}`, {
      state: { timetable },
    });
  };

  // Edit & Delete
  const handleEditClick = (record) => {
    navigate(`/timetable/edit/${record?._id}`);
  };

  const handleDeleteClick = (record) => {
    setTimetableToDelete(record);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (timetableToDelete) {
      onDelete(timetableToDelete?._id);
      setIsModalOpen(false);
      setTimetableToDelete(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimetableToDelete(null);
  };

  // Sort timetables or fallback to empty array
  const sortedTimetables = useMemo(() => {
    if (!timetables) return [];
    return [...timetables].sort((a, b) => {
      const dateA = a?.validity?.startDate
        ? new Date(a.validity.startDate)
        : new Date(0);
      const dateB = b?.validity?.startDate
        ? new Date(b.validity.startDate)
        : new Date(0);
      return dateB - dateA;
    });
  }, [timetables]);

  // Count totals
  const totalCount = sortedTimetables.length;
  const activeCount = sortedTimetables.filter(
    (t) => t?.status === "active"
  ).length;
  const draftCount = sortedTimetables.filter(
    (t) => t?.status !== "active"
  ).length;

  // Filter by tab
  const filteredTimetables = useMemo(() => {
    if (selectedTab === "all") {
      return sortedTimetables;
    } else if (selectedTab === "active") {
      return sortedTimetables.filter((t) => t?.status === "active");
    } else {
      return sortedTimetables.filter((t) => t?.status !== "active");
    }
  }, [sortedTimetables, selectedTab]);

  // Card actions
  const actionMenu = (record) => (
    <Menu>
      <ProtectedAction requiredPermission={PERMISSIONS.UPDATE_TIMETABLE}>
        <Menu.Item
          key="edit"
          onClick={(e) => {
            e.domEvent.stopPropagation();
            handleEditClick(record);
          }}
        >
          <EditOutlined style={{ marginRight: 8 }} />
          {t("Edit")}
        </Menu.Item>
      </ProtectedAction>
      <ProtectedAction requiredPermission={PERMISSIONS.DELETE_TIMETABLE}>
        <Menu.Item
          key="delete"
          onClick={(e) => {
            e.domEvent.stopPropagation();
            handleDeleteClick(record);
          }}
        >
          <DeleteOutlined style={{ marginRight: 8 }} />
          {t("Delete")}
        </Menu.Item>
      </ProtectedAction>
    </Menu>
  );

  // Render date/time
  const renderScheduleSummary = (timetable) => {
    const days = timetable?.days;
    if (!days || days.length === 0) {
      return (
        <p className="text-gray-600 text-sm">{t("No schedule available.")}</p>
      );
    }

    const firstDay = days[0];
    const slots = firstDay?.slots;
    if (!slots || slots.length === 0) {
      return (
        <p className="text-gray-600 text-sm">{t("No schedule available.")}</p>
      );
    }

    const firstSlot = slots[0];
    if (!firstSlot) {
      return (
        <p className="text-gray-600 text-sm">{t("No schedule available.")}</p>
      );
    }

    const dateString = new Date(firstDay?.date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    switch (timetable?.type) {
      case "event":
      case "exam":
        return (
          <p className="text-gray-600 text-sm flex items-center gap-4">
            <span className="flex items-center gap-2">
              <FaRegCalendarAlt className="text-gray-500" />
              {dateString}
            </span>
            <span>|</span>
            <span className="flex items-center gap-2">
              <FaRegClock className="text-gray-500" />
              {firstSlot?.startTime} - {firstSlot?.endTime}
            </span>
          </p>
        );
      case "weekly":
        return (
          <p className="text-gray-600 text-sm flex items-center gap-4">
            <span className="flex items-center gap-2">
              <FaRegSun className="text-gray-500" />
              {firstDay?.day}
            </span>
            <span>|</span>
            <span className="flex items-center gap-2">
              <FaRegClock className="text-gray-500" />
              {firstSlot?.startTime} - {firstSlot?.endTime}
            </span>
          </p>
        );
      case "others":
        return (
          <p className="text-gray-600 text-sm flex items-center gap-4">
            <span className="flex items-center gap-2">
              <FaRegClock className="text-gray-500" />
              {firstSlot?.startTime}
            </span>
          </p>
        );
      default:
        return null;
    }
  };

  // Admin: Create timetable
  const handleCreateTimeTable = () => {
    navigate("/timetable/create-new-timeTable");
  };

  // If no timetables found in the selected tab
  const renderTimetablesGrid = () => {
    if (filteredTimetables.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-96 px-4">
          <AiOutlineFileSearch className="text-8xl text-gray-300 mb-4" />
          <p className="text-xl text-gray-500">
            {t("No timetables found for the selected filters.")}
          </p>
        </div>
      );
    }

    // Render the timetable cards
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {filteredTimetables.map((timetable) => (
          <div
            key={timetable?._id}
            className="relative shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            onClick={() => handleCardClick(timetable)}
            style={{ background: getBgColor(timetable?._id) }}
          >
            {/* Top: Active/Draft & Type */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    timetable?.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {timetable?.status === "active" ? t("Active") : t("Draft")}
                </span>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-800">
                  {timetable?.type || t("Others")}
                </span>
              </div>
              <Dropdown overlay={actionMenu(timetable)} trigger={["click"]}>
                <EllipsisOutlined
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                />
              </Dropdown>
            </div>

            {/* Body */}
            <div className="px-4 pb-4">
              <h2
                className="text-lg font-bold text-gray-800 truncate capitalize mb-2"
                title={timetable?.name}
              >
                {timetable?.name || t("Untitled")}
              </h2>
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">
                  <strong>{t("Class")}:</strong>{" "}
                  {timetable?.classId?.className || "N/A"}
                </p>
                {timetable?.validity?.startDate && (
                  <p className="text-gray-700">
                    <strong>{t("Valid From")}:</strong>{" "}
                    {new Date(timetable.validity.startDate).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                )}
              </div>

              {/* Divider */}
              <hr className="my-3 border-gray-300" />

              {/* Summary */}
              {renderScheduleSummary(timetable)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col p-5">
        {/* Tab Buttons + Create Button */}
        <div className="flex justify-between mb-6 px-4 items-center">
          <div className="flex space-x-4">
            {/* All Tab */}
            <Tooltip title={t("Show All Timetables")}>
              <Badge
                count={totalCount}
                style={{ backgroundColor: "#6B7280" }}
                offset={[-2, 2]}
              >
                <button
                  className={`px-6 py-3 text-sm font-semibold rounded-md ${
                    selectedTab === "all"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : "border border-gray-300 text-gray-600"
                  }`}
                  onClick={() => setSelectedTab("all")}
                >
                  {t("All")}
                </button>
              </Badge>
            </Tooltip>

            {/* Active Tab */}
            <Tooltip title={t("Show Active Timetables")}>
              <Badge
                count={activeCount}
                style={{ backgroundColor: "#6B7280" }}
                offset={[-2, 2]}
              >
                <button
                  className={`px-6 py-3 text-sm font-semibold rounded-md ${
                    selectedTab === "active"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : "border border-gray-300 text-gray-600"
                  }`}
                  onClick={() => setSelectedTab("active")}
                >
                  {t("Active")}
                </button>
              </Badge>
            </Tooltip>

            {/* Draft Tab */}
            <Tooltip title={t("Show Draft Timetables")}>
              <Badge
                count={draftCount}
                style={{ backgroundColor: "#6B7280" }}
                offset={[-2, 2]}
              >
                <button
                  className={`px-6 py-3 text-sm font-semibold rounded-md ${
                    selectedTab === "draft"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : "border border-gray-300 text-gray-600"
                  }`}
                  onClick={() => setSelectedTab("draft")}
                >
                  {t("Draft")}
                </button>
              </Badge>
            </Tooltip>
          </div>

          {/* Create Timetable (Admin Only) */}
          {role === "admin" && (
            <ProtectedAction requiredPermission={PERMISSIONS.CREATE_TIMETABLE}>
              <Tooltip title={t("Create a new timetable")}>
                <button
                  onClick={handleCreateTimeTable}
                  className="px-6 py-3 text-sm font-semibold rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  {t("+ Create TimeTable")}
                </button>
              </Tooltip>
            </ProtectedAction>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <Spinner />
        ) : sortedTimetables.length === 0 ? (
          // No Timetables at all
          <div className="flex flex-col items-center justify-center h-96 px-4">
            <AiOutlineFileSearch className="text-8xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-500">
              {t("No timetables available. Create one to get started!")}
            </p>
          </div>
        ) : (
          // Timetables exist, show filtered view or fallback
          renderTimetablesGrid()
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {timetableToDelete && (
        <DeleteConfirmationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={confirmDelete}
          loading={false}
          text={t("Delete Timetable")}
        />
      )}
    </>
  );
});

TimeTableList.propTypes = {
  timetables: PropTypes.array,
  loading: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
};

TimeTableList.defaultProps = {
  timetables: [],
  loading: false,
};

export default TimeTableList;
