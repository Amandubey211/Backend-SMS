/********************************************************************
 * StudentTimeTableList.jsx
 * Displays timetables in a gradient card style, allowing each card to be clicked.
 * Distinguishes "no data at all" from "no matching results."
 ********************************************************************/
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineFileSearch } from "react-icons/ai";
import { FaRegCalendarAlt, FaRegClock, FaRegSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Added for navigation

import Spinner from "../../../../Components/Common/Spinner";

/**
 * Slightly lighter, pastel-like gradients that
 * still provide noticeable color variation.
 */
const GRADIENTS = [
  "linear-gradient(to bottom right, #fde68a, #f59e0b)", // Light Yellow -> Deeper Yellow-Orange
  "linear-gradient(to bottom right, #bfdbfe, #3b82f6)", // Light Blue -> Medium Blue
  "linear-gradient(to bottom right, #bbf7d0, #22c55e)", // Light Green -> Medium Green
  "linear-gradient(to bottom right, #fecaca, #ef4444)", // Light Red -> Medium Red
  "linear-gradient(to bottom right, #e9d5ff, #9333ea)", // Light Purple -> Medium Purple
  "linear-gradient(to bottom right, #fbcfe8, #ec4899)", // Light Pink -> Medium Pink
];

/**
 * Generates a stable numeric hash from a string.
 */
const hashCode = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

/**
 * Returns a gradient background from GRADIENTS based on the given ID.
 */
const getBgColor = (id) => {
  const hash = hashCode(id?.toString());
  return GRADIENTS[hash % GRADIENTS.length];
};

const StudentTimeTableList = ({ timetables, loading }) => {
  const { t } = useTranslation("admTimeTable");
  const navigate = useNavigate(); // Initialize navigate hook

  // Ensure timetables is an array
  const timetableData = Array.isArray(timetables?.timetables)
    ? timetables.timetables
    : [];

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

  /**
   * Handle card click - navigates to the detailed view of the timetable.
   */
  const handleCardClick = (timetable) => {
    navigate(`/timetable/viewtable/${timetable._id}`, { state: { timetable } });
  };

  /**
   * Renders a short schedule summary (date/time) for each card.
   */
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

  // Show spinner if loading
  if (loading) {
    return <Spinner />;
  }

  // If there's absolutely no timetables returned from the server
  if (!timetableData.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 px-4">
        <AiOutlineFileSearch className="text-8xl text-gray-300 mb-4" />
        <p className="text-xl text-gray-500">{t("No timetables available.")}</p>
      </div>
    );
  }

  // If there ARE timetables from the server, but after filtering/sorting we have none
  if (!sortedTimetables.length && timetableData.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 px-4">
        <AiOutlineFileSearch className="text-8xl text-gray-300 mb-4" />
        <p className="text-xl text-gray-500">
          {t("No timetables found for the current search or filters.")}
        </p>
      </div>
    );
  }

  // Render gradient-based cards
  return (
    <div className="flex flex-col p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {sortedTimetables.map((timetable) => (
          <div
            key={timetable?._id}
            onClick={() => handleCardClick(timetable)}
            className="relative shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            style={{ background: getBgColor(timetable?._id) }}
          >
            {/* Top row: Active/Draft & Type */}
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

              {/* Schedule Preview */}
              {renderScheduleSummary(timetable)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

StudentTimeTableList.defaultProps = {
  timetables: { success: false, timetables: [] },
  loading: false,
};

export default StudentTimeTableList;
