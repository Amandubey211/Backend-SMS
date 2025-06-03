import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClassTimeTable } from '../../../../Store/Slices/Admin/asctimetable/asctimetablethunk';

const ClassTimeTable = ({ selectedClass, selectedSection }) => {
  const dispatch = useDispatch();
  const { ascClassTimeTableData, loading, error } = useSelector(
    (state) => state.admin.ascTimeTable
  );

  useEffect(() => {
    dispatch(
      getClassTimeTable({
        classId: selectedClass,
        sectionId: selectedSection,
      })
    );
  }, [dispatch, selectedClass, selectedSection]);

  const getColorForTeachers = (teachers) => {
    if (!teachers || teachers.length === 0) return 'bg-yellow-300';
    return 'bg-white';
  };

  const data = ascClassTimeTableData || {};

  return (
    <>
      {data?.startTime ? (
        <div className="p-4">
          <div className="mb-6">
            <p className="text-gray-600">
              Timings: <span className="font-medium">{data.startTime || 'N/A'}</span> to{' '}
              <span className="font-medium">{data.endTime || 'N/A'}</span>
            </p>
            <p className="text-gray-500 mt-2">
              Applicable for:{' '}
              {data?.days?.map((day, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-600 rounded px-2 py-1 text-sm mr-2"
                >
                  {day}
                </span>
              ))}
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
              {data?.generatedTimeTabel?.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {item?.timing?.startTime || ''} - {item?.timing?.endTime || ''}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {item?.subjectName || '-'}
                  </td>
                  <td
                    className={`border px-4 py-2 text-center ${getColorForTeachers(item?.teacherName)}`}
                  >
                    {item?.teacherName || 'Not Assigned'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="p-8 rounded-lg flex flex-col items-center">
            <span className="text-6xl mb-4">📜</span>
            <p className="text-lg font-medium text-gray-700">TimeTable Not Available</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassTimeTable;