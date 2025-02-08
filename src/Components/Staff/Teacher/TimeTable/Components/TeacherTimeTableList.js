/******************************************************
 * TeacherTimeTableList.jsx
 * Updated UI to match Admin style & removed tabs
 ******************************************************/
import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// Ant Design & Icons
import { Dropdown, Menu, Tooltip } from "antd";
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FaClipboardList } from "react-icons/fa";
import { AiOutlineFileSearch } from "react-icons/ai";

// Local Components & Config
import Spinner from "../../../../Common/Spinner";
import DeleteConfirmationModal from "../../../../Common/DeleteConfirmationModal";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import ProtectedAction from "../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../config/permission";

/**
 * A set of light gradients to color the timetable cards.
 */
const GRADIENTS = [
  "linear-gradient(to bottom right, #fde68a, #f59e0b)", // Yellow
  "linear-gradient(to bottom right, #bfdbfe, #3b82f6)", // Blue
  "linear-gradient(to bottom right, #bbf7d0, #22c55e)", // Green
  "linear-gradient(to bottom right, #fecaca, #ef4444)", // Red
  "linear-gradient(to bottom right, #e9d5ff, #9333ea)", // Purple
  "linear-gradient(to bottom right, #fbcfe8, #ec4899)", // Pink
];

/**
 * Simple hash generator to consistently map an ID string to a gradient index.
 */
const hashCode = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Keep 32-bit
  }
  return Math.abs(hash);
};

/**
 * Returns a background gradient based on the timetable ID.
 */
const getBgColor = (id) => {
  const hash = hashCode(id?.toString());
  return GRADIENTS[hash % GRADIENTS.length];
};

