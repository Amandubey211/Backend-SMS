import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import TeacherCard from "./TeacherCard";
import NavigationBar from "./NavigationBar";
import Spinner from "../../../Components/Common/Spinner";
import Sidebar from "../../../Components/Common/Sidebar";
import NoDataFound from "../../../Components/Common/NoDataFound";
import {
  fetchTeachersByClass,
  assignTeacher,
} from "../../../Store/Slices/Admin/Class/Teachers/teacherThunks";
import { fetchSectionsByClass } from "../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";

const MainSection = () => {
  const { cid } = useParams();
  const dispatch = useDispatch();

  const { assignedTeachers, loading, error } = useSelector(
    (state) => state.admin.teacher
  );
  const role = useSelector((state) => state.common.auth.role);
  const sectionsList = useSelector(
    (state) => state.admin.group_section.sectionsList
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [subjectId, setSubjectId] = useState("");
  const [sectionId, setSectionId] = useState("");

  // Fetch teachers and sections when component is mounted
  useEffect(() => {
    dispatch(fetchTeachersByClass(cid));
    dispatch(fetchSectionsByClass(cid));
  }, [cid, dispatch]);

  const handleEditClick = useCallback((teacher) => {
    setSelectedTeacher(teacher);
    setSubjectId(teacher.subjectId || "");
    setSectionId(teacher.sectionId || "");
    setIsSidebarOpen(true);
  }, []);

  // Submit handler for updating teacher assignment
  const handleSidebarSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!subjectId || !sectionId) {
        alert("Both Subject and Section are required.");
        return;
      }

      const assignData = {
        teacherId: selectedTeacher._id,
        classId: cid,
        subjectId,
        sectionId,
      };
      dispatch(assignTeacher(assignData));
      setIsSidebarOpen(false);
    },
    [dispatch, selectedTeacher, cid, subjectId, sectionId]
  );

  return (
    <>
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
        ) : assignedTeachers.length < 1 ? (
          <div className="h-96 w-full flex justify-center items-center">
            <NoDataFound title="Teacher" />
          </div>
        ) : (
          assignedTeachers.map((teacher) => (
            <TeacherCard
              key={teacher._id}
              teacher={teacher}
              role={role}
              onEditClick={handleEditClick}
            />
          ))
        )}
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        title="Update Assigned Teacher"
        onClose={() => setIsSidebarOpen(false)}
        width="30%"
      >
        <form className="flex flex-col h-full" onSubmit={handleSidebarSubmit}>
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Choose</option>
                {sectionsList?.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Choose</option>
                {sectionsList?.map((section) => (
                  <option key={section._id} value={section._id}>
                    {section.sectionName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
          >
            Update Instructor
          </button>
        </form>
      </Sidebar>
    </>
  );
};

export default MainSection;
