import React, { useState, useEffect } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import Chapter from "./Components/Chapter";
import ModuleCard from "./Components/ModuleCard";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedModule } from "../../../../../../Redux/Slices/Common/CommonSlice";
import useGetModulesForStudent from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useGetModulesForStudent";

const MainSection = () => {
  const [expandedChapters, setExpandedChapters] = useState([]);
  const dispatch = useDispatch();
  const selectedModule = useSelector((state) => state.Common.selectedModule);
  const { error, fetchModules, loading, modulesData } = useGetModulesForStudent();

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  useEffect(() => {
    if (modulesData && modulesData.modules.length > 0) {
      dispatch(
        setSelectedModule({
          moduleId: modulesData.modules[0]._id,
          name: modulesData.modules[0].moduleName,
          chapters: modulesData.modules[0].chapters,
        })
      );
    } else {
      dispatch(setSelectedModule({}));
    }
  }, [dispatch, modulesData]);

  const handleToggle = (chapterId) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleModuleSelect = (module) => {
    dispatch(
      setSelectedModule({
        moduleId: module._id,
        name: module.moduleName,
        chapters: module.chapters,
      })
    );
    setExpandedChapters([]);
  };

  return (
    <div className="flex min-h-screen">
      <SubjectSideBar />
      <div className="w-[60%] bg-white p-2 border-l">
        <div className="bg-white p-2 rounded-lg">
          <div className="flex justify-between px-4 mb-3 items-center">
            <h1 className="text-md font-semibold">
              {selectedModule.name ? selectedModule.name : "Select a Module"}
            </h1>
          </div>
          {selectedModule.chapters && selectedModule.chapters.length > 0 ? (
            selectedModule.chapters.map((chapter, index) => (
              <Chapter
                key={index}
                title={chapter.name}
                chapterNumber={index + 1}
                imageUrl={chapter.thumbnail}
                assignments={chapter.assignments}
                quizzes={chapter.quizzes}
                isExpanded={expandedChapters.includes(chapter._id)}
                onToggle={() => handleToggle(chapter._id)}
                attachments={chapter.attachments}
              />
            ))
          ) : (
            <p>No Chapters Found.</p>
          )}
        </div>
      </div>
      <div className="w-[35%] p-2 border">
        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center gap-1 mb-2">
            <h1 className="text-xl font-semibold">All Modules</h1>
            <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full p-1 px-2">
              <span className="text-gradient">
                {modulesData?.modules.length || 0}
              </span>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {modulesData?.modules.map((module, index) => (
              <ModuleCard
                key={index}
                title={module.moduleName}
                moduleNumber={index + 1}
                imageUrl={module.thumbnail}
                isCompleted={module.isPublished}
                isSelected={
                  selectedModule && selectedModule.moduleId === module._id
                }
                onSelect={() => handleModuleSelect(module)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
