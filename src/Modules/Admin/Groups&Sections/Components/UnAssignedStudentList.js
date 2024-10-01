import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../../../Components/Common/Sidebar";
import { PiPlusLight } from "react-icons/pi";
import { FaUserSlash } from "react-icons/fa";
import AssignStudent from "./AssignStudent";
import {
  fetchGroupsByClass,
  fetchUnassignedStudents,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";

const UnAssignedStudentList = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const { unassignedStudentsList, sectionsList } = useSelector(
    (store) => store.admin.group_section
  );
  const { cid } = useSelector((store) => store.common.auth);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredStudents = unassignedStudentsList.filter((student) =>
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSidebarOpen = (student) => {
    setSelectedStudent(student);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedStudent(null);
    dispatch(fetchUnassignedStudents(cid)); // Refetch unassigned students
    dispatch(fetchGroupsByClass(cid)); // Refetch groups after assignment
  };

  const getSectionName = (sectionId) => {
    const section = sectionsList.find((sec) => sec._id === sectionId);
    return section
      ? { name: section.sectionName, color: "text-gray-500" }
      : { name: "No Section Assigned", color: "text-red-500" };
  };

  return (
    <div className="w-80 p-4 bg-white">
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

      {/* Check if there are no students */}
      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
          <FaUserSlash className="text-2xl mb-4" />
          <p>No students found.</p>
        </div>
      ) : (
        <ul>
          {filteredStudents.map((student, index) => (
            <li
              key={index}
              className="flex items-center justify-between border-b py-2"
            >
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
      )}

      {selectedStudent && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          title="Assign Section"
        >
          <AssignStudent
            name={selectedStudent.firstName}
            section={getSectionName(selectedStudent?.presentSectionId).name}
            studentId={selectedStudent?._id}
            imageUrl={selectedStudent.profile}
            onAssignmentComplete={handleSidebarClose} // Automatically fetch groups and students after assignment
          />
        </Sidebar>
      )}
    </div>
  );
};

export default UnAssignedStudentList;
