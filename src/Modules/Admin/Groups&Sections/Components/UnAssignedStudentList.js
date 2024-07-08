import React, { useEffect } from "react";
import useGetUnassignedStudents from "../../../../Hooks/AuthHooks/Staff/Admin/Students/useGetUnassignedStudents";
import { useParams } from "react-router-dom";

const students = [
  { name: "Annette Black", section: "Section A" },
  { name: "Guy Hawkins", section: "Section A" },
  { name: "Esther Howard", section: "Section A" },
  { name: "Albert Flores", section: "Section A" },
  { name: "Marvin McKinney", section: "Section A" },
  { name: "Jane Cooper", section: "Section A" },
  { name: "Ralph Edwards", section: "Section A" },
  { name: "Ronald Richards", section: "Section A" },
  { name: "Darrell Steward", section: "Section A" },
  { name: "Eleanor Pena", section: "Section A" },
];

const UnAssignedStudentList = () => {
  const { fetchUnassignedStudents } = useGetUnassignedStudents();
  const { cid } = useParams();
  // useEffect(() => {
  //   fetchUnassignedStudents(cid);
  // }, []);
  return (
    <div className="w-80 p-4 bg-white rounded-lg shadow-sm border">
      <div className="mb-4">
        <h2 className="text-md font-semibold">
          Unassigned Students <span className="text-gray-500">(50)</span>
        </h2>
        <input
          type="text"
          placeholder="Search Student"
          className="mt-2 w-full px-3 py-2 border rounded-full"
        />
      </div>
      <ul>
        {students.map((student, index) => (
          <li key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <img
                src={`https://randomuser.me/api/portraits/med/${
                  index % 2 === 0 ? "women" : "men"
                }/${index}.jpg`}
                alt={student.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="text-sm font-medium">{student.name}</div>
                <div className="text-xs text-gray-500">{student.section}</div>
              </div>
            </div>
            <button className="text-green-500 font-semibold text-xl">+</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnAssignedStudentList;
