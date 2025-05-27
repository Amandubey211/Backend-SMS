import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const dummyData = {
  className: "10th Grade",
  sectionName: "A",
  timetable: [
    {
      time: "9:00 AM - 9:45 AM",
      subject: "Mathematics",
      teacher: "Mr. Smith",
    },
    {
      time: "9:45 AM - 10:30 AM",
      subject: "Science",
      teacher: "Mrs. Johnson",
    },
    {
      time: "10:30 AM - 11:15 AM",
      subject: "History",
      teacher: "Ms. Davis",
    },
    {
      time: "11:15 AM - 12:00 PM",
      subject: "English",
      teacher: "Mr. Brown",
    },
  ],
};

const ClassTimeTable = () => {
  const [data, setData] = useState(dummyData);

  const handleEdit = ()=>{

  }
  const handleDelete = ()=>{

  }

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
      <table className="w-full border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Timing</th>
            <th className="border px-4 py-2">Subject</th>
            <th className="border px-4 py-2">Teacher</th>
          </tr>
        </thead>
        <tbody>
          {data.timetable.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{item.time}</td>
              <td className="border px-4 py-2">{item.subject}</td>
              <td className="border px-4 py-2">{item.teacher}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassTimeTable;
