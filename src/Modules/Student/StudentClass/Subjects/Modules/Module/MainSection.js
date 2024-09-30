import React, { useState, useEffect } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import Chapter from "./Components/Chapter";
import ModuleCard from "./Components/ModuleCard";
import { useSelector, useDispatch } from "react-redux";
import useGetModulesForStudent from "../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useGetModulesForStudent";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import Spinner from "../../../../../../Components/Common/Spinner";
import { stdModule } from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Modules/module.action";
import { useParams } from "react-router-dom";
import { setExpandedChapters, setSelectedModule } from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Modules/moduleSlice";

const MainSection = () => {
  const { loading, error, modulesData,selectedModule,subjectName,expandedChapters } = useSelector((store) => store?.student?.studentModule);
  const dispatch = useDispatch();
  const { cid, sid } = useParams();
  // const { error, fetchModules, loading, modulesData } =
  //   useGetModulesForStudent();
  // const [expandedChapters, setExpandedChapters] = useState([]);
  useEffect(() => {
    dispatch(stdModule({ cid, sid }));
    // fetchModules();
  }, [dispatch]);

  // Select the first module when modules are fetched
  useEffect(() => {
    if (modulesData?.modules?.length>0) {
      const firstModule = modulesData.modules[0];
      dispatch(
        setSelectedModule({
          moduleId: firstModule._id,
          name: firstModule.moduleName,
          chapters: firstModule.chapters,
        })
      );
    } else {
      dispatch(setSelectedModule({
        moduleId: null,
        name: null,
        chapters: [],
      }));
    }
  }, [dispatch]);

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const selectModule = (module) => {
    dispatch(
      setSelectedModule({
        moduleId: module?._id,
        name: module?.moduleName,
        chapters: module?.chapters,
      })
    );
    setExpandedChapters([]);
  };

  // Render chapters if available
  const renderChapters = () => {
    if (loading) return <Spinner />;
    if (error) return <NoDataFound title="Chapters" error={error} />;
    if (!selectedModule?.chapters?.length)
      return <NoDataFound title="Chapters" />;

    return selectedModule.chapters.map((chapter, index) => (
      <Chapter
        key={index}
        title={chapter.name}
        chapterNumber={index + 1}
        imageUrl={chapter.thumbnail}
        assignments={chapter.assignments}
        quizzes={chapter.quizzes}
        isExpanded={expandedChapters.includes(chapter._id)}
        onToggle={() => toggleChapter(chapter._id)}
        attachments={chapter.attachments}
      />
    ));
  };

  // Render modules if available
  const renderModules = () => {
    if (loading) return <Spinner />;
    if (error) return <NoDataFound title="Modules" error={error} />;
    if (!modulesData?.modules?.length) return <NoDataFound title="Modules" />;

    return (
      <>
        <div className="flex items-center gap-1 mb-2">
          <h1 className="text-xl font-semibold">All Modules</h1>
          <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full p-1 px-2">
            <span className="text-gradient">
              {modulesData?.modules.length || 0}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {modulesData.modules.map((module, index) => (
            <ModuleCard
              key={index}
              title={module.moduleName}
              moduleNumber={index + 1}
              imageUrl={module.thumbnail}
              isCompleted={module.isPublished}
              isSelected={selectedModule?.moduleId === module._id}
              onSelect={() => selectModule(module)}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="flex min-h-screen">
      <SubjectSideBar />
      <div className="w-[60%] bg-white p-2 border-l">
        <div className="bg-white p-2 rounded-lg">{renderChapters()}</div>
      </div>
      <div className="w-[35%] p-2 border">
        <div className="bg-white p-4 rounded-lg">{renderModules()}</div>
      </div>
    </div>
  );
};

export default MainSection;
