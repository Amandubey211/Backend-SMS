import React, { useState } from "react";
import { FaCheckSquare } from "react-icons/fa";
import { FaSquareXmark, FaRegCircleDot } from "react-icons/fa6";
const initialStudents = [
  {
    id: 548696,
    name: "Rachne Ravindra",
    present: false,
    absent: false,
    leave: false,
    photo: "https://avatars.githubusercontent.com/u/109097090?v=4",
  },
  {
    id: 548697,
    name: "Courtney Henry",
    present: false,
    absent: false,
    leave: false,
    photo: "https://avatars.githubusercontent.com/u/109097090?v=4",
  },
  {
    id: 548698,
    name: "Jane Cooper",
    present: false,
    absent: false,
    leave: false,
    photo: "https://avatars.githubusercontent.com/u/109097090?v=4",
  },
  {
    id: 548699,
    name: "Rachne Ravindra",
    present: false,
    absent: false,
    leave: false,
    photo: "https://avatars.githubusercontent.com/u/109097090?v=4",
  },
  {
    id: 548700,
    name: "Jenny Wilson",
    present: false,
    absent: false,
    leave: false,
    photo: "https://avatars.githubusercontent.com/u/109097090?v=4",
  },
  {
    id: 548701,
    name: "Courtney Henry",
    present: false,
    absent: false,
    leave: false,
    photo: "https://avatars.githubusercontent.com/u/109097090?v=4",
  },
  {
    id: 548702,
    name: "Leslie Alexander",
    present: false,
    absent: false,
    leave: false,
    photo: "https://avatars.githubusercontent.com/u/109097090?v=4",
  },
  {
    id: 548703,
    name: "Jacob Jones",
    present: false,
    absent: false,
    leave: false,
    photo: "https://avatars.githubusercontent.com/u/109097090?v=4",
  },
  {
    id: 548704,
    name: "Leslie Alexander",
    present: false,
    absent: false,
    leave: false,
    photo: "https://avatars.githubusercontent.com/u/109097090?v=4",
  },
  {
    id: 548705,
    name: "Jacob Jones",
    present: false,
    absent: false,
    leave: false,
    photo: "https://avatars.githubusercontent.com/u/109097090?v=4",
  },
];

const AttendanceTable = () => {
  const [students, setStudents] = useState(initialStudents);

  const handleAttendanceChange = (index, type) => {
    const updatedStudents = students.map((student, idx) => {
      if (idx === index) {
        return {
          ...student,
          present: type === "present" ? !student.present : false,
          absent: type === "absent" ? !student.absent : false,
          leave: type === "leave" ? !student.leave : false,
        };
      }
      return student;
    });
    setStudents(updatedStudents);
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white   rounded-lg">
        <thead>
          <tr className="py-2 bg-gray-50">
            <th className="py-2 border-b border-gray-300">SL</th>
            <th className="py-2 border-b border-gray-300">Student id</th>
            <th className="py-2 border-b border-gray-300">Name</th>
            <th className="py-2 border-b border-gray-300">Present</th>
            <th className="py-2 border-b border-gray-300">Absent</th>
            <th className="py-2 border-b border-gray-300">Leave</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className="text-center border-b">
              <td className="py-2 border-gray-300">{index + 1}</td>
              <td className="py-2 border-gray-300">{student.id}</td>
              <td className="py-2  border-gray-300 flex items-center justify-start ps-6">
                <img
                  src={student.photo}
                  alt=""
                  className="w-8 h-8 rounded-full mr-2"
                />
                {student.name}
              </td>
              <td className="py-2  border-gray-300">
                <button
                  onClick={() => handleAttendanceChange(index, "present")}
                  className="p-2 rounded"
                >
                  <FaCheckSquare
                    className={`text-green-500 ${
                      student.present ? "opacity-100" : "opacity-10"
                    }`}
                    size={20}
                  />
                </button>
              </td>
              <td className="py-2  ">
                <button
                  onClick={() => handleAttendanceChange(index, "absent")}
                  className="p-2 rounded"
                >
                  <FaSquareXmark
                    className={`text-red-500 ${
                      student.absent ? "opacity-100" : "opacity-10"
                    }`}
                    size={20}
                  />
                </button>
              </td>
              <td className="py-2 ">
                <button
                  onClick={() => handleAttendanceChange(index, "leave")}
                  className="p-2 rounded-full"
                >
                  <FaRegCircleDot
                    className={`text-green-500 ${
                      student.leave ? "opacity-100" : "opacity-10"
                    }`}
                    size={20}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
