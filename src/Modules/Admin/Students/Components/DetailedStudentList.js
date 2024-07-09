import React from "react";
import SidebarMenu from "./SidebarMenu";

const DetailedStudentList = ({ activeSection, onSeeGradeClick, students }) => {
  const filteredStudents =
    activeSection === "Everyone"
      ? students
      : students.filter((student) => student.section === activeSection);

  return (
    <div className="w-full p-4 bg-white">
      <ul>
        {filteredStudents.length === 0 ? (
          <li className="p-4 text-center text-gray-500 italic">
            No students found in this section.
          </li>
        ) : (
          filteredStudents.map((student, index) => (
            <li
              key={index}
              className="relative flex items-center justify-between py-4 border-b"
            >
              <StudentInfo
                student={student}
                index={index}
                onSeeGradeClick={onSeeGradeClick}
              />
              <SidebarMenu
                studentId={student._id}
                onSeeGradeClick={onSeeGradeClick}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

const StudentInfo = React.memo(({ student, index, onSeeGradeClick }) => (
  <>
    <div className="flex items-center">
      <img
        src={student.profile || `https://randomuser.me/api/portraits/med/${
          index % 2 === 0 ? "women" : "men"
        }/${index}.jpg`}
        alt={student.name}
        className="w-10 h-10 rounded-full mr-3"
      />
      <div>
        <div className="text-sm font-medium">
          {student?.firstName} {student?.lastName}
        </div>
        <div className="text-xs text-gray-500">{student?._id}</div>
      </div>
    </div>
    <StudentDetails student={student} />
    <button
      className="px-3 py-1 text-green-500 font-semibold text-sm border border-green-500 rounded-lg"
      onClick={() => onSeeGradeClick(student)}
    >
      See Grade
    </button>
  </>
));

const StudentDetails = React.memo(({ student }) => (
  <>
    <div className="flex flex-col gap-1 items-start justify-start">
      <div className="text-sm text-gray-500">Class</div>
      <div className="text-sm text-gray-500">{student?.className || "09"}</div>
    </div>
    <div className="flex flex-col gap-1 items-start justify-center">
      <div className="text-sm text-gray-500">
        {student?.section || "Section"}
      </div>
      <div className="text-sm text-gray-500">{`Group-${
        student?.group || "Accounting"
      }`}</div>
    </div>
    <div className="flex flex-col text-sm gap-1 items-start justify-start">
      <div>{student.email}</div>
      <div>{student.contactNumber}</div>
    </div>
    <div className="flex flex-col text-sm gap-1 items-start justify-start">
      <div>Parent</div>
      <div>{student.guardianContactNumber}</div>
    </div>
  </>
));

export default DetailedStudentList;
