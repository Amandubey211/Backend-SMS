import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import TeacherCard from "./TeacherCard";
import NavigationBar from "./NavigationBar";
import Spinner from "../../../Components/Common/Spinner";
import Sidebar from "../../../Components/Common/Sidebar";
import NoDataFound from "../../../Components/Common/NoDataFound";
import useFetchTeachersByClass from "../../../Hooks/AuthHooks/Staff/Admin/Teacher/useFetchTeachersByClass";

const MainSection = () => {
  const [selectedSection, setSelectedSection] = useState("Everyone");
  const { cid } = useParams();
  const { loading, fetchTeachersByClass, error } = useFetchTeachersByClass();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [subjectId, setSubjectId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const { assignedTeachers, allSubjects, allSections, role } = useSelector(
    (store) => ({
      assignedTeachers: store.Class.assignedTeacher,
      allSubjects: store.Subject.subjects,
      allSections: store.Class.sectionsList,
      role: store.Auth.role,
    })
  );

  useEffect(() => {
    let isMounted = true;
    fetchTeachersByClass(cid).finally(() => {
      if (isMounted) setIsSidebarOpen(false);
    });
    return () => {
      isMounted = false;
    };
  }, [cid, fetchTeachersByClass]);

  const handleSectionChange = useCallback((section) => {
    setSelectedSection(section);
  }, []);

  const handleEditClick = useCallback((teacher) => {
    setSelectedTeacher(teacher);
    setSubjectId(teacher.subjectId || "");
    setSectionId(teacher.sectionId || "");
    setIsSidebarOpen(true);
  }, []);

  const handleSidebarSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (selectedTeacher) {
        toast.success("Teacher details updated successfully!");
        setIsSidebarOpen(false);
      }
    },
    [selectedTeacher]
  );

  return (
    <>
      <div>
        <NavigationBar
          role={role}
          onSectionChange={handleSectionChange}
          selectedSection={selectedSection}
          totalTeachers={assignedTeachers?.length}
        />
      </div>
      <div className="flex flex-wrap justify-start px-2 items-center">
        {loading && (
          <div className="flex h-full w-full justify-center items-center">
            <Spinner />
          </div>
        )}
        {error && (
          <div className="flex h-full w-full justify-center items-center">
            <NoDataFound />
          </div>
        )}
        {assignedTeachers.length < 1 && (
          <div className="flex h-full w-full justify-center items-center">
            <NoDataFound title="Teacher" />
          </div>
        )}
        {assignedTeachers?.map((teacher) => (
          <TeacherCard
            role={role}
            key={teacher._id}
            teacher={teacher}
            onEditClick={handleEditClick}
          />
        ))}
      </div>
      {role === "admin" && (
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
                  disabled={loading}
                >
                  <option value="">Choose</option>
                  {allSubjects?.map((subject) => (
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
                  disabled={loading}
                >
                  <option value="">Choose</option>
                  {allSections?.map((section) => (
                    <option key={section._id} value={section._id}>
                      {section.sectionName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-auto mb-8">
              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Assigning..." : "Update Instructor"}
              </button>
            </div>
          </form>
        </Sidebar>
      )}
    </>
  );
};

export default MainSection;