const TeacherTimeTableList = React.memo(({ timetables, loading, onDelete }) => {
  const { t } = useTranslation("admTimeTable");
  const navigate = useNavigate();
  const role = useSelector((store) => store.common.auth.role);

  // Extract timetable array safely
  const timetableData = Array.isArray(timetables?.timetables)
    ? timetables.timetables
    : [];

  // Local state for delete modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timetableToDelete, setTimetableToDelete] = useState(null);

  // Sort timetables by descending validity.startDate
  const sortedTimetables = useMemo(() => {
    return [...timetableData].sort((a, b) => {
      const dateA = a.validity?.startDate
        ? new Date(a.validity.startDate)
        : new Date(0);
      const dateB = b.validity?.startDate
        ? new Date(b.validity.startDate)
        : new Date(0);
      return dateB - dateA;
    });
  }, [timetableData]);

  // Navigate to the timetable view
  const handleCardClick = (table) => {
    navigate(`/timetable/viewtable/${table.name}`, {
      state: { timetable: table },
    });
  };

  // Edit timetable
  const handleEditClick = (record) => {
    navigate(`/timetable/edit/${record._id}`);
  };

  // Trigger delete modal
  const handleDeleteClick = (record) => {
    setTimetableToDelete(record);
    setIsModalOpen(true);
  };

  // Confirm and execute deletion
  const confirmDelete = () => {
    if (timetableToDelete) {
      onDelete(timetableToDelete._id);
      setIsModalOpen(false);
      setTimetableToDelete(null);
    }
  };

  // Close delete modal
  const closeModal = () => {
    setIsModalOpen(false);
    setTimetableToDelete(null);
  };

  // Create new timetable (admin only)
  const handleCreateTimeTable = () => {
    navigate("/timetable/create-new-timeTable");
  };

  // Dropdown action menu for each card
  const actionMenu = (record) => (
    <Menu>
      <ProtectedAction requiredPermission={PERMISSIONS.TIMETABLE_EDIT}>
        {(hasPermission) =>
          hasPermission && (
            <Menu.Item
              key="edit"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.domEvent.stopPropagation(); // Avoid card onClick
                handleEditClick(record);
              }}
            >
              {t("Edit")}
            </Menu.Item>
          )
        }
      </ProtectedAction>

      <ProtectedAction requiredPermission={PERMISSIONS.TIMETABLE_DELETE}>
        {(hasPermission) =>
          hasPermission && (
            <Menu.Item
              key="delete"
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.domEvent.stopPropagation(); // Avoid card onClick
                handleDeleteClick(record);
              }}
            >
              {t("Delete")}
            </Menu.Item>
          )
        }
      </ProtectedAction>
    </Menu>
  );

  /**
   * Renders partial schedule details based on the timetable's type & first day/slot.
   */
  const renderSchedule = (timetable) => {
    const { type, days } = timetable;
    if (!days || !days.length) {
      return <p className="text-gray-500">{t("No schedule available.")}</p>;
    }

    const firstDay = days[0];
    const firstSlot = firstDay?.slots?.[0];

    if (!firstSlot) {
      return <p className="text-gray-500">{t("No schedule available.")}</p>;
    }

    const dateFormatted = new Date(firstDay.date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    switch (type) {
      case "event":
        return (
          <div className="mt-2">
            <p className="text-gray-600">
              <strong>{t("Date")}:</strong> {dateFormatted}
            </p>
            <p className="text-gray-600">
              <strong>{t("Time")}:</strong> {firstSlot.startTime} –{" "}
              {firstSlot.endTime}
            </p>
          </div>
        );
      case "weekly":
        return (
          <div className="mt-2">
            <p className="text-gray-600">
              <strong>{t("Day")}:</strong> {firstDay.day}
            </p>
            <p className="text-gray-600">
              <strong>{t("Time")}:</strong> {firstSlot.startTime} –{" "}
              {firstSlot.endTime}
            </p>
          </div>
        );
      case "exam":
        return (
          <div className="mt-2">
            <p className="text-gray-600">
              <strong>{t("Date")}:</strong> {dateFormatted}
            </p>
            <p className="text-gray-600">
              <strong>{t("Time")}:</strong> {firstSlot.startTime} –{" "}
              {firstSlot.endTime}
            </p>
          </div>
        );
      case "others":
        return (
          <div className="mt-2">
            <p className="text-gray-600">
              <strong>{t("Start Time")}:</strong> {firstSlot.startTime}
            </p>
          </div>
        );
      default:
        return <p className="text-gray-500">{t("No schedule available.")}</p>;
    }
  };

  /**
   * Renders a grid of timetable cards or a fallback if none exist.
   */
  const renderTimetablesGrid = () => {
    if (!sortedTimetables.length) {
      return (
        <div className="flex flex-col items-center justify-center h-96 px-4">
          <AiOutlineFileSearch className="text-8xl text-gray-300 mb-4" />
          <p className="text-xl text-gray-500">
            {t("No timetables available. Create one to get started!")}
          </p>
        </div>
      );
    }

    // Map each timetable to a gradient card
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-4">
        {sortedTimetables.map((table) => (
          <div
            key={table._id}
            className="relative shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            style={{ background: getBgColor(table._id) }}
            onClick={() => handleCardClick(table)}
          >
            {/* Top Bar: Status + Type + Action Menu */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    table.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {table.status === "active" ? t("Active") : t("Draft")}
                </span>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-800 capitalize">
                  {table.type || t("Others")}
                </span>
              </div>
              <ProtectedAction requiredPermission={PERMISSIONS.TIMETABLE_EDIT}>
                <Dropdown overlay={actionMenu(table)} trigger={["click"]}>
                  <EllipsisOutlined
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  />
                </Dropdown>
              </ProtectedAction>
            </div>

            {/* Card Body */}
            <div className="px-4 pb-4">
              <h2
                className="text-lg font-bold text-gray-800 truncate capitalize mb-2"
                title={table.name}
              >
                {table.name}
                <FaClipboardList className="inline-block ml-2 text-indigo-500" />
              </h2>

              <div className="space-y-1 text-sm">
                <p className="text-gray-700">
                  <strong>{t("Class")}:</strong>{" "}
                  {table?.classId?.className ?? "N/A"},{" "}
                  {table?.schoolId?.nameOfSchool ?? "N/A"}
                </p>
                {table?.academicYear?.year && (
                  <p className="text-gray-700">
                    <strong>{t("Academic Year")}:</strong> &nbsp;
                    {table.academicYear.year}
                  </p>
                )}
                {table?.validity?.startDate && (
                  <p className="text-gray-700">
                    <strong>{t("Valid From")}:</strong>{" "}
                    {new Date(table.validity.startDate).toLocaleDateString(
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

              {/* Schedule Summary */}
              {renderSchedule(table)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ProtectedSection
      requiredPermission={PERMISSIONS.TIMETABLE_VIEW}
      title={t("Time Tables")}
    >
      {/* Header: Create Button (Admin Only) */}
      <div className="flex flex-col p-2">
        <div className="flex justify-end mb-6 px-4 items-center">
          {/* Create Button (Admin Only) */}
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

        {/* Main Content: Spinner or Timetable Grid */}
        {loading ? <Spinner /> : renderTimetablesGrid()}
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
    </ProtectedSection>
  );
});

TeacherTimeTableList.propTypes = {
  timetables: PropTypes.shape({
    success: PropTypes.bool.isRequired,
    timetables: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TeacherTimeTableList;
