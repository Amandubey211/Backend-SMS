import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTimetables,
  deleteTimetable,
} from "../../../../Store/Slices/Admin/TimeTable/timetable.action";
import { useNavigate } from "react-router-dom";
import { PiTableDuotone } from "react-icons/pi";
import {
  FaCalendarAlt,
  FaClock,
  FaChalkboardTeacher,
  FaClipboardList,
  FaTrashAlt,
  FaEdit, // Import the edit icon
} from "react-icons/fa";
import Spinner from "../../../../Components/Common/Spinner";

const TimeTableList = React.memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTimetables());
  }, [dispatch]);

  const { timetables, loading, error } = useSelector(
    (state) => state.admin.timetable
  );

  // Cache the processed timetables for better performance
  const cachedTimetables = useMemo(() => timetables || [], [timetables]);

  // Function to handle click and navigate to TableView with selected timetable data
  const handleCardClick = (timetable) => {
    navigate(`/noticeboard/timetable/viewtable/${timetable.name}`, {
      state: { timetable },
    });
  };

  // Function to handle edit button click
  const handleEditClick = (e, timetable) => {
    e.stopPropagation(); // Prevent the card click event
    navigate(`/noticeboard/timetable/edit/${timetable._id}`); // Navigate to the edit page
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-500">Failed to load timetables: {error}</p>
      ) : cachedTimetables.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <PiTableDuotone className="text-9xl text-gray-400" />
          <p className="text-xl text-gray-400 mt-4">No TimeTables Yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
          {cachedTimetables.map((timetable) => (
            <div
              key={timetable._id}
              className="p-6 bg-white shadow-xl rounded-xl border border-gray-200 transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => handleCardClick(timetable)} // Navigate to TableView on click
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {timetable.name}{" "}
                <FaClipboardList className="inline-block ml-2 text-indigo-500" />
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
                <strong>Class:</strong>{" "}
                {timetable.classId?.className ?? "N/A"}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <FaChalkboardTeacher className="text-indigo-400 mr-2" />
                <strong>School:</strong>{" "}
                {timetable.schoolId?.nameOfSchool ?? "N/A"}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <FaChalkboardTeacher className="text-indigo-400 mr-2" />
                <strong>Academic Year:</strong>{" "}
                {timetable.academicYear?.year ?? "N/A"}
              </p>
              {/* Validity */}
              {timetable.validity && (
                <>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaCalendarAlt className="text-indigo-400 mr-2" />
                    <strong>Valid From:</strong>{" "}
                    {new Date(timetable.validity.startDate).toLocaleDateString()}
                  </p>
                  {timetable.validity?.endDate && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <FaCalendarAlt className="text-indigo-400 mr-2" />
                      <strong>Valid To:</strong>{" "}
                      {new Date(
                        timetable.validity.endDate
                      ).toLocaleDateString()}
                    </p>
                  )}
                </>
              )}

              {/* Display days and slots */}
              <div className="mt-6 bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h3 className="text-md font-semibold text-gray-700">
                  Schedule:
                </h3>
                {timetable.days?.length > 0 ? (
                  timetable.days.map((day, index) => (
                    <div
                      key={index}
                      className="mt-3 border-t border-gray-300 pt-3"
                    >
                      {timetable.type === "weekly" && day.day && (
                        <p className="font-medium text-gray-600 flex items-center">
                          <FaCalendarAlt className="text-indigo-400 mr-2" />
                          Day: {day.day}
                        </p>
                      )}
                      {(timetable.type === "exam" ||
                        timetable.type === "event") &&
                        day.date && (
                          <p className="font-medium text-gray-600 flex items-center">
                            <FaCalendarAlt className="text-indigo-400 mr-2" />
                            Date:{" "}
                            {new Date(day.date).toLocaleDateString()}
                          </p>
                        )}

                      {day.slots?.length > 0 ? (
                        day.slots.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="ml-4 mt-2 text-gray-600"
                          >
                            {timetable.type === "event" ? (
                              <p className="flex items-center">
                                <FaClipboardList className="text-indigo-400 mr-2" />
                                <strong>Event:</strong>{" "}
                                {slot.eventName ?? "N/A"}
                              </p>
                            ) : (
                              <>
                                <p className="flex items-center">
                                  <FaClipboardList className="text-indigo-400 mr-2" />
                                  <strong>Subject:</strong>{" "}
                                  {slot.subjectId?.name ?? "N/A"}
                                </p>
                                {slot.description && (
                                  <p className="flex items-center">
                                    <FaClipboardList className="text-indigo-400 mr-2" />
                                    <strong>Description:</strong>{" "}
                                    {slot.description}
                                  </p>
                                )}
                              </>
                            )}
                            <p className="flex items-center">
                              <FaClock className="text-indigo-400 mr-2" />
                              <strong>Time:</strong> {slot.startTime} -{" "}
                              {slot.endTime}
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

              {/* Edit and Delete Buttons */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-blue-600 transition duration-300"
                  onClick={(e) => handleEditClick(e, timetable)}
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-red-600 transition duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(deleteTimetable(timetable._id));
                  }}
                >
                  <FaTrashAlt className="mr-2" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
});

export default TimeTableList;
