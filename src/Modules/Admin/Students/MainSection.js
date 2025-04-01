import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DetailedStudentList from "./Components/DetailedStudentList";
import NavigationBar from "./Components/NavigationBar";
import StudentGradeModal from "../Subjects/Modules/Grades/StudentGradeViewModal/StudentGradeModal";
import { useParams } from "react-router-dom";
import Spinner from "../../../Components/Common/Spinner";
import { FaUsers } from "react-icons/fa";
import { fetchStudentsByClassAndSection } from "../../../Store/Slices/Admin/Class/Students/studentThunks";
import {
  fetchStudentGrades,
  fetchStudentSubjectProgress,
} from "../../../Store/Slices/Admin/Users/Students/student.action";
import ProtectedSection from "../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../config/permission";

const MainSection = () => {
  const [activeSection, setActiveSection] = useState("Everyone");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentData, setStudentData] = useState();
  const { cid } = useParams();
  const dispatch = useDispatch();

  // Access students, loading, and error from Redux
  const {
    studentsList: students,
    loading,
    error,
  } = useSelector((state) => state.admin.students);

  const fetchStudents = useCallback(
    (section) => {
      dispatch(fetchStudentsByClassAndSection(cid));
    },
    [cid, dispatch]
  );

  useEffect(() => {
    fetchStudents(activeSection);
  }, [activeSection, fetchStudents]);
  const handleSeeGradeClick = (student) => {
    setStudentData(student);
    setIsModalOpen(true);
    //const params = {};
    // dispatch(
    //   fetchStudentGrades({
    //     params,
    //     studentId: student?._id,
    //     studentClassId: cid,
    //   })
    // );
    dispatch(fetchStudentSubjectProgress(student?._id));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-2 w-full">
      <ProtectedSection
        requiredPermission={PERMISSIONS.STUDENTS_BY_CLASS_AND_SECTION}
        title={"Student"}
      >
        <NavigationBar
          setActiveSection={setActiveSection}
          activeSection={activeSection}
          totalStudents={students?.length}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
            <FaUsers className="text-6xl mb-4" />
            <p className="italic">Error fetching students: {error}</p>
          </div>
        ) : (
          <DetailedStudentList
            activeSection={activeSection}
            onSeeGradeClick={handleSeeGradeClick}
            students={students}
          />
        )}
        <StudentGradeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          student={studentData}
        />
      </ProtectedSection>
    </div>
  );
};

export default MainSection;
