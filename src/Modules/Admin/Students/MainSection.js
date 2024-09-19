import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DetailedStudentList from "./Components/DetailedStudentList";
import NavigationBar from "./Components/NavigationBar";
import StudentGradeModal from "../Subjects/Modules/Grades/StudentGradeViewModal/StudentGradeModal";
import { useParams } from "react-router-dom";
import Spinner from "../../../Components/Common/Spinner";
import { FaUsers } from "react-icons/fa";
import { fetchStudentsByClassAndSection } from "../../../Store/Slices/Admin/Class/Students/studentThunks";

const MainSection = () => {
  const [activeSection, setActiveSection] = useState("Everyone");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    console.log("Student Data:", student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-2 w-full">
      <NavigationBar
        setActiveSection={setActiveSection}
        activeSection={activeSection}
        totalStudents={students.length}
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
      {/* <StudentGradeModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
    </div>
  );
};

export default MainSection;
