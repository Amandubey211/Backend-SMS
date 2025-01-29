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
import StudentGradeModal from "../Subjects/Modules/Grades/StudentGradeViewModal/StudentGradeModal";
import {
  fetchStudentGrades,
  fetchStudentSubjectProgress,
} from "../../../Store/Slices/Admin/Users/Students/student.action";
import { clearGroupsList } from "../../../Store/Slices/Admin/Class/Section_Groups/groupSectionSlice";
import ProtectedSection from "../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../config/permission";
import ProtectedAction from "../../../Routes/ProtectedRoutes/ProtectedAction";

const MainSection = () => {
  const [activeSection, setActiveSection] = useState("Everyone");
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentData, setStudentData] = useState();
  const dispatch = useDispatch();
  const { cid } = useParams();

  // Reset groups on class change
  useEffect(() => {
    if (cid) {
      dispatch(clearGroupsList()); // Clear previous groups to avoid stale data
      dispatch(fetchSectionsByClass(cid)); // Fetch sections for the class
      dispatch(fetchGroupsByClass(cid)); // Fetch groups for the new class
      dispatch(fetchUnassignedStudents(cid)); // Fetch unassigned students
    }
  }, [cid, dispatch]);

  // Handle section change
  useEffect(() => {
    if (activeSection != "Everyone" && activeSectionId) {
      
      
      dispatch(
        fetchGroupsByClassAndSection({
          classId: cid,
          sectionId: activeSectionId,
        })
      );
    } else if (activeSection == "Everyone") {
      dispatch(fetchGroupsByClass(cid));
    }
  }, [activeSectionId, activeSection, cid, dispatch]);

  // Handle section change from navigation bar
  const handleSectionChange = useCallback((section, sectionId) => {
    setActiveSection(section);
    setActiveSectionId(sectionId);
   // dispatch(fetchGroupsByClassAndSection({ classId: cid, sectionId }));
  }, []);

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
      <ProtectedAction requiredPermission={PERMISSIONS.SECTION_BY_CLASS}>
      <NavigationBar
        onSectionChange={handleSectionChange}
        selectedSection={activeSection}
      />
      </ProtectedAction>
      <div className="flex flex-grow">
      <div className="w-80 h-full flex-shrink-0">
        <ProtectedSection requiredPermission={PERMISSIONS.UNASSIGNED_STUDENTS} title={"Unassigned Student"}>
     
          <UnAssignedStudentList />
        
        </ProtectedSection>
        </div>
        <div className="flex-grow h-full border-l">
        <ProtectedSection requiredPermission={PERMISSIONS.GROUP_BY_CLASS_SECTION} title={"Groups"}>
          <GroupList onSeeGradeClick={onSeeGradeClick} />
          </ProtectedSection>
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
