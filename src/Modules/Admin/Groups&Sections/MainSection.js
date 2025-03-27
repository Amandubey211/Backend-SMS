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
import { fetchStudentsByClassAndSection } from "../../../Store/Slices/Admin/Class/Students/studentThunks";
import SectionStudentList from "./Components/SectionStudentList";
import { Tabs } from "antd";
import Fuse from "fuse.js";

const MainSection = () => {
  const dispatch = useDispatch();
  const { cid } = useParams();

  // State for which section is active
  const [activeSection, setActiveSection] = useState("Everyone");
  const [activeSectionId, setActiveSectionId] = useState(null);

  // State for active tab: "section" or "groups"
  const [activeTab, setActiveTab] = useState("section");

  // Grade modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentData, setStudentData] = useState(null);

  // Global fuzzy search
  const [searchQuery, setSearchQuery] = useState("");

  // Redux store data
  const { groupsList, groupsLoading, unassignedStudentsList } = useSelector(
    (state) => state.admin.group_section
  );
  const {
    studentsList,
    loading: studentsLoading,
    error: studentsError,
  } = useSelector((state) => state.admin.students);

  // ------------------- Data Fetching -------------------
  useEffect(() => {
    if (cid) {
      dispatch(clearGroupsList());
      dispatch(fetchSectionsByClass(cid));
      dispatch(fetchGroupsByClass(cid));
      dispatch(fetchUnassignedStudents(cid));
      dispatch(fetchStudentsByClassAndSection(cid));
    }
  }, [cid, dispatch]);

  // If user selects a specific section, fetch only that section's groups
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

  // NavigationBar callback for picking a section
  const handleSectionChange = useCallback(
    (sectionName, sectionId) => {
      setActiveSection(sectionName);
      setActiveSectionId(sectionId);

      if (sectionId) {
        dispatch(
          fetchGroupsByClassAndSection({
            classId: cid,
            sectionId,
          })
        );
      } else {
        dispatch(fetchGroupsByClass(cid));
      }
    },
    [cid, dispatch]
  );

  // "See Grade" for a student
  const onSeeGradeClick = (student) => {
    setStudentData(student);
    setIsModalOpen(true);

    // fetch student grades & progress
    dispatch(
      fetchStudentGrades({
        params: {},
        studentId: student?._id,
        studentClassId: cid,
      })
    );
    dispatch(fetchStudentSubjectProgress(student?._id));
  };

  // Grade modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStudentData(null);
  };

  // ------------------ Fuzzy Search Setup ------------------
  // 1) Fuzzy search for Groups
  const fuseGroups = new Fuse(groupsList || [], {
    keys: ["groupName"],
    threshold: 0.3,
  });
  const filteredGroups = searchQuery
    ? fuseGroups.search(searchQuery).map((res) => res.item)
    : groupsList || [];

  // 2) Fuzzy search for Students (filter by activeSection first)
  let relevantStudents = studentsList || [];
  if (activeSection !== "Everyone" && activeSectionId) {
    relevantStudents = relevantStudents.filter(
      (s) => s.presentSectionId === activeSectionId
    );
  }
  const fuseStudents = new Fuse(relevantStudents, {
    keys: ["firstName", "lastName", "email", "contactNumber", "rollNumber"],
    threshold: 0.3,
  });
  const filteredStudents = searchQuery
    ? fuseStudents.search(searchQuery).map((res) => res.item)
    : relevantStudents;

  // Tab labels: show counts
  const groupCount = filteredGroups?.length || 0;
  const studentCount = filteredStudents?.length || 0;

  // Tabs data
  const tabItems = [
    {
      key: "section",
      label: `Section (${studentCount})`,
      children: (
        <SectionStudentList
          onSeeGradeClick={onSeeGradeClick}
          activeSectionId={activeSectionId}
          activeSection={activeSection}
          students={filteredStudents}
          loading={studentsLoading}
          error={studentsError}
        />
      ),
    },
    {
      key: "groups",
      label: `Groups (${groupCount})`,
      children: (
        <GroupList
          onSeeGradeClick={onSeeGradeClick}
          groups={filteredGroups}
          groupsLoading={groupsLoading}
        />
      ),
    },
  ];

  // ------------------ Render Layout ------------------
  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation + Section Buttons */}
      <ProtectedAction requiredPermission={PERMISSIONS.SECTION_BY_CLASS}>
        <NavigationBar
          onSectionChange={handleSectionChange}
          selectedSection={activeSection}
        />
      </ProtectedAction>

      <div className="flex flex-grow">
        {/* Left: Unassigned Students */}
        {unassignedStudentsList?.length > 0 && (
          <div className="w-80 h-full flex-shrink-0">
            <ProtectedSection
              requiredPermission={PERMISSIONS.UNASSIGNED_STUDENTS}
              title="Unassigned Student"
            >
              <UnAssignedStudentList />
            </ProtectedSection>
          </div>
        )}

        {/* Right: Tabs + Search bar */}
        <div className="flex-grow h-full border-l p-4 flex flex-col">
          {/* Protected area for the main content */}
          <ProtectedSection
            requiredPermission={PERMISSIONS.GROUP_BY_CLASS_SECTION}
            title="Sections & Groups"
          >
            {/* Tabs with search on the right */}
            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
              // This extra content puts the search bar on the right edge
              tabBarExtraContent={
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md w-64"
                />
              }
            >
              {tabItems.map((tab) => (
                <Tabs.TabPane key={tab.key} tab={tab.label}>
                  {/* 
                    Each tab's content is automatically rendered below the tab bar,
                    taking up the full space. 
                  */}
                  {tab.children}
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
