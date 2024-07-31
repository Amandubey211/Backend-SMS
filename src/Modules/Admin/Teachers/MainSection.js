import React, { useEffect, useState } from "react";
import TeacherCard from "./TeacherCard";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ShimmerCard from "../../../Components/Common/ShimmerCard";
import NavigationBar from "./NavigationBar";
import useFetchTeachersByClass from "../../../Hooks/AuthHooks/Staff/Admin/Teacher/useFetchTeachersByClass";
import { FaExclamationTriangle, FaSpinner, FaUsers } from "react-icons/fa"; // Import error and loading icons
import Spinner from "../../../Components/Common/Spinner";

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
        {loading && <Spinner />}
        {error && (
          <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
            <FaExclamationTriangle className="text-6xl mb-4 text-red-500" />
            <p className="italic">Error fetching teachers: {error.message}</p>
          </div>
        )}
        {!loading && !AssignedTeachers.length && (
          <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
            <FaUsers className="text-6xl mb-4" />
            <p className="italic">No teachers assigned to this Section.</p>
          </div>
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
