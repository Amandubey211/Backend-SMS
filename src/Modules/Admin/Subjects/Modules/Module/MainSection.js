import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubjectSideBar from "../../Component/SubjectSideBar";
import Chapter from "./Components/Chapter";
import ModuleCard from "./Components/ModuleCard";
import Sidebar from "../../../../../Components/Common/Sidebar";
import AddModule from "./Components/AddModule";
import { RiAddFill } from "react-icons/ri";
import MoveModule from "./Components/MoveModule";
import AddChapter from "./Components/AddChapter";
import Spinner from "../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
import { fetchModules } from "../../../../../Store/Slices/Admin/Class/Module/moduleThunk";
import { setSelectedModule } from "../../../../../Store/Slices/Admin/Class/Module/moduleSlice";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const MainSection = () => {
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const { sid, cid } = useParams();
  const dispatch = useDispatch();
  const {
    selectedModule,
    modules: modulesData,
    error,
    moduleLoading,
    chapterLoading,
    attachmentLoading,
  } = useSelector((state) => state.admin.module);

  useEffect(() => {
    if (cid && sid) {
      dispatch(fetchModules({ cid, sid }));
    }
  }, [dispatch, cid, sid]);

  // Auto-select the first module if no module is selected
  useEffect(() => {
    if (!selectedModule && modulesData?.length > 0) {
      dispatch(
        setSelectedModule({
          moduleId: modulesData[0]._id,
          name: modulesData[0].moduleName,
          chapters: modulesData[0].chapters,
        })
      );
    }
  }, [dispatch, selectedModule, modulesData]);

  const handleToggle = (chapterNumber) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterNumber)
        ? prev.filter((number) => number !== chapterNumber)
        : [...prev, chapterNumber]
    );
  };

  const openAddChapter = () => {
    setSidebarContent("chapter");
    setIsSidebarOpen(true);
  };

  const openAddModule = () => {
    setSidebarContent("module");
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
    setSidebarContent(null);
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

  const handleEditModule = (module) => {
    setSidebarContent(
      <AddModule
        data={module}
        onClose={() => {
          handleSidebarClose();
          dispatch(fetchModules()); // Refetch after editing a module
        }}
      />
    );
    setIsSidebarOpen(true);
  };

  const handleMoveModule = (module) => {
    if (!selectedModule || !selectedModule.moduleId) {
      toast.error("No module selected to move.");
      return;
    }

    const currentIndex = modulesData?.findIndex(
      (mod) => mod._id === module._id
    );

    setSidebarContent(
      <MoveModule
        moduleId={selectedModule.moduleId} // Ensure selectedModule exists
        currentPosition={currentIndex}
        modulesData={modulesData}
        onClose={handleSidebarClose}
      />
    );
    setIsSidebarOpen(true);
  };

  const handleEditChapter = (chapter) => {
    setSidebarContent(
      <AddChapter
        chapterData={chapter}
        isEditing={true}
        onClose={handleSidebarClose}
      />
    );
    setIsSidebarOpen(true);
  };

  return (
    <div className="flex min-h-screen">
      <SubjectSideBar />
      <div className="w-[60%] bg-white p-2 border-l">
        <div className="bg-white p-2 rounded-lg">
          <div className="flex justify-between px-4 mb-3 items-center">
            <h1 className="text-lg font-semibold">
              {selectedModule?.name ? selectedModule.name : "Select a Module"}
            </h1>
            {selectedModule?.name && (
              <button
                onClick={openAddChapter}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
              >
                <span className="text-gradient">+ Add Chapter</span>
              </button>
            )}
          </div>
          {chapterLoading ? (
            <Spinner />
          ) : error ? (
            <NoDataFound />
          ) : selectedModule?.chapters &&
            selectedModule?.chapters.length > 0 ? (
            selectedModule?.chapters?.map((chapter, index) => (
              <Chapter
                key={index}
                chapterNumber={index + 1}
                chapter={chapter}
                isExpanded={expandedChapters.includes(index + 1)}
                onToggle={() => handleToggle(index + 1)}
                onEdit={() => handleEditChapter(chapter)}
              />
            ))
          ) : (
            <NoDataFound title="Chapter" />
          )}
        </div>
      </div>
      <div className="w-[35%] p-2 border">
        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center gap-1 mb-2">
            <h1 className="text-xl font-semibold">All Modules</h1>
            <p className="bg-gradient-to-r from-pink-100 flex justify-center items-center to-purple-200 font-semibold rounded-full w-6 h-6">
              <span className="text-gradient">{modulesData?.length}</span>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {modulesData?.map((module) => (
              <ModuleCard
                module={module}
                onSelect={() => handleModuleSelect(module)}
                onEdit={() => handleEditModule(module)}
                onMove={() => handleMoveModule(module)}
              />
            ))}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={openAddModule}
            className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4 transform transition-transform duration-300 hover:scale-110"
            aria-label="Add Module"
          >
            <RiAddFill size={24} />
          </button>
          <span className="absolute bottom-14 right-1/2 transform translate-x-1/2 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none">
            Add Module
          </span>
        </div>

        {isSidebarOpen && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={
              sidebarContent === "chapter"
                ? "Add New Chapter"
                : sidebarContent === "module"
                ? "Add New Module"
                : "Edit Module"
            }
          >
            {sidebarContent === "chapter" ? (
              <AddChapter onClose={handleSidebarClose} />
            ) : sidebarContent === "module" ? (
              <AddModule onClose={handleSidebarClose} />
            ) : (
              sidebarContent
            )}
          </Sidebar>
        )}
      </div>
    </div>
  );
};

export default MainSection;
