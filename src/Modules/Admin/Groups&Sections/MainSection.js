import React, { useEffect, useState } from "react";
import NavigationBar from "./Components/NavigationBar";
import UnAssignedStudentList from "./Components/UnAssignedStudentList";
import GroupList from "./Components/GroupList";
import useFetchSection from "../../../Hooks/AuthHooks/Staff/Admin/Sections/useFetchSection";
import { useParams } from "react-router-dom";

const MainSection = () => {
  const [selectedSection, setSelectedSection] = useState("Everyone");
  const { fetchSection } = useFetchSection();
  const { cid } = useParams();
  useEffect(() => {
    if (cid) {
      fetchSection(cid);
    }
  }, [cid, fetchSection]);
  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  // const filteredTeachers =
  //   selectedSection === "Everyone"
  //     ? teachers
  //     : teachers.filter((teacher) => teacher.sectionName === selectedSection);
  return (
    <div>
      <NavigationBar
        onSectionChange={handleSectionChange}
        selectedSection={selectedSection}
      />
      <div className="p-2 flex gap-1 ">
        <UnAssignedStudentList />
        <GroupList />
      </div>
    </div>
  );
};

export default MainSection;
