import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchSectionsByClass,
  fetchGroupsByClassAndSection,
  fetchUnassignedStudents,
  fetchGroupsByClass,
} from "../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import NavigationBar from "./Components/NavigationBar";
import UnAssignedStudentList from "./Components/UnAssignedStudentList";
import GroupList from "./Components/GroupList";
import Spinner from "../../../Components/Common/Spinner";
import { FaUsers } from "react-icons/fa";
import StudentGradeModal from "../Subjects/Modules/Grades/StudentGradeViewModal/StudentGradeModal";
import {
  fetchStudentGrades,
  fetchStudentSubjectProgress,
} from "../../../Store/Slices/Admin/Users/Students/student.action";

const MainSection = () => {
  const [activeSection, setActiveSection] = useState("Everyone");
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentData, setStudentData] = useState();
  const dispatch = useDispatch();
  const { cid } = useParams();

  // Centralized state from the Redux store for sections, groups, and unassigned students
  const { loading, error, unassignedStudentsList } = useSelector(
    (store) => store.admin.group_section
  );

  // Fetch groups by class or section
  const fetchGroups = useCallback(() => {
    if (cid) {
      if (activeSection === "Everyone") {
        dispatch(fetchGroupsByClass(cid));
      } else {
        dispatch(
          fetchGroupsByClassAndSection({
            classId: cid,
            sectionId: activeSectionId,
          })
        );
      }
    }
  }, [cid, activeSection, activeSectionId, dispatch]);

  // Fetch unassigned students
  const fetchStudents = useCallback(() => {
    if (cid) {
      dispatch(fetchUnassignedStudents(cid));
    }
  }, [cid, dispatch]);

  useEffect(() => {
    if (cid) {
      dispatch(fetchSectionsByClass(cid));
      fetchGroups();
      fetchStudents();
    }
  }, [cid, dispatch, fetchGroups, fetchStudents]);

  // Handle section change and fetch corresponding groups
  const handleSectionChange = useCallback(
    (section, sectionId) => {
      setActiveSection(section);
      setActiveSectionId(sectionId);
      fetchGroups();
    },
    [fetchGroups]
  );

  const onSeeGradeClick = (student) => {
    setStudentData(student);
    setIsModalOpen(true);
    const params = {};
    dispatch(
      fetchStudentGrades({
        params,
        studentId: student?._id,
        studentClassId: cid,
      })
    );
    dispatch(fetchStudentSubjectProgress(student?._id));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <NavigationBar
        onSectionChange={handleSectionChange}
        selectedSection={activeSection}
      />
      <div className="flex flex-grow">
        <div className="w-80 h-full flex-shrink-0">
          <UnAssignedStudentList />
        </div>
        <div className="flex-grow h-full border-l">
          <GroupList onSeeGradeClick={onSeeGradeClick} />
        </div>
        <StudentGradeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          student={studentData}
        />
      </div>
    </div>
  );
};

export default MainSection;
