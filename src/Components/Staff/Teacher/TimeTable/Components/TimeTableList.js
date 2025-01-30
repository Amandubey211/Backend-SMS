import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Dropdown, Menu, Tag, Tooltip } from "antd";
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FaCalendarAlt, FaChalkboardTeacher, FaClipboardList } from "react-icons/fa";
import Spinner from "../../../../../Components/Common/Spinner";
import DeleteConfirmationModal from "../../../../../Components/Common/DeleteConfirmationModal";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../config/permission";
import ProtectedAction from "../../../../../Routes/ProtectedRoutes/ProtectedAction";
const TimeTableList = React.memo(({ timetables, loading, onDelete }) => {
  const { t } = useTranslation("admTimeTable");
  const navigate = useNavigate();
  const role = useSelector((store) => store.common.auth.role);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timetableToDelete, setTimetableToDelete] = useState(null);

  // Correctly extract the timetables array from the timetables object
  const timetableData = Array.isArray(timetables?.timetables) ? timetables.timetables : [];

  // Handle card click to view timetable
  const handleCardClick = (timetable) => {
    navigate(`/timetable/viewtable/${timetable.name}`, {
      state: { timetable },
    });
  };

  // Handle edit action
  const handleEditClick = (record) => {
    navigate(`/timetable/edit/${record._id}`);
  };

  // Handle delete action
  const handleDeleteClick = (record) => {
    setTimetableToDelete(record);
    setIsModalOpen(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (timetableToDelete) {
      onDelete(timetableToDelete._id);
      setIsModalOpen(false);
      setTimetableToDelete(null);
    }
  };

  // Close deletion modal
  const closeModal = () => {
    setIsModalOpen(false);
    setTimetableToDelete(null);
  };

  // Sort timetables by validity.startDate descending
  const sortedTimetables = useMemo(() => {
    return [...timetableData]?.sort((a, b) => {
      const dateA = a.validity?.startDate ? new Date(a.validity.startDate) : new Date(0);
      const dateB = b.validity?.startDate ? new Date(b.validity.startDate) : new Date(0);
      return dateB - dateA;
    });
  }, [timetableData]);

  // Action menu for each timetable card
  const actionMenu = (record) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={(e) => {
          e.domEvent.stopPropagation(); // Prevent card click (Ant Design v4)
          handleEditClick(record);
        }}
      >
        {t("Edit")}
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        onClick={(e) => {
          e.domEvent.stopPropagation(); // Prevent card click (Ant Design v4)
          handleDeleteClick(record);
        }}
      >
        {t("Delete")}
      </Menu.Item>
    </Menu>
  );

  // Render schedule based on timetable type
  const renderSchedule = (timetable) => {
    const { type, days } = timetable;

    if (!days || days.length === 0) {
      return <p className="text-gray-500">{t("No schedule available.")}</p>;
    }

    const firstDay = days[0];
    const firstSlot = firstDay.slots?.[0];

    if (!firstSlot) {
      return <p className="text-gray-500">{t("No schedule available.")}</p>;
    }

    // Depending on type, render different schedule details
    if (type === "event") {
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
            <strong>{t("Time")}:</strong> {firstSlot.startTime} – {firstSlot.endTime}
          </p>
        </div>
      );
    } else if (type === "weekly") {
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
            <strong>{t("Time")}:</strong> {firstSlot.startTime} – {firstSlot.endTime}
          </p>
        </div>
      );
    } else if (type === "exam") {
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
            <strong>{t("Time")}:</strong> {firstSlot.startTime} – {firstSlot.endTime}
          </p>
        </div>
      );
    } else if (type === "others") {
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
    } else {
      return <p className="text-gray-500">{t("No schedule available.")}</p>;
    }
  };

  return (
    <>
      <ProtectedSection requiredPermission={PERMISSIONS.TIMETABLE_VIEW} title={t("Time Tables")}>
        {/* Heading */}
        <div className="flex items-center justify-between mb-6 px-4">
          <h1 className="text-2xl font-bold text-gray-800">{t("Timetables:")}</h1>
          <div className="flex items-center">
            <span className="text-lg font-semibold text-gray-700 mr-2">{t("Time Tables")}:</span>
            <div className="flex items-center justify-center w-8 h-8 rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-600">
              {sortedTimetables?.length}
            </div>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : sortedTimetables?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <FaClipboardList className="text-9xl text-gray-400" />
            <p className="text-xl text-gray-400 mt-4">{t("No Timetables Yet!")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
            {sortedTimetables?.map((timetable) => (
              <div
                key={timetable._id}
                className="relative p-6 bg-white border border-gray-200 shadow-lg rounded-xl transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col"
                onClick={() => handleCardClick(timetable)}
              >


                {/* Card Header */}
                <h2 className="text-xl font-bold text-gray-800 mb-4 mt-2 flex items-center">
                  {timetable.name}
                  <FaClipboardList className="ml-2 text-indigo-500" />
                </h2>

                {/* Details Section */}
                <div className="mb-4">
                  {/* Type as a Tag */}
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaChalkboardTeacher className="text-indigo-400 mr-2" />
                    <strong className="mr-1">{t("Type")}:</strong>
                    <span className="inline-flex items-center justify-center bg-purple-100 text-purple-700 text-sm font-medium px-2 ml-1 mt-1 rounded-full">
                      {timetable.type}
                    </span>
                  </p>

                  {/* Class (with school) as a Tag */}
                  <p className="text-sm text-gray-600 mt-1 flex items-center flex-wrap">
                    <FaChalkboardTeacher className="text-indigo-400 mr-2" />
                    <strong className="mr-1">{t("Class")}:</strong>
                    <span className="inline-flex items-center justify-center bg-yellow-100 text-yellow-700 text-sm font-medium px-2 ml-1 mt-1 rounded-full whitespace-normal">
                      {timetable.classId?.className ?? "N/A"}, {timetable.schoolId?.nameOfSchool ?? "N/A"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                    <FaCalendarAlt className="text-indigo-400 mr-2" />
                    <strong>{t("Academic Year")}:</strong> {timetable.academicYear?.year ?? "N/A"}
                  </p>
                  {timetable.validity?.startDate && (
                    <p className="text-sm text-gray-600 mt-1 flex items-center">
                      <FaCalendarAlt className="text-indigo-400 mr-2" />
                      <strong>{t("Valid From")}:</strong>{" "}
                      {new Date(timetable.validity.startDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                {/* Schedule Section */}
                <div className="bg-gray-100 p-4 rounded-lg mb-4 border border-gray-200 flex-1">
                  <h3 className="text-md font-semibold text-gray-700">{t("Schedule")}</h3>
                  {renderSchedule(timetable)}
                </div>

                {/* View Button */}
                <div className="mt-auto flex justify-end">
                  <button
                    className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleCardClick(timetable);
                    }}
                  >
                    {t("View Timetable")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Deletion Confirmation Modal */}
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
    </>
  );
});

TimeTableList.propTypes = {
  timetables: PropTypes.shape({
    success: PropTypes.bool.isRequired,
    timetables: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TimeTableList;
