import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { GoAlertFill } from "react-icons/go";
import Chapter from "./Components/Chapter";
import ModuleCard from "./Components/ModuleCard";
import { ChapterSkeleton, ModuleSkeleton } from "../Skeletons";
import ChapterImage from "../../../Assets/ParentAssets/images/ChapterImage.jpeg";
import ModuleImage from "../../../Assets/ParentAssets/images/ModuleImage.jpeg";

const MainSection = ({ selectedSubjectId, studentId, moduleLoading }) => {
  const [modules, setModules] = useState([]);
  const [expandedChapters, setExpandedChapters] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  // Pull courseProgress, loading, error from store
  const { courseProgress, loading, error } = useSelector(
    (store) => store.admin.all_students
  );

  // Update local modules whenever courseProgress changes
  useEffect(() => {
    if (courseProgress && courseProgress.module) {
      setModules(courseProgress.module);

      // Optionally set the first module as selected if none is selected yet
      if (!selectedModule || selectedModule.moduleId !== courseProgress.module[0]?.moduleId) {
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

  return (
    <div className="flex border-b border-gray-300">
      {/* Middle: Chapters */}
      <div className="w-[65%] bg-white p-2">
        <div className="bg-white p-2 rounded-lg">
          {moduleLoading ? (
            // Show skeleton if modules are being fetched
            <ChapterSkeleton />
          ) : selectedModule ? (
            selectedModule.chapters?.map((chapter, index) => (
              <Chapter
                key={chapter.chapterId}
                id={chapter.chapterId}
                title={chapter.name}
                chapterNumber={index + 1}
                imageUrl={chapter.thumbnail}
                assignments={chapter.assignments || []}
                quizzes={chapter.quizzes || []}
                attachments={chapter.attachments || []}
                isExpanded={expandedChapters === chapter.chapterId}
                onToggle={() => handleToggle(chapter.chapterId)}
              />
            ))
          ) : (
            <div className="flex justify-center items-center font-bold text-gray-500 my-20 h-full w-full">
              <div className="flex items-center justify-center flex-col text-2xl">
                {/* Replace icon with the Module image */}
                <img src={ChapterImage} alt="Module" className="w-[15rem] h-[15rem] mb-4" />
                Please select a module to view its chapters.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: All Modules */}
      <div className="w-[35%] p-2 border-l-2">
        <div className="bg-white p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">All Modules</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {moduleLoading ? (
              <ModuleSkeleton />
            ) : modules?.length > 0 ? (
              modules.map((module, index) => (
                <div
                  key={module.moduleId}
                  onClick={() => selectModule(module)}
                  className={`cursor-pointer p-2 rounded-lg shadow-md transition-all duration-200 ${selectedModule?.moduleId === module.moduleId
                    ? "bg-purple-100"
                    : "hover:bg-gray-50"
                    }`}
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
                <div className="flex items-center justify-center flex-col text-2xl text-center">
                  <img src={ModuleImage} alt="Module" className="w-[15rem] h-[15rem] mb-4 mx-auto" />
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
