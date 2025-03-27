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
import { motion } from "framer-motion";
import { fetchStudentsByClassAndSection } from "../../../Store/Slices/Admin/Class/Students/studentThunks";
import SectionStudentList from "./Components/SectionStudentList"; // <-- New import
import { Tabs } from "antd";

const MainSection = () => {
  const dispatch = useDispatch();
  const { cid } = useParams();

  // Section states
  const [activeSection, setActiveSection] = useState("Everyone");
  const [activeSectionId, setActiveSectionId] = useState(null);

  // Tabs: "groups" or "section"
  const [activeTab, setActiveTab] = useState("groups");

  // Grade modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentData, setStudentData] = useState(null);

  // Redux store
  const { unassignedStudentsList } = useSelector(
    (state) => state.admin.group_section
  );

  // Initial data load
  useEffect(() => {
    if (cid) {
      dispatch(clearGroupsList()); // Clear previous groups
      dispatch(fetchSectionsByClass(cid)); // Fetch sections
      dispatch(fetchGroupsByClass(cid)); // Fetch all groups
      dispatch(fetchUnassignedStudents(cid)); // Fetch unassigned
      dispatch(fetchStudentsByClassAndSection(cid)); // Get entire class's students
    }
  }, [cid, dispatch]);

  // Whenever activeSection changes, fetch groups by that section.
  // If "Everyone," fetch all groups in that class.
  useEffect(() => {
    if (activeSection !== "Everyone" && activeSectionId) {
      dispatch(
        fetchGroupsByClassAndSection({
          classId: cid,
          sectionId: activeSectionId,
        })
      );
    } else if (activeSection === "Everyone") {
      dispatch(fetchGroupsByClass(cid));
    }
  }, [activeSection, activeSectionId, cid, dispatch]);

  // Handle section selection from the NavigationBar
  const handleSectionChange = useCallback(
    (section, sectionId) => {
      setActiveSection(section);
      setActiveSectionId(sectionId);
      if (sectionId) {
        dispatch(
          fetchGroupsByClassAndSection({
            classId: cid,
            sectionId,
          })
        );
      } else {
        // "Everyone"
        dispatch(fetchGroupsByClass(cid));
      }
    },
    [cid, dispatch]
  );

  // On "See Grade" click for any student
  const onSeeGradeClick = (student) => {
    setStudentData(student);
    setIsModalOpen(true);

    // Fetch the student's data
    dispatch(
      fetchStudentGrades({
        params: {},
        studentId: student?._id,
        studentClassId: cid,
      })
    );
    dispatch(fetchStudentSubjectProgress(student?._id));
  };

  // Close grade modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStudentData(null);
  };

  // Ant Design Tabs content
  const tabItems = [
    {
      key: "groups",
      label: "Groups",
      children: <GroupList onSeeGradeClick={onSeeGradeClick} />,
    },
    {
      key: "section",
      label: "Section Students",
      children: (
        <SectionStudentList
          onSeeGradeClick={onSeeGradeClick}
          activeSectionId={activeSectionId}
          activeSection={activeSection}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Navigation to pick sections */}
      <ProtectedAction requiredPermission={PERMISSIONS.SECTION_BY_CLASS}>
        <NavigationBar
          onSectionChange={handleSectionChange}
          selectedSection={activeSection}
        />
      </ProtectedAction>

      <div className="flex flex-grow">
        {/* Hide Unassigned Student panel if no unassigned students */}
        {unassignedStudentsList?.length > 0 && (
          <div className="w-80 h-full flex-shrink-0">
            <ProtectedSection
              requiredPermission={PERMISSIONS.UNASSIGNED_STUDENTS}
              title={"Unassigned Student"}
            >
              <UnAssignedStudentList />
            </ProtectedSection>
          </div>
        )}

        {/* Main Content: Tabs (Groups / Section Students) */}
        <div className="flex-grow h-full border-l p-4">
          <ProtectedSection
            requiredPermission={PERMISSIONS.GROUP_BY_CLASS_SECTION}
            title="Sections / Groups"
          >
            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
              animated
            >
              {tabItems.map((item) => (
                <Tabs.TabPane key={item.key} tab={item.label}>
                  {item.children}
                </Tabs.TabPane>
              ))}
            </Tabs>
          </ProtectedSection>
        </div>
      </div>

      {/* Grade Modal */}
      <StudentGradeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        student={studentData}
      />
    </div>
  );
};

export default MainSection;
