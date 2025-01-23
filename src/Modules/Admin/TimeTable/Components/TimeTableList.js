import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../../Components/Common/Spinner";
import PropTypes from "prop-types";
import DeleteConfirmationModal from "../../../../Components/Common/DeleteConfirmationModal"; // Corrected typo
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Dropdown, Menu, Tag, Tooltip } from "antd";
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  EyeOutlined,
  MailOutlined,
} from "@ant-design/icons";

const TimeTableList = React.memo(({ timetables, loading, onDelete }) => {
  const { t } = useTranslation("admTimeTable");
  const navigate = useNavigate();
  const role = useSelector((store) => store.common.auth.role);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timetableToDelete, setTimetableToDelete] = useState(null);

  const handleCardClick = (timetable) => {
    navigate(`/timetable/viewtable/${timetable.name}`, {
      state: { timetable },
    });
  };

  const handleEditClick = (record) => {
    navigate(`/timetable/edit/${record._id}`);
  };

  const handleDeleteClick = (record) => {
    setTimetableToDelete(record);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (timetableToDelete) {
      onDelete(timetableToDelete._id);
      setIsModalOpen(false);
      setTimetableToDelete(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimetableToDelete(null);
  };

  const sortedTimetables = useMemo(() => {
    return [...timetables]?.sort((a, b) => {
      const dateA = a.validity?.startDate ? new Date(a.validity.startDate) : new Date(0);
      const dateB = b.validity?.startDate ? new Date(b.validity.startDate) : new Date(0);
      return dateB - dateA;
    });
  }, [timetables]);

  const actionMenu = (record) => (
    <Menu>
      <Menu.Item key="1" onClick={() => handleEditClick(record)}>
        <EditOutlined style={{ marginRight: 8 }} />
        {t("Edit")}
      </Menu.Item>
      <Menu.Item key="2" onClick={() => handleDeleteClick(record)}>
        <DeleteOutlined style={{ marginRight: 8 }} />
        {t("Delete")}
      </Menu.Item>
    </Menu>
  );

  // Updated renderSchedule function
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
          {/* Since 'others' type does not have 'date' or 'day', we display 'startTime' and 'heading' */}
          <p className="text-gray-600">
            <strong>{t("Start Time")}:</strong> {firstSlot.startTime}
          </p>
          <p className="text-gray-600">
            <strong>{t("Heading")}:</strong> {firstSlot.heading ?? "N/A"}
          </p>
        </div>
      );
    } else {
      // For any other types, do not show schedule
      return <p className="text-gray-500">{t("No schedule available.")}</p>;
    }
  };

  return (
    <>
      {/* Heading */}
      <div className="flex items-center justify-between mb-6 px-4">
        <h1 className="text-2xl font-bold text-gray-800">{t("Timetables")}</h1>
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
          <p className="text-xl text-gray-400 mt-4">{t("No Timetables Yet!")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
          {sortedTimetables?.map((timetable) => (
            <div
              key={timetable._id}
              className="relative p-6 bg-white border border-gray-200 shadow-lg rounded-xl transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
              onClick={() => handleCardClick(timetable)}
            >
              {/* Active/Draft Tag and Dropdown */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                {/* Active/Draft Tag */}
                <span
                  className={`text-sm font-normal px-2 rounded ${
                    timetable.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-gray-700"
                  }`}
                >
                  {timetable.status === "active" ? t("Active") : t("Draft")}
                </span>
                {/* Dropdown with Grey Circle Border */}
                <Dropdown overlay={actionMenu(timetable)} trigger={["click"]}>
                  <EllipsisOutlined
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                    }}
                    style={{
                      fontSize: "18px",
                      color: "gray",
                      cursor: "pointer",
                      border: "1px solid gray",
                      borderRadius: "50%",
                      padding: "4px",
                    }}
                  />
                </Dropdown>
              </div>

              {/* Card Header */}
              <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">{timetable.name}</h2>

              {/* Details Section */}
              <div className="mb-4">
                {/* Type as a Tag */}
                <p className="text-sm text-gray-600 flex items-center">
                  <strong className="mr-1">{t("Type")}:</strong>
                  <span className="inline-flex items-center justify-center bg-purple-100 text-purple-700 text-sm font-medium px-2 ml-1 mt-1 rounded-full">
                    {timetable.type}
                  </span>
                </p>

                {/* Class (with school) as a Tag */}
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <strong className="mr-1">{t("Class")}:</strong>
                  <span className="inline-flex items-center justify-center bg-yellow-100 text-yellow-700 text-sm font-medium px-2 ml-1 mt-1 rounded-full">
                    {timetable.classId?.className ?? "N/A"},{" "}
                    {timetable.schoolId?.nameOfSchool ?? "N/A"}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>{t("Academic Year")}:</strong> {timetable.academicYear?.year ?? "N/A"}
                </p>
                {timetable.validity?.startDate && (
                  <p className="text-sm text-gray-600 mt-1">
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
              <div className="bg-gray-100 p-4 rounded-lg mb-4 border border-gray-200">
                <h3 className="text-md font-semibold text-gray-700">{t("Schedule")}</h3>
                {renderSchedule(timetable)}
              </div>

              {/* View Button */}
              <div className="flex justify-end">
                <button className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  {t("View Timetable")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deletion Confirmation Modal */}
      {timetableToDelete && (
        <DeleteConfirmationModal // Corrected typo
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
  timetables: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TimeTableList;
