import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import DetailedStudentList from "./Components/DetailedStudentList";
import NavigationBar from "./Components/NavigationBar";
import { setStudentGrade } from "../../../Redux/Slices/AdminSlice";
import StudentGradeModal from "../Subjects/Modules/Grades/StudentGradeViewModal/StudentGradeModal";
import { useParams } from "react-router-dom";
import useGetStudentsByClassAndSection from "../../../Hooks/AuthHooks/Staff/Admin/Students/useGetStudentsByClassAndSection";

const MainSection = () => {
  const [activeSection, setActiveSection] = useState("Everyone");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const dispatch = useDispatch();
  const { fetchStudentsByClassAndSection } = useGetStudentsByClassAndSection();
  const { cid } = useParams();

  const fetchStudents = useCallback(async (section) => {
    const data = await fetchStudentsByClassAndSection(cid);
    const filteredStudents = section === "Everyone"
      ? data
      : data.filter((student) => student.section === section);
    setStudents(filteredStudents);
  }, [cid, fetchStudentsByClassAndSection]);

  useEffect(() => {
    fetchStudents(activeSection);
  }, [activeSection, fetchStudents]);

  const handleSeeGradeClick = (student) => {
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
      <DetailedStudentList
        activeSection={activeSection}
        onSeeGradeClick={handleSeeGradeClick}
        students={students}
      />
      <StudentGradeModal isOpen={isModalOpen} onClose={handleCloseModal}  />
    </div>
  );
};

export default MainSection;
