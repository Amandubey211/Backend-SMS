import React, { useEffect } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import Chapter from "./Components/Chapter";
import ModuleCard from "./Components/ModuleCard";
import { useSelector, useDispatch } from "react-redux";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import Spinner from "../../../../../../Components/Common/Spinner";
import { stdModule } from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Modules/module.action";
import { useParams } from "react-router-dom";
import {
  setExpandedChapters,
  setSelectedModule,
} from "../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Modules/moduleSlice";
import OfflineModal from "../../../../../../Components/Common/Offline";
import { setShowError } from "../../../../../../Store/Slices/Common/Alerts/alertsSlice";

const MainSection = () => {
  const {
    loading,
    error,
    modulesData,
    selectedModule,
    subjectName,
    expandedChapters,
  } = useSelector((store) => store?.student?.studentModule);
  const dispatch = useDispatch();
  const { cid, sid } = useParams();
  const { showError } = useSelector((store) => store?.common?.alertMsg);

  useEffect(() => {
    dispatch(stdModule({ cid, sid }));
  }, [dispatch]);

  // Select the first module when modules are fetched
  useEffect(() => {
    if (modulesData?.length > 0) {
      const firstModule = modulesData[0];
      dispatch(
        setSelectedModule({
          moduleId: firstModule?._id,
          name: firstModule?.moduleName,
          chapters: firstModule?.chapters,
        })
      );
      dispatch(setExpandedChapters([]));
    } else {
      dispatch(
        setSelectedModule({
          moduleId: null,
          name: null,
          chapters: [],
        })
      );
    }
  }, [dispatch, modulesData]);

  const toggleChapter = (chapterId) => {
    dispatch(
      setExpandedChapters(
        expandedChapters?.includes(chapterId)
          ? expandedChapters?.filter((id) => id !== chapterId)
          : [...expandedChapters, chapterId]
      )
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

    dispatch(setExpandedChapters([]));
  };

  const handleDismiss = () => {
    dispatch(setShowError(false));
  };

  // Render chapters if available
  const renderChapters = () => {
    if (loading) return <Spinner />;
    if (error) return <NoDataFound title="Chapters" error={error} />;
    if (!selectedModule?.chapters?.length)
      return <NoDataFound title="Chapters" />;
    return selectedModule?.chapters?.map((chapter, index) => (
      <Chapter
        key={index}
        title={chapter?.name}
        chapterNumber={index + 1}
        imageUrl={chapter?.thumbnail}
        assignments={chapter?.assignments}
        quizzes={chapter?.quizzes}
        isExpanded={
          Array.isArray(expandedChapters) &&
          expandedChapters.includes(chapter?._id)
        }
        onToggle={() => toggleChapter(chapter?._id)}
        attachments={chapter?.attachments}
      />
    ));
  };

  // Render modules if available
  const renderModules = () => {
    if (loading) return <Spinner />;
    if (error) return <NoDataFound title="Modules" error={error} />;
    if (modulesData?.length === 0) return <NoDataFound title="Modules" />;

    return (
      <div className="h-[100%] w-full">
        <div className="flex items-center  h-[10%]">
          <h1 className="text-xl font-semibold">All Modules</h1>
          <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full p-1 px-2">
            <span className="text-gradient">{modulesData?.length || 0}</span>
          </p>
        </div>
        <div className="grid grid-cols-1 overflow-y-auto w-full h-[90%]">
          {modulesData?.map((module, index) => (
            <ModuleCard
              key={index}
              title={module?.moduleName}
              moduleNumber={index + 1}
              imageUrl={module?.thumbnail}
              isCompleted={module?.isPublished}
              isSelected={selectedModule?.moduleId === module._id}
              onSelect={() => selectModule(module)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[100%]">
      <SubjectSideBar />
      <div className="w-[65%] bg-white p-2 border-l h-[100%]">
        <div className="bg-white p-2 rounded-lg">{renderChapters()}</div>
      </div>
      <div className="w-[35%] p-2 border h-[100%]">
        <div className="bg-white  rounded-lg  h-[100%] w-[100%]">
          {renderModules()}
        </div>
      </div>
      {!loading && showError && (
        <OfflineModal error={error} onDismiss={handleDismiss} />
      )}
    </div>
  );
};

export default MainSection;
