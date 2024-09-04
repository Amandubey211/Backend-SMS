import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setStudentGrade } from "../../../Redux/Slices/AdminSlice";
import useFetchSection from "../../../Hooks/AuthHooks/Staff/Admin/Sections/useFetchSection";
import useGetGroupsByClass from "../../../Hooks/AuthHooks/Staff/Admin/Groups/useGetGroupByClass";
import useGetGroupsByClassAndSection from "../../../Hooks/AuthHooks/Staff/Admin/Groups/useGetGroupsByClassAndSection";
import useGetUnassignedStudents from "../../../Hooks/AuthHooks/Staff/Admin/Students/useGetUnassignedStudents";
import NavigationBar from "./Components/NavigationBar";
import UnAssignedStudentList from "./Components/UnAssignedStudentList";
import GroupList from "./Components/GroupList";
import StudentGradeModal from "../Subjects/Modules/Grades/StudentGradeViewModal/StudentGradeModal";
import Spinner from "../../../Components/Common/Spinner";

const MainSection = () => {
  const [activeSection, setActiveSection] = useState("Everyone");
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const groupList = useSelector((store) => store.Class.groupsList);
  const dispatch = useDispatch();
  const { cid } = useParams();

  const { fetchSection } = useFetchSection();
  const {
    fetchGroupsByClass,
    loading: loadingByClass,
    error: errorByClass,
  } = useGetGroupsByClass();
  const {
    fetchGroupsByClassAndSection,
    loading: loadingBySection,
    error: errorBySection,
  } = useGetGroupsByClassAndSection();
  const { fetchUnassignedStudents } = useGetUnassignedStudents();

  const fetchGroups = useCallback(async () => {
    if (cid) {
      if (activeSection === "Everyone") {
        await fetchGroupsByClass(cid);
      } else {
        await fetchGroupsByClassAndSection(cid, activeSectionId);
      }
    }
  }, [
    cid,
    activeSection,
    activeSectionId,
    fetchGroupsByClass,
    fetchGroupsByClassAndSection,
  ]);

  const fetchStudents = useCallback(async () => {
    try {
      const data = await fetchUnassignedStudents(cid);
      setUnassignedStudents(data);
    } catch (error) {
      console.error("Failed to load students");
    }
  }, [cid, fetchUnassignedStudents]);

  useEffect(() => {
    const fetchData = async () => {
      if (cid) {
        await fetchSection(cid);
        await fetchGroups();
        await fetchStudents();
      }
    };
    fetchData();
  }, [cid, fetchSection, fetchGroups, fetchStudents]);

  const handleSectionChange = useCallback(
    (section, sectionId) => {
      setActiveSection(section);
      setActiveSectionId(sectionId);
      fetchGroups(); // Optimized, ensures no duplicate calls
    },
    [fetchGroups]
  );

  const handleSeeGradeClick = (student) => {
    dispatch(setStudentGrade(student));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(setStudentGrade({}));
  };

  const errorMessage = errorByClass || errorBySection;

  return (
    <div className="flex flex-col h-screen">
      <NavigationBar
        onSectionChange={handleSectionChange}
        selectedSection={activeSection}
        fetchSections={fetchSection}
        fetchGroups={fetchGroups}
      />
      <div className="flex flex-grow">
        <div className="w-80 h-full flex-shrink-0">
          <UnAssignedStudentList
            fetchGroups={fetchGroups}
            fetchStudents={fetchStudents}
            unassignedStudents={unassignedStudents}
          />
        </div>
        <div className="flex-grow h-full border-l">
          {loadingByClass || loadingBySection ? (
            <Spinner />
          ) : errorMessage ? (
            <div className="flex justify-center items-center h-full text-red-600">
              {errorMessage}
            </div>
          ) : (
            <GroupList
              selectedSection={activeSection}
              onSeeGradeClick={handleSeeGradeClick}
              groupList={groupList}
              fetchGroups={fetchGroups}
              fetchStudents={fetchStudents}
            />
          )}
        </div>
      </div>
      <StudentGradeModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default MainSection;
