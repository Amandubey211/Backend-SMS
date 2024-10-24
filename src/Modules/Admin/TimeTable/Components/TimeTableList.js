import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTimetables, deleteTimetable } from "../../../../Store/Slices/Admin/TimeTable/timetable.action";
import { PiTableDuotone } from "react-icons/pi";
import { FaCalendarAlt, FaClock, FaChalkboardTeacher, FaClipboardList, FaTrashAlt } from "react-icons/fa";
import Spinner from "../../../../Components/Common/Spinner"; // Assuming you have a Spinner component

const TimeTableList = () => {
  const dispatch = useDispatch();

  // Fetch timetable data when the component mounts
  useEffect(() => {
    dispatch(fetchTimetables());
  }, [dispatch]);

  const { timetables, loading, error } = useSelector((state) => state.admin.timetable);

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
          {/* Render timetable cards */}
          {timetables.map((timetable) => (
            <div
              key={timetable._id}
              className="p-6 bg-white shadow-xl rounded-xl border border-gray-200 transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
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
                <strong>Class:</strong> {timetable.classId}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <FaCalendarAlt className="text-indigo-400 mr-2" />
                <strong>Valid From:</strong>{" "}
                {new Date(timetable.validity.startDate).toLocaleDateString()}
              </p>
              {timetable.validity.endDate && (
                <p className="text-sm text-gray-600 flex items-center">
                  <FaCalendarAlt className="text-indigo-400 mr-2" />
                  <strong>Valid To:</strong>{" "}
                  {new Date(timetable.validity.endDate).toLocaleDateString()}
                </p>
              )}

              {/* Display days and slots */}
              <div className="mt-6 bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h3 className="text-md font-semibold text-gray-700">Schedule:</h3>
                {timetable.days.map((day) => (
                  <div key={day._id} className="mt-3 border-t border-gray-300 pt-3">
                    <p className="font-medium text-gray-600 flex items-center">
                      <FaCalendarAlt className="text-indigo-400 mr-2" />
                      Date: {new Date(day.date).toLocaleDateString()}
                    </p>
                    {day.slots.map((slot) => (
                      <div key={slot._id} className="ml-4 mt-2 text-gray-600">
                        <p className="flex items-center">
                          <FaClipboardList className="text-indigo-400 mr-2" />
                          <strong>Event:</strong> {slot.eventName}
                        </p>
                        <p className="flex items-center">
                          <FaClock className="text-indigo-400 mr-2" />
                          <strong>Time:</strong> {slot.startTime} - {slot.endTime}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <button
                className="bg-red-500 text-white px-4 py-2 mt-6 rounded-full flex items-center hover:bg-red-600 transition duration-300"
                onClick={() => dispatch(deleteTimetable(timetable._id))}
              >
                <FaTrashAlt className="mr-2" /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TimeTableList;
