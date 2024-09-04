import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import DetailedStudentList from "./Components/DetailedStudentList";
import NavigationBar from "./Components/NavigationBar";
import { setStudentGrade } from "../../../Redux/Slices/AdminSlice";
import StudentGradeModal from "../Subjects/Modules/Grades/StudentGradeViewModal/StudentGradeModal";
import { useParams } from "react-router-dom";
import useGetStudentsByClassAndSection from "../../../Hooks/AuthHooks/Staff/Admin/Students/useGetStudentsByClassAndSection";
import Spinner from "../../../Components/Common/Spinner";
import { FaUsers } from "react-icons/fa";

const MainSection = () => {
  const [activeSection, setActiveSection] = useState("Everyone");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const dispatch = useDispatch();
  const { fetchStudentsByClassAndSection, loading, error } =
    useGetStudentsByClassAndSection();
  const { cid } = useParams();

  // Optimized useCallback to fetch students and filter by section
  const fetchStudents = useCallback(
    async (section) => {
      const data = await fetchStudentsByClassAndSection(cid);
      setStudents(
        section === "Everyone"
          ? data
          : data.filter((student) => student.sectionName === section)
      );
    },
    [cid, fetchStudentsByClassAndSection]
  );

  useEffect(() => {
    fetchStudents(activeSection);
  }, [activeSection, fetchStudents]);

  const handleSeeGradeClick = (student) => {
    console.log('---------',student);
    
    dispatch(setStudentGrade(student));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(setStudentGrade({}));
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
          <p className="italic">Error fetching students: {error.message}</p>
        </div>
      ) : (
        <DetailedStudentList
          activeSection={activeSection}
          onSeeGradeClick={handleSeeGradeClick}
          students={students}
        />
      )}
      <StudentGradeModal  isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default MainSection;
