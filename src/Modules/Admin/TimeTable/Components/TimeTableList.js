import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTimetables, deleteTimetable } from "../../../../Store/Slices/Admin/TimeTable/timetable.action";
import { PiTableDuotone } from "react-icons/pi";
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
        <div className="grid grid-cols-3 gap-4">
          {/* Render timetable cards */}
          {timetables.map((timetable) => (
            <div key={timetable._id} className="p-4 bg-white shadow rounded-md">
              <h2 className="text-lg font-bold">{timetable.name}</h2>
              <p>Type: {timetable.type}</p>
              <p>Status: {timetable.status}</p>
              <p>Class: {timetable.classId}</p>
              <p>Valid From: {new Date(timetable.validity.startDate).toLocaleDateString()}</p>
              {timetable.validity.endDate && <p>Valid To: {new Date(timetable.validity.endDate).toLocaleDateString()}</p>}
              <button 
                className="bg-red-500 text-white px-2 py-1 mt-2 rounded"
                onClick={() => dispatch(deleteTimetable(timetable._id))}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TimeTableList;
