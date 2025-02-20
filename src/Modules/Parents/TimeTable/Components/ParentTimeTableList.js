/********************************************************************
 * ParentTimeTableList.jsx
 * Displays timetables in a gradient card style using parent's schedule logic.
 ********************************************************************/
import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Spinner from "../../../../Components/Common/Spinner";
import DeleteConfirmationModal from "../../../../Components/Common/DeleteConfirmationModal";
import { AiOutlineFileSearch } from "react-icons/ai";
import { FaCalendarAlt, FaChalkboardTeacher } from "react-icons/fa";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// Soft pastel gradients for the timetable cards.
const GRADIENTS = [
  "linear-gradient(to bottom right, #fde68a, #f59e0b)", // Yellow
  "linear-gradient(to bottom right, #bfdbfe, #3b82f6)", // Blue
  "linear-gradient(to bottom right, #bbf7d0, #22c55e)", // Green
  "linear-gradient(to bottom right, #fecaca, #ef4444)", // Red
  "linear-gradient(to bottom right, #e9d5ff, #9333ea)", // Purple
  "linear-gradient(to bottom right, #fbcfe8, #ec4899)", // Pink
];

// Generates a stable numeric hash from a string.
const hashCode = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Returns a gradient background based on the given ID.
const getBgColor = (id) => {
  const hash = hashCode(id?.toString());
  return GRADIENTS[hash % GRADIENTS.length];
};

const ParentTimeTableList = React.memo(({ timetables, loading, onDelete }) => {
  const { t } = useTranslation("admTimeTable");
  const navigate = useNavigate();
  const role = useSelector((store) => store.common.auth.role);

  // Local state for deletion modal handling
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timetableToDelete, setTimetableToDelete] = useState(null);

  // Ensure timetables is an array even if passed as an object
  const timetableData = Array.isArray(timetables)
    ? timetables
    : timetables?.timetables || [];

  // Sort timetables by validity.startDate descending
  const sortedTimetables = useMemo(() => {
    return [...timetableData].sort((a, b) => {
      const dateA = a?.validity?.startDate
        ? new Date(a.validity.startDate)
        : new Date(0);
      const dateB = b?.validity?.startDate
        ? new Date(b.validity.startDate)
        : new Date(0);
      return dateB - dateA;
    });
  }, [timetableData]);

  // Confirm deletion action
  const confirmDelete = () => {
    if (timetableToDelete) {
      onDelete(timetableToDelete._id);
      setIsModalOpen(false);
      setTimetableToDelete(null);
    }
  };

  // Close the deletion modal
  const closeModal = () => {
    setIsModalOpen(false);
    setTimetableToDelete(null);
  };

  /**
   * Render the schedule details using the parent's schedule logic.
   */
  const renderSchedule = (timetable) => {
    const { type, days } = timetable;
    if (!days || days.length === 0) {
      return <p className="text-gray-500">{t("No schedule available.")}</p>;
    }

    const firstDay = days[0];
    const firstSlot = firstDay?.slots?.[0];

    if (!firstSlot) {
      return <p className="text-gray-500">{t("No schedule available.")}</p>;
    }

    switch (type) {
      case "event":
        return (
          <div className="mt-2">
            <p className="text-gray-600">
              <strong>{t("Date")}:</strong>{" "}
              {new Date(firstDay.date).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-sm text-gray-600 flex items-center">
              <strong className="mr-1">{t("Event")}:</strong>
              <span className="inline-flex items-center justify-center bg-purple-100 text-purple-700 text-sm font-medium px-2 ml-1 mt-1 rounded-md">
                {firstSlot.eventName ?? "N/A"}
              </span>
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
              <strong>{t("Subject")}:</strong>{" "}
              {firstSlot.subjectId?.name ?? "N/A"}
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
              <strong>{t("Date")}:</strong>{" "}
              {new Date(firstDay.date).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-gray-600">
              <strong>{t("Subject")}:</strong>{" "}
              {firstSlot.subjectId?.name ?? "N/A"}
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
            <p className="text-gray-600">
              <strong>{t("Heading")}:</strong> {firstSlot.heading ?? "N/A"}
            </p>
          </div>
        );
      default:
        return <p className="text-gray-500">{t("No schedule available.")}</p>;
    }
  };

  /**
   * Handle card click to navigate to a detailed timetable view.
   */
  const handleCardClick = (timetable) => {
    navigate(`timetable/viewtable/${timetable._id}`, { state: { timetable } });
  };

  // If no timetables available at all
  if (timetableData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 px-4">
        <AiOutlineFileSearch className="text-8xl text-gray-300 mb-4" />
        <p className="text-xl text-gray-500">{t("No timetables available.")}</p>
      </div>
    );
  }

  // If filtering results in no matches
  if (sortedTimetables.length === 0 && timetableData.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 px-4">
        <AiOutlineFileSearch className="text-8xl text-gray-300 mb-4" />
        <p className="text-xl text-gray-500">
          {t("No timetables found for the current search or filters.")}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header: Title & Count */}
      <div className="flex items-center justify-between mb-6 px-4">
        <h1 className="text-2xl font-bold text-gray-800">{t("Timetables:")}</h1>
        <div className="flex items-center">
          <span className="text-lg font-semibold text-gray-700 mr-2">
            {t("Time Tables")}:
          </span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-600">
            {sortedTimetables.length}
          </div>
        </div>
      </div>

      {/* Timetable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
        {sortedTimetables.map((timetable) => (
          <div
            key={timetable._id}
            onClick={() => handleCardClick(timetable)}
            className="relative shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            style={{ background: getBgColor(timetable._id) }}
          >
            {/* Card Header */}
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
              {/* Optionally show edit/delete buttons if onDelete is provided */}
              {onDelete && (
                <div
                  className="flex space-x-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="text-gray-600 hover:text-blue-600"
                    onClick={() => navigate(`/timetable/edit/${timetable._id}`)}
                  >
                    <EditOutlined />
                  </button>
                  <button
                    className="text-gray-600 hover:text-red-600"
                    onClick={() => {
                      setTimetableToDelete(timetable);
                      setIsModalOpen(true);
                    }}
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              )}
            </div>

            {/* Card Body */}
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

              {/* Schedule Info */}
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                {t("Schedule")}
              </h3>
              {renderSchedule(timetable)}
            </div>
          </div>
        ))}
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

ParentTimeTableList.propTypes = {
  timetables: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      success: PropTypes.bool,
      timetables: PropTypes.arrayOf(PropTypes.object),
    }),
  ]).isRequired,
  loading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func, // Optional deletion handler
};

ParentTimeTableList.defaultProps = {
  onDelete: null,
};

export default ParentTimeTableList;
