import React, { useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PiPlusLight } from "react-icons/pi";
import Sidebar from "../../../../Components/Common/Sidebar";
import AssignStudent from "./AssignStudent";
import { useSelector } from "react-redux";

const UnAssignedStudentList = ({
  fetchGroups,
  fetchStudents,
  unassignedStudents,
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { cid } = useParams();
  const sections = useSelector((state) => state.Class.sectionsList);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredStudents = unassignedStudents.filter((student) =>
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSidebarOpen = (student) => {
    setSelectedStudent(student);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedStudent(null);
  };

  const getSectionName = (sectionId) => {
    const section = sections.find((sec) => sec._id === sectionId);
    return section
      ? { name: section.sectionName, color: "text-gray-500" }
      : { name: "No Section Assigned", color: "text-red-500" };
  };

  return (
    <div className="w-80 p-4 bg-white ">
      <div className="mb-4">
        <h2 className="text-md font-semibold">
          Unassigned Students{" "}
          <span className="text-gray-500">({filteredStudents.length})</span>
        </h2>
        <input
          type="text"
          placeholder="Search Student"
          value={searchQuery}
          onChange={handleSearch}
          className="mt-2 w-full px-3 py-2 border rounded-full"
        />
      </div>
      <ul>
        {filteredStudents.map((student, index) => (
          <li key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <img
                src={
                  student.profile ||
                  `https://randomuser.me/api/portraits/med/${
                    index % 2 === 0 ? "women" : "men"
                  }/${index}.jpg`
                }
                alt={student.firstName}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="text-sm font-medium">{student.firstName}</div>
                <div
                  className={`text-xs ${
                    getSectionName(student?.presentSectionId).color
                  }`}
                >
                  {getSectionName(student?.presentSectionId).name}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleSidebarOpen(student)}
              className="text-center rounded-full border font-semibold text-xl p-1"
            >
              <PiPlusLight className="text-green-600" />
            </button>
          </li>
        ))}
      </ul>
      {selectedStudent && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          title="Assign Group"
        >
          <AssignStudent
            name={selectedStudent.firstName}
            section={getSectionName(selectedStudent?.presentSectionId).name}
            studentId={selectedStudent?._id}
            imageUrl={
              selectedStudent.profile ||
              "https://avatars.githubusercontent.com/u/109097090?v=4"
            }
            onAssignmentComplete={() => {
              fetchStudents();
              fetchGroups();
            }}
          />
        </Sidebar>
      )}
    </div>
  );
};

export default UnAssignedStudentList;
