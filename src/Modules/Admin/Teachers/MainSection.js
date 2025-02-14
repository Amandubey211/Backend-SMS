import React, { useEffect, useState } from "react";
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

  const { assignedTeachers, loading, error, selectedSection } = useSelector(
    (state) => state.admin.teacher
  );

  // Local state to control sidebar and track the teacher being edited
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Fetch teachers when the component mounts
  useEffect(() => {
    dispatch(fetchTeachersByClass(cid));
  }, [cid, dispatch]);

  // Filter teachers by selected section
  const filteredTeachers =
    selectedSection === "Everyone"
      ? assignedTeachers
      : assignedTeachers?.filter(
          (teacher) =>
            teacher?.sectionId &&
            teacher.sectionId?.some(
              (section) => section?.sectionName === selectedSection
            )
        );

  // Handler to open sidebar for adding a new teacher assignment
  const openSidebarForAdd = () => {
    setEditingTeacher(null); // Clear any editing teacher
    setIsSidebarOpen(true);
  };

  // Handler to open sidebar for editing an existing teacher
  const openSidebarForEdit = (teacher) => {
    setEditingTeacher(teacher);
    setIsSidebarOpen(true);
  };

  // Close sidebar and clear editing teacher
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setEditingTeacher(null);
  };

  return (
    <>
      <ProtectedSection requiredPermission={PERMISSIONS.TEACHERS_BY_CLASS}>
        <NavigationBar
          isSidebarOpen={isSidebarOpen}
          openSidebarForAdd={openSidebarForAdd}
          closeSidebar={closeSidebar}
          editingTeacher={editingTeacher}
        />
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
              <TeacherCard
                key={teacher._id}
                teacher={teacher}
                onEditTeacher={openSidebarForEdit}
              />
            ))
          )}
        </div>
      </ProtectedSection>
    </>
  );
};

export default MainSection;
