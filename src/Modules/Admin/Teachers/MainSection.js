import React, { useEffect, useState } from "react";
import TeacherCard from "./TeacherCard";
import { useParams } from "react-router-dom";
import useFetchTeachersByClass from "../../../Hooks/AuthHooks/Staff/Admin/useFetchTeachersByClass";
import { useSelector } from "react-redux";
import ShimmerCard from "../../../Components/Common/ShimmerCard";
import NavigationBar from "./NavigationBar ";

const MainSection = () => {
  const [selectedSection, setSelectedSection] = useState("Everyone");
  const { cid } = useParams();
  const { loading, fetchTeachersByClass, error } = useFetchTeachersByClass();

  useEffect(() => {
    if (cid) {
      fetchTeachersByClass(cid);
    }
  }, [cid]);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const AssignedTeachers = useSelector((store) => store.Class.assignedTeacher);

  const filteredTeachers =
    selectedSection === "Everyone"
      ? AssignedTeachers
      : AssignedTeachers.filter(
          (teacher) => teacher?.sectionName === selectedSection
        );

  return (
    <>
      <div>
        <NavigationBar
          onSectionChange={handleSectionChange}
          selectedSection={selectedSection}
        />
      </div>
      <div className="flex flex-wrap justify-center px-2 items-center">
        {loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <ShimmerCard key={index} />
          ))}
        {error && <p>Error: {error}</p>}
        {!loading && !AssignedTeachers.length && (
          <p>No teachers assigned to this class.</p>
        )}
        {filteredTeachers.map((teacher, index) => (
          <TeacherCard
            key={index}
            name={teacher.fullName}
            role={teacher.role}
            phone={teacher.mobileNumber}
            image={teacher.image}
          />
        ))}
      </div>
    </>
  );
};

export default MainSection;
