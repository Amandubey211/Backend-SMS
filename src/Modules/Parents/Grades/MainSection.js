import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { GoAlertFill } from "react-icons/go";
import Chapter from "./Components/Chapter";
import ModuleCard from "./Components/ModuleCard";
import { ChapterSkeleton, ModuleSkeleton } from "../Skeletons";
import { FaBookOpen, FaFolderOpen } from "react-icons/fa";

const MainSection = ({ selectedSubjectId, studentId, moduleLoading }) => {
  const [modules, setModules] = useState([]);
  const [expandedChapters, setExpandedChapters] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  // Pull courseProgress and error from the store
  const { courseProgress, error } = useSelector(
    (store) => store.admin.all_students
  );

  // Update local modules whenever courseProgress changes
  useEffect(() => {
    if (courseProgress && courseProgress.module) {
      setModules(courseProgress.module);
      // Optionally set the first module as selected if none is selected yet
      if (
        !selectedModule ||
        selectedModule.moduleId !== courseProgress.module[0]?.moduleId
      ) {
        setSelectedModule(courseProgress.module[0] || null);
      }
    } else {
      setModules([]);
      setSelectedModule(null);
    }
  }, [courseProgress]);

  // Expand/collapse chapters
  const handleToggle = (chapterId) => {
    setExpandedChapters((prev) => (prev === chapterId ? null : chapterId));
  };

  // Switch modules
  const selectModule = (module) => {
    setSelectedModule(module);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // Show an error if there's a fetch failure for modules
  if (error) {
    return (
      <div className="flex justify-center items-center my-20 h-full w-full">
        <p className="text-gray-500">
          Error loading data: {typeof error === "object" ? error.message : error}
        </p>
      </div>
    );
  }

  // If module loading is complete and there are no modules, show full-panel "No Modules Found"
  if (!moduleLoading && modules.length === 0) {
    return (
      <div className="flex justify-center items-center my-20 h-full w-full">
        <div className="flex flex-col items-center justify-center text-2xl text-center">
          <FaFolderOpen className="text-6xl mb-4" />
          <p>No modules found for this Subject</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Middle: Chapters */}
      <div className="w-[65%] bg-white p-2">
        <div className="bg-white p-2 rounded-lg">
          {moduleLoading ? (
            // Show skeleton if modules are being fetched
            <ChapterSkeleton />
          ) : selectedModule ? (
            selectedModule.chapters && selectedModule.chapters.length > 0 ? (

              <Chapter
                key={selectedModule.chapters[0].chapterId}
                id={selectedModule.chapters[0].chapterId}
                assignments={selectedModule.chapters[0].assignments || []}
                quizzes={selectedModule.chapters[0].quizzes || []}
                attachments={selectedModule.chapters[0].attachments || []}
              />

            ) : (
              <div className="flex justify-center items-center font-bold text-gray-500 my-20 h-full w-full">
                <div className="flex flex-col items-center justify-center text-2xl text-center">
                  <FaBookOpen className="text-6xl mb-4" />
                  <p>No chapters found for this module.</p>
                </div>
              </div>
            )
          ) : (
            <div className="flex justify-center items-center font-bold text-gray-500 my-20 h-full w-full">
              <div className="flex flex-col items-center justify-center text-2xl text-center">
                <p>Please select a module to view its chapters.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: All Modules */}
      <div className="w-[35%] p-2 border-l border-gray-300 min-h-[100vh]">
        <div className="bg-white p-2 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-lg font-semibold">All Modules</span>
            <span className="bg-gradient-to-r from-pink-100 to-purple-200 text-pink-600 font-bold rounded-full px-3 py-1 text-sm">
              {modules.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {moduleLoading ? (
              <ModuleSkeleton />
            ) : modules.length > 0 ? (
              modules.map((module, index) => (
                <div
                  key={module.moduleId}
                  onClick={() => selectModule(module)}
                  className={`
                    cursor-pointer
                    rounded-lg
                    mb-2
                    transition-all duration-200
                    ${selectedModule?.moduleId === module.moduleId
                      ? "border-2 border-red-500"
                      : "border border-gray-200 hover:shadow-sm"
                    }
                  `}
                >
                  <ModuleCard
                    title={module.name}
                    moduleNumber={index + 1}
                    imageUrl={module.thumbnail}
                    isCompleted={module.isCompleted}
                  />
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center font-bold text-gray-500 h-full w-full py-20">
                <div className="flex flex-col items-center justify-center text-2xl text-center">
                  <FaFolderOpen className="text-6xl mb-4" />
                  <p>No modules are currently available.</p>
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
