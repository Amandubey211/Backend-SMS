import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClassTimeTable } from '../../../../Store/Slices/Admin/asctimetable/asctimetablethunk';
import Spinner from "../../../../Components/Common/Spinner";

const ClassTimeTable = ({ selectedClass, selectedSection }) => {
  const dispatch = useDispatch();
  const { ascClassTimeTableData, loading, error } = useSelector(
    (state) => state.admin.ascTimeTable
  );

  useEffect(() => {
    if (selectedClass && selectedSection) {
      dispatch(
        getClassTimeTable({
          classId: selectedClass,
          sectionId: selectedSection,
        })
      );
    }
  }, [dispatch, selectedClass, selectedSection]);

  const getColorForTeachers = (teachers) => {
    if (!teachers || teachers.length === 0) return 'bg-yellow-300';
    return 'bg-white';
  };

  // Ensure data is always an array
  const data = Array.isArray(ascClassTimeTableData) ? ascClassTimeTableData : [];

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="p-8 rounded-lg flex flex-col items-center">
          <span className="text-6xl mb-4">❌</span>
          <p className="text-lg font-medium text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Handle empty or invalid data
  if (!data.length) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="p-8 rounded-lg flex flex-col items-center">
          <span className="text-6xl mb-4">📜</span>
          <p className="text-lg font-medium text-gray-700">TimeTable Not Available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {data.map((item, index) => (
        item?.generatedTimeTabel?.length > 0 ? (
          <div className="p-4" key={index}>
            <div className="mb-6">
              <p className="text-gray-600">
                Timings: <span className="font-medium">{item.startTime || 'N/A'}</span> to{' '}
                <span className="font-medium">{item.endTime || 'N/A'}</span>
              </p>
              <p className="text-gray-500 mt-2">
                Applicable for:{' '}
                {Array.isArray(item?.days) ? (
                  item.days.map((day, i) => (
                    <span
                      key={i}
                      className="inline-block bg-blue-100 text-blue-600 rounded px-2 py-1 text-sm mr-2"
                    >
                      {day}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </p>
            </div>

            <table className="w-full border border-gray-300 shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Time</th>
                  <th className="border px-4 py-2">Subject</th>
                  <th className="border px-4 py-2">Teacher</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(item?.generatedTimeTabel) ? (
                  item.generatedTimeTabel.map((it, i) => (
                    <tr key={i}>
                      <td className="border px-4 py-2">
                        {it?.timing?.startTime || ''} - {it?.timing?.endTime || ''}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {it?.subjectName || '-'}
                      </td>
                      <td
                        className={`border px-4 py-2 text-center ${getColorForTeachers(it?.teacherName)}`}
                      >
                        {it?.teacherName || 'Not Assigned'}
                      </td>
                    </tr>
                  
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="border px-4 py-2 text-center text-gray-500">
                      No timetable data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full" key={index}>
            <div className="p-8 rounded-lg flex flex-col items-center">
              <span className="text-6xl mb-4">📜</span>
              <p className="text-lg font-medium text-gray-700">TimeTable Not Available</p>
            </div>
          </div>
        )
      ))}
    </>
  );
};

export default ClassTimeTable;