import React, { useState, useCallback } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { VscSettings } from "react-icons/vsc";
import { FaUserCircle } from "react-icons/fa"; // Import the default user icon
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import { useTranslation } from "react-i18next";

function StudentList({ onSelectStudent, students, selectedStudentId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation("admModule"); // Adding the translation function with namespace 'studentList'

  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentClick = useCallback(
    (student) => {
      onSelectStudent(student);
    },
    [onSelectStudent]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder={t("Search Student")} // Translated placeholder text
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IoSearchOutline className="absolute left-3 top-2/4 transform -translate-y-2/4 h-5 w-5 text-gray-400" />
          <VscSettings className="absolute right-3 top-2/4 transform -translate-y-2/4 h-5 w-5 text-gray-400 cursor-pointer" />
        </div>
      </div>
      <div className="flex gap-4 items-center mb-4">
        <h2 className="text-md font-semibold">{t("All Students")}</h2>{" "}
        {/* Translated heading */}
        <span className="text-sm bg-purple-100 text-purple-600 rounded-full px-2 py-1">
          {students?.length}
        </span>
      </div>
      {!filteredStudents?.length && <NoDataFound title={t("Students")} />}{" "}
      {/* Translated title */}
      <div className="flex-grow overflow-y-auto space-y-2">
        {filteredStudents?.map((student) => (
          <div
            key={student._id}
            className={`flex items-center p-2 cursor-pointer rounded-full ${
              student._id === selectedStudentId
                ? "bg-gradient-to-r from-purple-100 to-pink-100"
                : ""
            }`}
            onClick={() => handleStudentClick(student)}
            role="button"
            aria-selected={student._id === selectedStudentId}
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleStudentClick(student);
              }
            }}
          >
            <div className="w-8 h-8 rounded-full mr-3 flex items-center justify-center bg-gray-200">
              {student.profile ? (
                <img
                  src={student.profile}
                  alt={student.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-gray-400" size={24} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`text-sm font-medium capitalize ${
                  student._id === selectedStudentId
                    ? "text-purple-600"
                    : "text-gray-900"
                } truncate`}
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {student.fullName}
              </h3>
              <p className="text-sm text-green-500">
                {student?.presentSectionId?.sectionName || t("N/A")}{" "}
                {/* Translated "N/A" */}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentList;
