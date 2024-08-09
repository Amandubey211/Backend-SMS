import React, { useEffect, useState } from "react";
import TeacherCard from "./TeacherCard";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ShimmerCard from "../../../Components/Common/ShimmerCard";
import NavigationBar from "./NavigationBar";
import useFetchTeachersByClass from "../../../Hooks/AuthHooks/Staff/Admin/Teacher/useFetchTeachersByClass";
import { FaExclamationTriangle, FaSpinner, FaUsers } from "react-icons/fa"; // Import error and loading icons
import Spinner from "../../../Components/Common/Spinner";
import Sidebar from "../../../Components/Common/Sidebar";
import toast from "react-hot-toast";

const MainSection = () => {
  const [selectedSection, setSelectedSection] = useState("Everyone");
  const { cid } = useParams();
  const { loading, fetchTeachersByClass, error } = useFetchTeachersByClass();
  const [initialLoad, setInitialLoad] = useState(true);

  const AssignedTeachers = useSelector((store) => store.Class.assignedTeacher);
  const AllSubjects = useSelector((store) => store.Subject.subjects);
  const AllSections = useSelector((store) => store.Class.sectionsList);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [subjectId, setSubjectId] = useState("");
  const [sectionId, setSectionId] = useState("");

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

  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    setSubjectId(teacher.subjectId || "");
    setSectionId(teacher.sectionId || "");
    setIsSidebarOpen(true);
  };

  const handleSidebarSubmit = (e) => {
    e.preventDefault();
    if (selectedTeacher) {
      
      toast.success(`Teacher details updated successfully!`);
      setIsSidebarOpen(false);
    }
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
      <div className="flex flex-wrap justify-start px-2 items-center">
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
            id={teacher._id}
            onEditClick={() => handleEditClick(teacher)}
          />
        ))}
      </div>
      {/* Sidebar for editing teacher details */}
      <Sidebar isOpen={isSidebarOpen} title="Update Assigned Teacher" onClose={() => setIsSidebarOpen(false)} width="30%">
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
                {AllSubjects?.map((subject) => (
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
                {AllSections?.map((section) => (
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
              className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={loading}
            >
              {loading ? "Assigning..." : "Update Instructor"}
            </button>
          </div>
        </form>
      </Sidebar>
    </>
  );
};

export default MainSection;
