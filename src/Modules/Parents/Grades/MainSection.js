import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoAlertFill } from "react-icons/go";
import Chapter from "./Components/Chapter";
import ModuleCard from "./Components/ModuleCard";
import Spinner from "../../../Components/Common/Spinner";
import { fetchCourseProgress } from "../../../Store/Slices/Admin/Users/Students/student.action";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";


const MainSection = () => {
  const { studentId } = useParams();
  const [modules, setModules] = useState([]);
  const [expandedChapters, setExpandedChapters] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const { courseProgress, loading, error } = useSelector(
    (store) => store.admin.all_students
  );
  useEffect(() => {
    if (courseProgress && courseProgress?.module) {
      const fetchedModules = courseProgress.module;
      setModules(fetchedModules);

      // Update selectedModule only if it changes
      if (!selectedModule || selectedModule.moduleId !== fetchedModules[0]?.moduleId) {
        setSelectedModule(fetchedModules[0] || null);
      }
    }
  }, [courseProgress]);

  const selectModule = (module) => {
    setSelectedModule(module);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleToggle = (id) => {
    setExpandedChapters((prev) => (prev === id ? null : id));
  };

  const ChapterSkeleton = ({ count = 3 }) => {
    return (
      <div className="flex flex-col gap-4">
        {Array(count)
          .fill("")
          .map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-gray-200 rounded-lg"
            >
              <Skeleton.Avatar active size="large" shape="square" />
              <div className="flex flex-col w-full">
                <Skeleton.Input active style={{ width: "50%" }} />
                <Skeleton.Input active style={{ width: "30%", marginTop: 6 }} />
              </div>
              <Skeleton.Button active shape="circle" />
            </div>
          ))}
      </div>
    );
  };

  const ModuleSkeleton = ({ count = 3 }) => {
    return (
      <div className="grid grid-cols-1 gap-2">
        {Array(count)
          .fill("")
          .map((_, i) => (
            <div
              key={i}
              className="cursor-pointer p-2 rounded-lg shadow-md transition-all duration-200 bg-gray-200"
            >
              <Skeleton.Image
                active
                style={{ width: "100%", height: "150px", borderRadius: "8px" }}
              />
              <div className="p-2">
                <Skeleton.Input active style={{ width: "70%", height: "20px" }} />
                <Skeleton.Input
                  active
                  style={{ width: "40%", height: "20px", marginTop: 8 }}
                />
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen my-2">
      <div className="w-[65%] bg-white p-2">
        <div className="bg-white p-2 rounded-lg">
          {loading ? (
            <ChapterSkeleton />
          ) : error ? (
            <div className="flex justify-center items-center my-20 h-full w-full">
              <p className="text-gray-500">Error loading data: {error}</p>
            </div>
          ) : selectedModule ? (
            selectedModule.chapters?.map((chapter, index) => (
              <Chapter
                key={index}
                id={chapter?.chapterId}
                title={chapter?.name}
                chapterNumber={index + 1}
                imageUrl={chapter?.thumbnail}
                assignments={chapter?.assignments || []}
                quizzes={chapter?.quizzes || []}
                attachments={chapter?.attachments || []}
                isExpanded={expandedChapters === chapter?.chapterId}
                onToggle={() => handleToggle(chapter?.chapterId)}
              />
            ))
          ) : (
            <div className="flex justify-center items-center font-bold text-gray-500 my-20 h-full w-full">
              <div className="flex items-center justify-center flex-col text-2xl">
                <GoAlertFill className="text-[5rem] text-gray-500" />
                No Module Selected
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
            {loading ? (
              <ModuleSkeleton />
            ) : modules?.length > 0 ? (
              modules?.map((module, index) => (
                <div
                  key={index}
                  onClick={() => selectModule(module)}
                  className={`cursor-pointer p-2 rounded-lg shadow-md transition-all duration-200 ${
                    selectedModule?.moduleId === module.moduleId
                      ? "bg-purple-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <ModuleCard
                    title={module?.name}
                    moduleNumber={index + 1}
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
