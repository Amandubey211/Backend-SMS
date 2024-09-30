import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoAlertFill } from "react-icons/go";
import { fetchModules, fetchSubjects } from "../../../Store/Slices/Parent/Children/children.action";
import Chapter from "../../Admin/UsersProfiles/StudentProfile/Components/StudentCourseProgress/Module/Components/Chapter";
import ModuleCard from "../../Admin/UsersProfiles/StudentProfile/Components/StudentCourseProgress/Module/Components/ModuleCard";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";

const MainSection = ({ student, selectedSubjectId, setSelectedSubjectId }) => {
  const dispatch = useDispatch();
  const [expandedChapters, setExpandedChapters] = useState(null);

  const { modules, subjects, loading, error } = useSelector((state) => state.Parent.children);

  useNavHeading("My Childs", "Subject Progress");

  // Fetch subjects when student.id is available
  useEffect(() => {
    if (student?.id) {
      dispatch(fetchSubjects(student.id));
    }
  }, [student?.id, dispatch]);

  // Set the first subject as selectedSubjectId after subjects are fetched
  useEffect(() => {
    if (subjects?.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(subjects[0]?._id);
    }
  }, [subjects, selectedSubjectId, setSelectedSubjectId]);

  // Fetch modules when selectedSubjectId and student are available, but only if subjects exist
  useEffect(() => {
    if (selectedSubjectId && student?.presentClassId && subjects?.length > 0) {
      dispatch(fetchModules({
        studentId: student?.id,
        subjectId: selectedSubjectId,
        presentClassId: student?.presentClassId,
      }));
    }
  }, [selectedSubjectId, student?.id, student?.presentClassId, subjects?.length, dispatch]);

  const selectModule = (module) => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleToggle = (id) => {
    setExpandedChapters((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex min-h-screen my-2">
      <div className="w-[65%] bg-white p-2 border-l">
        <div className="bg-white p-2 rounded-lg">
          {/* Show loading or error state */}
          {loading ? (
            <div className="flex justify-center items-center my-20 h-full w-full">
              <p className="text-gray-500">Loading data...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center my-20 h-full w-full">
              <p className="text-gray-500">Error loading data: {error}</p>
            </div>
          ) : modules?.length > 0 ? (
            modules?.map((module, index) => (
              <Chapter
                key={index}
                id={module?._id}
                title={module?.name}
                chapterNumber={index + 1}
                imageUrl={module?.thumbnail}
                assignments={module?.assignments}
                quizzes={module?.quizzes}
                isExpanded={expandedChapters}
                onToggle={() => handleToggle(module?._id)}
              />
            ))
          ) : (
            <div className="flex justify-center items-center font-bold text-gray-500 my-20 h-full w-full">
              <div className="flex items-center justify-center flex-col text-2xl">
                <GoAlertFill className="text-[5rem] text-gray-500" />
                No Data Found
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar for Subject and Module Info */}
      <div className="w-[35%] p-2 border-l-2">
        <div className="bg-white p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">All Modules</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {modules?.length > 0 ? (
              modules?.map((module, index) => (
                <div
                  key={index}
                  onClick={() => selectModule(module)}
                  className={`cursor-pointer p-2 rounded-lg shadow-md transition-all duration-200 ${
                    module?.chapters[0]?._id === expandedChapters ? "bg-purple-100" : "hover:bg-gray-50"
                  }`}
                >
                  <ModuleCard
                    title={module?.moduleName}
                    moduleNumber={module?.moduleNumber}
                    imageUrl={module?.thumbnail}
                    isCompleted={module?.isCompleted}
                  />
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center font-bold text-gray-500 my-20 h-full w-full">
                <div className="flex items-center justify-center flex-col text-2xl">
                  <GoAlertFill className="text-[5rem] text-gray-500" />
                  No Modules Found
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
