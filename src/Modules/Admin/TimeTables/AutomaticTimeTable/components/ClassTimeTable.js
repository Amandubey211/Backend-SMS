import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getClassTimeTable } from "../../../../../Store/Slices/Admin/asctimetable/asctimetablethunk";

const dummyData = {
  className: "10th Grade",
  sectionName: "A",
  timetable: [
    {
      time: "9:00 AM - 9:45 AM",
      subject: "Mathematics",
      teachers: ["Mr. Smith"],
    },
    {
      time: "9:45 AM - 10:30 AM",
      subject: "Science",
      teachers: ["Mrs. Johnson", "Dr. Blake"],
    },
    {
      time: "10:30 AM - 11:15 AM",
      subject: "History",
      teachers: [],
    },
    {
      time: "11:15 AM - 12:00 PM",
      subject: "English",
      teachers: ["Mr. Brown"],
    },
  ],
};

const ClassTimeTable = ({ selectedClass, selectedSection }) => {
  const dispatch = useDispatch();
  const { loading, success, ascClassTimeTableData, error } = useSelector(
    (state) => state?.admin?.ascTimeTable
  );
  const [data, setData] = useState(dummyData);

  useEffect(() => {
    dispatch(
      getClassTimeTable({
        classId: selectedClass,
        sectionId: selectedSection,
      })
    );
  }, [dispatch, selectedClass, selectedSection]);

  const handleEdit = () => {
    // Edit handler logic
  };

  const handleDelete = () => {
    // Delete handler logic
  };

  const getColorForTeachers = (teachers) => {
    if (teachers?.length === 0) return "bg-yellow-300";
    if (teachers?.length > 1) return "bg-red-300"; 
    return "bg-white"; 
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {data.className} - Section {data.sectionName}
        </h2>
        <div className="flex space-x-4">
          <button
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleEdit}
          >
            <FaEdit className="mr-2" /> Edit
          </button>
          <button
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleDelete}
          >
            <FaTrashAlt className="mr-2" /> Delete
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex space-x-4">

          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-300 mr-2"></div>
            Multiple Teachers Assigned
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-300 mr-2"></div>
            No Teacher Assigned
          </div>
        </div>
      </div>

      <table className="w-full border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Subject</th>
            {data.timetable.map((item, index) => (
              <th key={index} className="border px-4 py-2">
                {item.time}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.timetable.map((item, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{item.subject}</td>
              {data.timetable.map((timeItem, timeIndex) => (
                <td
                  key={timeIndex}
                  className={`border px-4 py-2 text-center ${getColorForTeachers(
                    timeItem.teachers
                  )}`}
                >
                  {timeItem.teachers.length > 0
                    ? timeItem.teachers.join(", ")
                    : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassTimeTable;
