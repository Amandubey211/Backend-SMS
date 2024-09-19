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

const MainSection = () => {
  const [activeSection, setActiveSection] = useState("Everyone");
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { cid } = useParams();

  // Centralized state from the Redux store for sections, groups, and unassigned students
  const { sectionsList, groupsList, loading, error, unassignedStudentsList } =
    useSelector((store) => store.admin.group_section);

  // Fetch groups by class or section
  const fetchGroups = useCallback(async () => {
    if (cid) {
      if (activeSection === "Everyone") {
        await dispatch(fetchGroupsByClass(cid));
      } else {
        await dispatch(
          fetchGroupsByClassAndSection({
            classId: cid,
            sectionId: activeSectionId,
          })
        );
      }
    }
  }, [cid, activeSection, activeSectionId, dispatch]);

  // Fetch unassigned students
  const fetchStudents = useCallback(async () => {
    if (cid) {
      try {
        await dispatch(fetchUnassignedStudents(cid));
      } catch (error) {
        console.error("Failed to load students");
      }
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
    console.log("Student grade clicked", student);
  };

  return (
    <div className="flex flex-col h-screen">
      <NavigationBar
        onSectionChange={handleSectionChange}
        selectedSection={activeSection}
      />
      <div className="flex flex-grow">
        <div className="w-80 h-full flex-shrink-0">
          <UnAssignedStudentList
            unassignedStudents={unassignedStudentsList}
            fetchGroups={fetchGroups}
            fetchStudents={fetchStudents}
          />
        </div>
        <div className="flex-grow h-full border-l">
          {loading ? (
            <Spinner />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <FaUsers className="text-6xl mb-4" />
              <p>No groups found.</p>
            </div>
          ) : (
            <GroupList
              onSeeGradeClick={onSeeGradeClick}
              groupList={groupsList}
              selectedSection={activeSection}
              fetchGroups={fetchGroups}
              fetchStudents={fetchStudents}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainSection;
