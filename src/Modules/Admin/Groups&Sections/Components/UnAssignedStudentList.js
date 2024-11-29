import React, { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../../../Components/Common/Sidebar";
import { PiPlusLight, PiStudentThin } from "react-icons/pi";
import AssignStudent from "./AssignStudent";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";
import { useTranslation } from "react-i18next";

const UnAssignedStudentList = () => {
  const { t } = useTranslation("admClass");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { unassignedStudentsList, sectionsList } = useSelector(
    (store) => store.admin.group_section
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredStudents = unassignedStudentsList?.filter((student) =>
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
    const section = sectionsList.find((sec) => sec._id === sectionId);
    return section
      ? { name: section.sectionName, color: "text-gray-500" }
      : { name: t("No Section Assigned"), color: "text-red-500" };
  };

  return (
    <div className="w-80 p-4 bg-white">
      <div className="mb-4">
        <h2 className="text-md font-semibold">
          {t("Unassigned Students")}{" "}
          <span className="text-gray-500">({filteredStudents.length})</span>
        </h2>
        <input
          type="text"
          placeholder={t("Search Student")}
          value={searchQuery}
          onChange={handleSearch}
          className="mt-2 w-full px-3 py-2 border rounded-full"
        />
      </div>

      {/* Check if there are no students */}
      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
          <PiStudentThin className="text-5xl mb-2" />
          <p>{t("No students found.")}</p>
        </div>
      ) : (
        <ul>
          {filteredStudents?.map((student, index) => (
            <li
              key={index}
              className="flex items-center justify-between border-b py-2"
            >
              <div className="flex items-center">
                <img
                  src={student.profile || profileIcon}
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
          title={t("Assign Section")}
        >
          <AssignStudent
            name={selectedStudent.firstName}
            section={getSectionName(selectedStudent?.presentSectionId).name}
            studentId={selectedStudent?._id}
            imageUrl={selectedStudent.profile}
          />
        </Sidebar>
      )}
    </div>
  );
};

export default UnAssignedStudentList;
