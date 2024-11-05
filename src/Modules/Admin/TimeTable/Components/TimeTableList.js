// TimeTableList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaClipboardList,
  FaTrashAlt,
  FaEdit,
} from "react-icons/fa";
import Spinner from "../../../../Components/Common/Spinner";
import { Popconfirm } from "antd"; // Import Popconfirm for delete confirmation
import PropTypes from "prop-types"; // Optional: For prop type validation

const TimeTableList = React.memo(({ timetables, loading, onDelete }) => {
  const navigate = useNavigate();

  // Function to handle card click and navigate to TableView
  const handleCardClick = (timetable) => {
    navigate(`/noticeboard/timetable/viewtable/${timetable.name}`, {
      state: { timetable },
    });
  };

  // Function to handle edit button click
  const handleEditClick = (e, timetable) => {
    e.stopPropagation(); // Prevent triggering card click
    navigate(`/noticeboard/timetable/edit/${timetable._id}`);
  };

  // Function to handle delete confirmation
  const confirmDelete = (id) => {
    onDelete(id);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : timetables.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <FaClipboardList className="text-9xl text-gray-400" />
          <p className="text-xl text-gray-400 mt-4">No TimeTables Yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
          {timetables.map((timetable) => (
            <div
              key={timetable._id}
              className="p-6 bg-white shadow-xl rounded-xl border border-gray-200 transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => handleCardClick(timetable)}
            >
              {/* Card Header */}
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {timetable.name}
                <FaClipboardList className="inline-block ml-2 text-indigo-500" />
              </h2>
              <p className="text-sm text-gray-600 flex items-center">
                <FaChalkboardTeacher className="text-indigo-400 mr-2" />
                <strong>Type:</strong> {timetable.type}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <FaChalkboardTeacher className="text-indigo-400 mr-2" />
                <strong>Status:</strong>{" "}
                <span className="text-green-600">{timetable.status}</span>
              </p>

              {/* General Info */}
              <p className="text-sm text-gray-600 flex items-center mt-2">
                <FaChalkboardTeacher className="text-indigo-400 mr-2" />
                <strong>Class:</strong>{" "}
                {timetable.classId?.className ?? "N/A"}, {timetable.schoolId?.nameOfSchool ?? "N/A"}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <FaCalendarAlt className="text-indigo-400 mr-2" />
                <strong>Academic Year:</strong> {timetable.academicYear?.year ?? "N/A"}
              </p>
              {timetable.validity?.startDate && (
                <p className="text-sm text-gray-600 flex items-center">
                  <FaCalendarAlt className="text-indigo-400 mr-2" />
                  <strong>Valid From:</strong>{" "}
                  {new Date(timetable.validity.startDate).toLocaleDateString()}
                  {timetable.validity?.endDate && (
                    <> – {new Date(timetable.validity.endDate).toLocaleDateString()}</>
                  )}
                </p>
              )}

              {/* Schedule Summary */}
              <div className="mt-4 bg-gray-100 p-3 rounded-lg border border-gray-200">
                <h3 className="text-md font-semibold text-gray-700">
                  Schedule:
                </h3>
                {timetable.days?.[0] ? (
                  <div className="mt-2">
                    {timetable.type === "weekly" && (
                      <p className="text-gray-600">
                        <strong>Day:</strong> {timetable.days[0].day}
                      </p>
                    )}
                    {["event", "exam"].includes(timetable.type) && timetable.days[0].date && (
                      <p className="text-gray-600">
                        <strong>Date:</strong>{" "}
                        {new Date(timetable.days[0].date).toLocaleDateString()}
                      </p>
                    )}
                    {timetable.days[0].slots?.[0] && (
                      <>
                        {timetable.type === "event" ? (
                          <p className="text-gray-600">
                            <strong>Event:</strong>{" "}
                            {timetable.days[0].slots[0].eventName ?? "N/A"}
                          </p>
                        ) : (
                          <p className="text-gray-600">
                            <strong>Subject:</strong>{" "}
                            {timetable.days[0].slots[0].subjectId?.name ?? "N/A"}
                          </p>
                        )}
                        <p className="text-gray-600">
                          <strong>Time:</strong> {timetable.days[0].slots[0].startTime} – {timetable.days[0].slots[0].endTime}
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No schedule available.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-blue-600 transition duration-300"
                  onClick={(e) => handleEditClick(e, timetable)}
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <Popconfirm
                  title="Are you sure to delete this timetable?"
                  onConfirm={() => confirmDelete(timetable._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-red-600 transition duration-300"
                    onClick={(e) => e.stopPropagation()} // Prevent card click
                  >
                    <FaTrashAlt className="mr-2" /> Delete
                  </button>
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
});

// Optional: Add PropTypes for better prop validation
TimeTableList.propTypes = {
  timetables: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TimeTableList;
