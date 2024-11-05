// TimeTableList.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaClipboardList,
  FaEdit,
  FaTrashAlt
} from "react-icons/fa";
import Spinner from "../../../../Components/Common/Spinner";
import PropTypes from "prop-types";
import DeleteConfirmatiomModal from "../../../../Components/Common/DeleteConfirmationModal"; // Adjust the import path as needed

const TimeTableList = React.memo(({ timetables, loading, onDelete }) => {
  const navigate = useNavigate();

  // State to manage the deletion modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timetableToDelete, setTimetableToDelete] = useState(null);

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

  // Function to open the deletion modal
  const handleDeleteClick = (e, timetable) => {
    e.stopPropagation(); // Prevent triggering card click
    setTimetableToDelete(timetable);
    setIsModalOpen(true);
  };

  // Function to confirm deletion
  const confirmDelete = () => {
    if (timetableToDelete) {
      onDelete(timetableToDelete._id);
      setIsModalOpen(false);
      setTimetableToDelete(null);
    }
  };

  // Function to close the modal without deleting
  const closeModal = () => {
    setIsModalOpen(false);
    setTimetableToDelete(null);
  };

  // Memoized sorted timetables
  const sortedTimetables = useMemo(() => {
    return [...timetables].sort((a, b) => {
      const dateA = a.validity?.startDate ? new Date(a.validity.startDate) : new Date(0);
      const dateB = b.validity?.startDate ? new Date(b.validity.startDate) : new Date(0);
      return dateB - dateA; // Latest first
    });
  }, [timetables]);

  return (
    <>
      {/* Heading with Timetable Count */}
      <div className="flex items-center justify-between mb-6 px-4">
        <h1 className="text-2xl font-bold text-gray-800"></h1>
        <div className="flex items-center">
          <span className="text-lg font-semibold text-gray-700 mr-2">Time Tables:</span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-600">
            {sortedTimetables.length}
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : sortedTimetables.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <FaClipboardList className="text-9xl text-gray-400" />
          <p className="text-xl text-gray-400 mt-4">No TimeTables Yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
          {sortedTimetables.map((timetable) => (
            <div
              key={timetable._id}
              className="p-6 bg-white shadow-xl rounded-xl border border-gray-200 transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => handleCardClick(timetable)}
            >
              {/* Card Header */}
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                {timetable.name}
                <FaClipboardList className="ml-2 text-indigo-500" />
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
                <h3 className="text-md font-semibold text-gray-700">Schedule:</h3>
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
                            <strong>Event:</strong> {timetable.days[0].slots[0].eventName ?? "N/A"}
                          </p>
                        ) : (
                          <p className="text-gray-600">
                            <strong>Subject:</strong> {timetable.days[0].slots[0].subjectId?.name ?? "N/A"}
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
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-red-600 transition duration-300"
                  onClick={(e) => handleDeleteClick(e, timetable)}
                >
                  <FaTrashAlt className="mr-2" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deletion Confirmation Modal */}
      {timetableToDelete && (
        <DeleteConfirmatiomModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={confirmDelete}
          loading={false} // You can manage loading state if deletion is asynchronous
          text="Delete Timetable"
        />
      )}
    </>
  );
});

// PropTypes for better prop validation
TimeTableList.propTypes = {
  timetables: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TimeTableList;
