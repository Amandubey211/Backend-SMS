import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubjectSideBar from "../../Component/SubjectSideBar";
import Chapter from "./Components/Chapter";
import ModuleCard from "./Components/ModuleCard";
import Sidebar from "../../../../../Components/Common/Sidebar";
import AddModule from "./Components/AddModule";
// import AddChapter from "./Components/AddChapter";
import { RiAddFill } from "react-icons/ri";
import { setSelectedModule } from "../../../../../Redux/Slices/Common/CommonSlice";
import useGetModulesForStudent from "../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useGetModulesForStudent";
import MoveModule from "./Components/MoveModule";

const MainSection = () => {
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMoveSidebarOpen, setIsMoveSidebarOpen] = useState(false); // New state for move sidebar
  const [sidebarContent, setSidebarContent] = useState(null);
  const dispatch = useDispatch();
  const selectedModule = useSelector((state) => state.Common.selectedModule);
  const { error, fetchModules, loading, modulesData } =
    useGetModulesForStudent();

  useEffect(() => {
    // Fetch modules data
    fetchModules();
  }, [fetchModules]);

  useEffect(() => {
    // Set the first module as the default selected module when modulesData is updated
    if (modulesData && modulesData.modules.length > 0) {
      dispatch(
        setSelectedModule({
          moduleId: modulesData.modules[0]._id,
          name: modulesData.modules[0].name,
          chapters: modulesData.modules[0].chapters,
        })
      );
    }
  }, [dispatch, modulesData]);

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

  const handleMoveSidebarClose = () => {
    setIsMoveSidebarOpen(false);
  };

  const handleModuleSelect = (module) => {
    dispatch(
      setSelectedModule({
        moduleId: module._id,
        name: module.name,
        chapters: module.chapters,
      })
    );
    setExpandedChapters([]);
  };

  const handleEditModule = (module) => {
    setSidebarContent(<AddModule data={module} />);
    setIsSidebarOpen(true);
  };

  const handleMoveModule = () => {
    setSidebarContent(<MoveModule />);
    setIsMoveSidebarOpen(true);
  };

  return (
    <div className="flex min-h-screen">
      <SubjectSideBar />

      <div className="w-[60%] bg-white p-2 border-l">
        <div className="bg-white p-2 rounded-lg">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-md font-semibold">
              {selectedModule.name ? selectedModule.name : "Select a Module"}
            </h1>

            {selectedModule.name && (
              <button
                onClick={openAddChapter}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
              >
                <span className="text-gradient">+ Add Chapter</span>
              </button>
            )}
          </div>
          {selectedModule.chapters && selectedModule.chapters.length > 0 ? (
            selectedModule.chapters.map((chapter, index) => (
              <Chapter
                key={index}
                title={chapter.name}
                chapterNumber={index + 1}
                imageUrl={chapter.thumbnail}
                items={chapter.items}
                isExpanded={expandedChapters.includes(index + 1)}
                onToggle={() => handleToggle(index + 1)}
              />
            ))
          ) : (
            <p>Select a module to view its chapters.</p>
          )}
        </div>
      </div>
      <div className="w-[35%] p-2 border">
        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center gap-1 mb-2">
            <h1 className="text-xl font-semibold">All Modules</h1>

            <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full p-1 px-2">
              <span className="text-gradient">
                {modulesData?.modules.length}
              </span>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {modulesData?.modules.map((module, index) => (
              <ModuleCard
                key={index}
                title={module.name}
                moduleNumber={index + 1}
                imageUrl={module.thumbnail}
                moduleId={module._id}
                isPublished={false} // Update this based on your logic
                isSelected={
                  selectedModule && selectedModule.moduleId === module._id
                }
                onSelect={() => handleModuleSelect(module)}
                onEdit={() => handleEditModule(module)}
                onMove={() => handleMoveModule(module)}
              />
            ))}
          </div>
        </div>
        <button
          onClick={openAddModule}
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
        >
          <RiAddFill size={24} />
        </button>
        {isSidebarOpen && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={
              sidebarContent === "chapter"
                ? "Add New Chapter"
                : "Add New Module"
            }
          >
            {sidebarContent}
          </Sidebar>
        )}
        {isMoveSidebarOpen && (
          <Sidebar
            isOpen={isMoveSidebarOpen}
            onClose={handleMoveSidebarClose}
            title="Move Module"
          >
            <MoveModule />{" "}
          </Sidebar>
        )}
      </div>
    </div>
  );
};

export default MainSection;
