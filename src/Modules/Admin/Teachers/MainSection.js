import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import TeacherCard from "./TeacherCard";
import NavigationBar from "./NavigationBar";
import Spinner from "../../../Components/Common/Spinner";
import NoDataFound from "../../../Components/Common/NoDataFound";
import { fetchTeachersByClass } from "../../../Store/Slices/Admin/Class/Teachers/teacherThunks";
import ProtectedSection from "../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../config/permission";

const MainSection = () => {
  const { cid } = useParams();
  const dispatch = useDispatch();

  const { assignedTeachers, loading, error } = useSelector(
    (state) => state.admin.teacher
  );

  const selectedSection = useSelector(
    (state) => state.admin.teacher.selectedSection
  );

  // Fetch teachers when the component is mounted
  useEffect(() => {
    dispatch(fetchTeachersByClass(cid));
  }, [cid, dispatch]);

  // Filter assigned teachers by selected section
  const filteredTeachers =
    selectedSection === "Everyone"
      ? assignedTeachers
      : assignedTeachers?.filter(
          (teacher) =>
            teacher?.sectionId &&
            teacher.sectionId.some(
              (section) => section?.sectionName === selectedSection
            )
        );

  return (
    <>
    <ProtectedSection requiredPermission={PERMISSIONS.TEACHERS_BY_CLASS}>
      <NavigationBar />
      <div className="flex flex-wrap justify-start px-2 items-center">
        {loading ? (
          <div className="h-96 w-full flex justify-center items-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="h-96 w-full flex justify-center items-center">
            <NoDataFound />
          </div>
        ) : filteredTeachers?.length < 1 ? (
          <div className="h-96 w-full flex justify-center items-center">
            <NoDataFound title="Teacher" />
          </div>
        ) : (
          filteredTeachers?.map((teacher) => (
            <TeacherCard key={teacher._id} teacher={teacher} />
          ))
        )}
      </div>
      </ProtectedSection>
    </>
  );
};

export default MainSection;
