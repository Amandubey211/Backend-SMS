import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DetailedStudentList from "./Components/DetailedStudentList";
import NavigationBar from "./Components/NavigationBar";
import { setStudentGrade } from "../../../Redux/Slices/AdminSlice";
import StudentGradeModal from "../Subjects/Modules/Grades/StudentGradeViewModal/StudentGradeModal";

const MainSection = () => {
  const [activeSection, setActiveSection] = useState("Everyone");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const studentGrade = useSelector((store) => store.Admin.studentGrade);
  const dispatch = useDispatch();

  const handleSeeGradeClick = (student) => {
    dispatch(setStudentGrade(student));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(setStudentGrade({}));
  };

  return (
    <div className="p-2 w-full ">
      <NavigationBar
        setActiveSection={setActiveSection}
        activeSection={activeSection}
      />
      <DetailedStudentList
        activeSection={activeSection}
        onSeeGradeClick={handleSeeGradeClick}
      />
      <StudentGradeModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default MainSection;
