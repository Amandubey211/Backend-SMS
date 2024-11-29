import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaClipboardList,
  FaEdit
} from "react-icons/fa";
import Spinner from "../../../../Components/Common/Spinner";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const TimeTableList = React.memo(({ timetables, loading }) => {
  const { t } = useTranslation('admTimeTable');
  console.log('timetable received', timetables);
  const navigate = useNavigate();

  const role = useSelector((store) => store.common.auth.role);

  // Ensure timetables is an array before rendering
  const timetableData = Array.isArray(timetables?.timetables) ? timetables.timetables : [];

  // Function to handle card click and navigate to TableView
  const handleCardClick = (timetable) => {
    navigate(`/timetable/viewtable/${timetable.name}`, {
      state: { timetable },
    });
  };



  return (
    <>
      {/* Heading with Timetable Count */}
      <div className="flex items-center justify-between mb-6 px-4">
        <h1 className="text-2xl font-bold text-gray-800"></h1>
        <div className="flex items-center">
          <span className="text-lg font-semibold text-gray-700 mr-2">
            {t("Time Tables")}:
          </span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-600">
            {timetableData.length}
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : timetableData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <FaClipboardList className="text-9xl text-gray-400" />
          <p className="text-xl text-gray-400 mt-4">
            {t("No TimeTables Yet!")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
          {timetableData?.map((timetable) => (
            <div
              key={timetable._id}
              className="relative p-6 bg-white shadow-xl rounded-xl border border-gray-200 transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => handleCardClick(timetable)}
            >
              {/* Status Badge */}
              {role === 'admin' && (
                <span
                  className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded ${
                    timetable.status === "active"
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {timetable.status === "active" ? t("Published") : t("Draft")}
                </span>
              )}

              {/* Card Header */}
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                {timetable.name}
                <FaClipboardList className="ml-2 text-indigo-500" />
              </h2>
              <p className="text-sm text-gray-600 flex items-center">
                <FaChalkboardTeacher className="text-indigo-400 mr-2" />
                <strong>{t("Type")}:</strong> {timetable.type}
              </p>

              {/* General Info */}
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <FaChalkboardTeacher className="text-indigo-400 mr-2" />
                <strong>{t("Class")}:</strong>{" "}
                {timetable.classId?.className ?? t("N/A")}, {timetable.schoolId?.nameOfSchool ?? t("N/A")}
              </p>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <FaCalendarAlt className="text-indigo-400 mr-2" />
                <strong>{t("Academic Year")}:</strong> {timetable.academicYear?.year ?? t("N/A")}
              </p>
              {timetable.validity?.startDate && (
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <FaCalendarAlt className="text-indigo-400 mr-2" />
                  <strong>{t("Valid From")}:</strong>{" "}
                  {new Date(timetable.validity.startDate).toLocaleDateString()}
                  {timetable.validity?.endDate && (
                    <> – {new Date(timetable.validity.endDate).toLocaleDateString()}</>
                  )}
                </p>
              )}

              {/* Schedule Summary */}
              <div className="mt-4 bg-gray-100 p-3 rounded-lg border border-gray-200">
                <h3 className="text-md font-semibold text-gray-700">
                  {t("Schedule")}:
                </h3>
                {timetable.days?.[0] ? (
                  <div className="mt-2">
                    {timetable.type === "weekly" && (
                      <p className="text-gray-600">
                        <strong>{t("Day")}:</strong> {timetable.days[0].day}
                      </p>
                    )}
                    {["event", "exam"].includes(timetable.type) && timetable.days[0].date && (
                      <p className="text-gray-600">
                        <strong>{t("Date")}:</strong>{" "}
                        {new Date(timetable.days[0].date).toLocaleDateString()}
                      </p>
                    )}
                    {timetable.days[0].slots?.[0] && (
                      <>
                        {timetable.type === "event" ? (
                          <p className="text-gray-600">
                            <strong>{t("Event")}:</strong> {timetable.days[0].slots[0].eventName ?? t("N/A")}
                          </p>
                        ) : (
                          <p className="text-gray-600">
                            <strong>{t("Subject")}:</strong> {timetable.days[0].slots[0].subjectId?.name ?? t("N/A")}
                          </p>
                        )}
                        <p className="text-gray-600">
                          <strong>{t("Time")}:</strong> {timetable.days[0].slots[0].startTime} – {timetable.days[0].slots[0].endTime}
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">{t("No schedule available.")}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 mt-4">
                
                
                  <button
                    className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    onClick={() => handleCardClick(timetable)}
                  >
                    {t("View Timetable")}
                  </button>
              
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
});

// PropTypes for better prop validation
TimeTableList.propTypes = {
  timetables: PropTypes.object.isRequired,  // Changed to object
  loading: PropTypes.bool.isRequired,
};

export default TimeTableList;
