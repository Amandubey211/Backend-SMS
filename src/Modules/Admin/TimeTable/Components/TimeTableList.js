import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTimetables, deleteTimetable } from "../../../../Store/Slices/Admin/TimeTable/timetable.action";
import { Modal, Table, Button } from "antd";
import { PiTableDuotone } from "react-icons/pi";
import { FaCalendarAlt, FaClock, FaChalkboardTeacher, FaClipboardList, FaTrashAlt } from "react-icons/fa";
import Spinner from "../../../../Components/Common/Spinner";

const TimeTableList = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTimetable, setSelectedTimetable] = useState(null);

  useEffect(() => {
    dispatch(fetchTimetables());
  }, [dispatch]);

  const { timetables, loading, error } = useSelector((state) => state.admin.timetable);

  // Function to get columns based on the table type
  const getColumns = (type) => {
    switch (type) {
      case "weekly":
        return [
          { title: "Day", dataIndex: "day", key: "day" },
          { title: "Subject", dataIndex: "subject", key: "subject" },
          { title: "Start Time", dataIndex: "startTime", key: "startTime" },
          { title: "End Time", dataIndex: "endTime", key: "endTime" },
          { title: "Description", dataIndex: "description", key: "description" }
        ];
      case "exam":
        return [
          { title: "Date", dataIndex: "date", key: "date" },
          { title: "Subject", dataIndex: "subject", key: "subject" },
          { title: "Start Time", dataIndex: "startTime", key: "startTime" },
          { title: "End Time", dataIndex: "endTime", key: "endTime" },
          { title: "Description", dataIndex: "description", key: "description" }
        ];
      case "event":
        return [
          { title: "Event Name", dataIndex: "eventName", key: "eventName" },
          { title: "Date", dataIndex: "date", key: "date" },
          { title: "Start Time", dataIndex: "startTime", key: "startTime" },
          { title: "End Time", dataIndex: "endTime", key: "endTime" },
          { title: "Description", dataIndex: "description", key: "description" }
        ];
      default:
        return [
          { title: "Other Title", dataIndex: "otherTitle", key: "otherTitle" },
          { title: "Subject", dataIndex: "subject", key: "subject" },
          { title: "Start Time", dataIndex: "startTime", key: "startTime" },
          { title: "End Time", dataIndex: "endTime", key: "endTime" },
          { title: "Description", dataIndex: "description", key: "description" }
        ];
    }
  };

  // Function to format dates and handle invalid dates
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  const showModal = (timetable) => {
    setSelectedTimetable(timetable);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedTimetable(null);
  };

  const handleEdit = () => {
    console.log("Edit action triggered for:", selectedTimetable);
    // Add edit functionality here, e.g., open edit form/modal or navigate to edit page
  };

  const handleDelete = () => {
    if (selectedTimetable) {
      dispatch(deleteTimetable(selectedTimetable._id));
      handleCloseModal(); // Close modal after deletion
    }
  };

  // Prepare table data based on selected timetable
  const tableData = selectedTimetable?.days?.flatMap((day) =>
    day.slots.map((slot) => ({
      key: slot._id,
      eventName: slot.eventName || "N/A",
      subject: slot.subjectId?.name || "N/A",
      otherTitle: selectedTimetable?.name || "N/A",
      day: day.day || "N/A",
      date: formatDate(day.date || null),
      startTime: slot.startTime || "N/A",
      endTime: slot.endTime || "N/A",
      description: slot.description || "N/A",
    }))
  ) || [];

  return (
    <>
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-500">Failed to load timetables: {error}</p>
      ) : timetables?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <PiTableDuotone className="text-9xl text-gray-400" />
          <p className="text-xl text-gray-400 mt-4">No TimeTables Yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
          {timetables.map((timetable) => (
            <div
              key={timetable._id}
              className="p-6 bg-white shadow-xl rounded-xl border border-gray-200 transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => showModal(timetable)}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {timetable.name} <FaClipboardList className="inline-block ml-2 text-indigo-500" />
              </h2>
              <p className="text-sm text-gray-600 flex items-center">
                <FaChalkboardTeacher className="text-indigo-400 mr-2" />
                <strong>Type:</strong> {timetable.type}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <FaChalkboardTeacher className="text-indigo-400 mr-2" />
                <strong>Status:</strong> {timetable.status}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <FaChalkboardTeacher className="text-indigo-400 mr-2" />
                <strong>Class:</strong> {timetable.classId?.className || "N/A"}
              </p>
              {timetable.validity && (
                <>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaCalendarAlt className="text-indigo-400 mr-2" />
                    <strong>Valid From:</strong> {formatDate(timetable.validity.startDate)}
                  </p>
                  {timetable.validity.endDate && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <FaCalendarAlt className="text-indigo-400 mr-2" />
                      <strong>Valid To:</strong> {formatDate(timetable.validity.endDate)}
                    </p>
                  )}
                </>
              )}
              <div className="mt-6 bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h3 className="text-md font-semibold text-gray-700">Schedule:</h3>
                {timetable.days && timetable.days.length > 0 ? (
                  timetable.days.map((day, index) => (
                    <div key={index} className="mt-3 border-t border-gray-300 pt-3">
                      {timetable.type === "weekly" && day.day && (
                        <p className="font-medium text-gray-600 flex items-center">
                          <FaCalendarAlt className="text-indigo-400 mr-2" />
                          Day: {day.day}
                        </p>
                      )}
                      {(timetable.type === "exam" || timetable.type === "event") && day.date && (
                        <p className="font-medium text-gray-600 flex items-center">
                          <FaCalendarAlt className="text-indigo-400 mr-2" />
                          Date: {formatDate(day.date)}
                        </p>
                      )}
                      {day.slots && day.slots.length > 0 ? (
                        day.slots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="ml-4 mt-2 text-gray-600">
                            {timetable.type === "event" ? (
                              <p className="flex items-center">
                                <FaClipboardList className="text-indigo-400 mr-2" />
                                <strong>Event:</strong> {slot.eventName || "N/A"}
                              </p>
                            ) : (
                              <p className="flex items-center">
                                <FaClipboardList className="text-indigo-400 mr-2" />
                                <strong>Subject:</strong> {slot.subjectId?.name || "N/A"}
                              </p>
                            )}
                            <p className="flex items-center">
                              <FaClock className="text-indigo-400 mr-2" />
                              <strong>Time:</strong> {slot.startTime} - {slot.endTime}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No slots available.</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No schedule available.</p>
                )}
              </div>

              <button
                className="bg-red-500 text-white px-4 py-2 mt-6 rounded-full flex items-center hover:bg-red-600 transition duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(deleteTimetable(timetable._id));
                }}
              >
                <FaTrashAlt className="mr-2" /> Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={selectedTimetable?.name}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="edit" type="primary" onClick={handleEdit}>
            Edit
          </Button>,
          <Button key="delete" type="danger" onClick={handleDelete}>
            Delete
          </Button>
        ]}
        width={800}
      >
        <Table columns={getColumns(selectedTimetable?.type)} dataSource={tableData} pagination={false} />
      </Modal>
    </>
  );
};

export default TimeTableList;
