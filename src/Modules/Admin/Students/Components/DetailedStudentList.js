import React from "react";
import { FaUsers } from "react-icons/fa";
import StudentMenuOptions from "./StudentMenuOptions";

const DetailedStudentList = ({ activeSection, onSeeGradeClick, students }) => {
  const filteredStudents =
    activeSection === "Everyone"
      ? students
      : students.filter((student) => student.sectionName === activeSection);

  return (
    <div className="w-full p-4 bg-white">
      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
          <FaUsers className="text-6xl mb-4" />
          <p>No students found in this section.</p>
        </div>
      ) : (
        <ul>
          {filteredStudents.map((student, index) => (
            <li
              key={student._id}
              className="relative flex items-center justify-between py-4 border-b"
            >
              <StudentInfo
                student={student}
                index={index}
                onSeeGradeClick={onSeeGradeClick}
              />
              <StudentMenuOptions
                studentName={`${student?.firstName} ${student?.lastName}`}
                studentId={student._id}
                onSeeGradeClick={onSeeGradeClick}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const StudentInfo = React.memo(({ student, index, onSeeGradeClick }) => (
  <>
    <div className="flex items-center w-1/4">
      <img
        src={
          student.profile ||
          `https://randomuser.me/api/portraits/med/${
            index % 2 === 0 ? "women" : "men"
          }/${index}.jpg`
        }
        alt={student.name}
        className="w-10 h-10 rounded-full mr-3"
        loading="lazy"
      />
      <div className="flex flex-col truncate">
        <div className="text-sm font-medium truncate">
          {student?.firstName} {student?.lastName}
        </div>
        <div className="text-xs text-gray-500 truncate">
          {student?.admissionNumber || index}
        </div>
      </div>
    </div>
    <StudentDetails student={student} />
    <div className="flex items-center w-1/6">
      <button
        className="px-3 py-1 text-green-500 font-semibold text-sm border border-green-500 rounded-lg"
        onClick={() => onSeeGradeClick(student)}
        aria-label={`See Grade for ${student?.firstName} ${student?.lastName}`}
      >
        See Grade
      </button>
    </div>
  </>
));

const StudentDetails = React.memo(({ student }) => (
  <>
    <div className="flex flex-col gap-1 items-start justify-start w-1/5 ml-5 truncate">
      <div className="text-sm text-gray-500">Class</div>
      <div className="text-sm text-gray-500 truncate">
        {student?.className || "09"}
      </div>
    </div>
    <div className="flex flex-col gap-1 items-start justify-center w-1/5 truncate">
      <div className="text-sm text-gray-500 truncate">
        {student?.sectionName || "Section"}
      </div>
      <div className="text-sm text-gray-500 truncate">{`Group-${
        student?.group || "Accounting"
      }`}</div>
    </div>
    <div className="flex flex-col text-sm gap-1 items-start justify-start w-1/4 truncate">
      <div className="truncate">{student.email}</div>
      <div className="truncate">{student.contactNumber}</div>
    </div>
    <div className="flex flex-col text-sm gap-1 items-start justify-start w-1/4 truncate">
      <div>Parent</div>
      <div className="truncate">{student.guardianContactNumber}</div>
    </div>
  </>
));

export default DetailedStudentList;
