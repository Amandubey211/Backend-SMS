import React, { useEffect, useState } from "react";
import NavigationBar from "./Components/NavigationBar";
import UnAssignedStudentList from "./Components/UnAssignedStudentList";
import GroupList from "./Components/GroupList";
import useFetchSection from "../../../Hooks/AuthHooks/Staff/Admin/Sections/useFetchSection";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStudentGrade } from "../../../Redux/Slices/AdminSlice";
import StudentGradeModal from "../Subjects/Modules/Grades/StudentGradeViewModal/StudentGradeModal";
import useGetGroupsByClass from "../../../Hooks/AuthHooks/Staff/Admin/Groups/useGetGroupByClass";
import Spinner from "../../../Components/Common/Spinner";
import useGetUnassignedStudents from "../../../Hooks/AuthHooks/Staff/Admin/Students/useGetUnassignedStudents";
import useGetGroupsByClassAndSection from "../../../Hooks/AuthHooks/Staff/Admin/Groups/useGetGroupsByClassAndSection ";

const MainSection = () => {
  const [activeSection, setActiveSection] = useState("Everyone");
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { fetchSection } = useFetchSection();
  const { cid } = useParams();

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

  const fetchGroups = async () => {
    if (cid) {
      let data;
      if (activeSection === "Everyone") {
        data = await fetchGroupsByClass(cid);
      } else {
        data = await fetchGroupsByClassAndSection(cid, activeSectionId);
      }
      setGroupList(data);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await fetchUnassignedStudents(cid);
      setUnassignedStudents(data);
    } catch (error) {
      console.error("Failed to load students");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (cid) {
        await fetchSection(cid);
        await fetchGroups();
        await fetchStudents();
      }
    };
    fetchData();
  }, [
    cid,
    activeSection,
    activeSectionId,
    fetchSection,
    fetchGroupsByClass,
    fetchGroupsByClassAndSection,
  ]);

  const handleSectionChange = (section, sectionId) => {
    setActiveSection(section);
    setActiveSectionId(sectionId);
    fetchGroups();
  };

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
