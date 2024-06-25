import React, { useEffect, useState } from "react";
import TeacherCard from "./TeacherCard";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ShimmerCard from "../../../Components/Common/ShimmerCard";
import NavigationBar from "./NavigationBar ";
import useFetchTeachersByClass from "../../../Hooks/AuthHooks/Staff/Admin/Teacher/useFetchTeachersByClass";

const MainSection = () => {
  const [selectedSection, setSelectedSection] = useState("Everyone");
  const { cid } = useParams();
  const { loading, fetchTeachersByClass, error } = useFetchTeachersByClass();
  const [initialLoad, setInitialLoad] = useState(true);

  const AssignedTeachers = useSelector((store) => store.Class.assignedTeacher);

  useEffect(() => {
    let isMounted = true;
    fetchTeachersByClass(cid).finally(() => {
      if (isMounted) setInitialLoad(false);
    });
    return () => {
      isMounted = false;
    };
  }, [cid, fetchTeachersByClass]);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  // const filteredTeachers =
  //   selectedSection === "Everyone"
  //     ? AssignedTeachers
  //     : AssignedTeachers.filter(
  //         (teacher) => teacher?.sectionName === selectedSection
  //       );

  return (
    <>
      <div>
        <NavigationBar
          onSectionChange={handleSectionChange}
          selectedSection={selectedSection}
          totalTeachers={AssignedTeachers?.length}
        />
      </div>
      <div className="flex flex-wrap justify-center px-2 items-center">
        {initialLoad &&
          Array.from({ length: 3 }).map((_, index) => (
            <ShimmerCard key={index} />
          ))}
        {error && <p>Error: {error}</p>}
        {!loading && !AssignedTeachers.length && (
          <p className="py-10">No teachers assigned to this Section.</p>
        )}
        {AssignedTeachers?.map((teacher, index) => (
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
