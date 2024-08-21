import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubjectSideBar from "../../Component/SubjectSideBar";
import Chapter from "./Components/Chapter";
import ModuleCard from "./Components/ModuleCard";
import Sidebar from "../../../../../Components/Common/Sidebar";
import AddModule from "./Components/AddModule";
import { RiAddFill } from "react-icons/ri";
import { setSelectedModule } from "../../../../../Redux/Slices/Common/CommonSlice";
import useGetModulesForStudent from "../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useGetModulesForStudent";
import MoveModule from "./Components/MoveModule";
import AddChapter from "./Components/AddChapter";
// import DeleteModal from "../../../../../Components/Common/DeleteModal";
// import toast from "react-hot-toast";
import Spinner from "../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
// import useDeleteModule from "../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useDeleteModule";

const MainSection = () => {
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [deleteTarget, setDeleteTarget] = useState(null);

  const dispatch = useDispatch();
  const selectedModule = useSelector((state) => state.Common.selectedModule);
  const { error, fetchModules, loading, modulesData } =
    useGetModulesForStudent();

  // const { deleteModule } = useDeleteModule();

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const handleToggle = (chapterNumber) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterNumber)
        ? prev.filter((number) => number !== chapterNumber)
        : [...prev, chapterNumber]
    );
  };

  const openAddChapter = () => {
    setSidebarContent(
      <AddChapter
        onClose={() => {
          handleSidebarClose();
          fetchModules(); // Refetch after adding a chapter
        }}
      />
    );
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
          fetchModules(); // Refetch after editing a module
        }}
      />
    );
    setIsSidebarOpen(true);
  };

  const handleMoveModule = (module) => {
    const currentIndex = modulesData.modules.findIndex(
      (mod) => mod._id === module._id
    );

    setSidebarContent(
      <MoveModule
        moduleId={selectedModule.moduleId}
        currentPosition={currentIndex}
        modulesData={modulesData}
        onClose={handleSidebarClose} // Ensure proper closing
      />
    );
    setIsSidebarOpen(true);
  };

  // const handleDelete = (target) => {
  //   setDeleteTarget(target);
  //   setIsDeleteModalOpen(true);
  // };

  // const confirmDelete = async () => {
  //   if (deleteTarget.type === "Module") {
  //     try {
  //       await deleteModule(deleteTarget.id);
  //       toast.success(`${deleteTarget.type} deleted successfully!`);
  //       setIsDeleteModalOpen(false); // Close the modal after successful deletion
  //       setDeleteTarget(null);
  //       fetchModules(); // Refresh the modules list after deletion
  //     } catch (error) {
  //       toast.error("Failed to delete module");
  //     }
  //   }
  // };

  const handleModuleAdded = useCallback(() => {
    fetchModules();
  }, [fetchModules]);

  const handleEditChapter = (chapter) => {
    setSidebarContent(
      <AddChapter
        fetchModules={fetchModules}
        chapterData={chapter}
        isEditing={true}
        onClose={() => {
          handleSidebarClose();
          fetchModules();
        }}
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
          {loading ? (
            <Spinner />
          ) : error ? (
            <NoDataFound />
          ) : selectedModule.chapters && selectedModule.chapters.length > 0 ? (
            selectedModule.chapters.map((chapter, index) => (
              <Chapter
                key={index}
                title={chapter.name}
                chapterNumber={index + 1}
                chapterId={chapter._id}
                moduleId={selectedModule.moduleId}
                imageUrl={chapter.thumbnail}
                assignments={chapter.assignments}
                quizzes={chapter.quizzes}
                attachments={chapter.attachments} // Pass attachments to Chapter
                isExpanded={expandedChapters.includes(index + 1)}
                onToggle={() => handleToggle(index + 1)}
                // onDelete={() =>
                //   handleDelete({
                //     type: "Chapter",
                //     name: chapter.name,
                //     id: chapter._id,
                //     moduleId: selectedModule.moduleId,
                //   })
                // }
                onEdit={() => handleEditChapter(chapter)}
                fetchModules={fetchModules} // Pass fetchModules for re-fetching
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
              <span className="text-gradient">
                {modulesData?.modules.length}
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
                moduleId={module._id}
                isPublished={true}
                isSelected={
                  selectedModule && selectedModule.moduleId === module._id
                }
                onSelect={() => handleModuleSelect(module)}
                onEdit={() => handleEditModule(module)}
                onMove={() => handleMoveModule(module)}
                // onDelete={() =>
                //   handleDelete({
                //     type: "Module",
                //     name: module.moduleName,
                //     id: module._id,
                //   })
                // }
                fetchModules={fetchModules}
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
              <AddChapter
                onClose={() => {
                  handleSidebarClose();
                  fetchModules();
                }}
              />
            ) : sidebarContent === "module" ? (
              <AddModule
                onClose={() => {
                  handleSidebarClose();
                  fetchModules();
                }}
                onModuleAdded={handleModuleAdded}
              />
            ) : (
              sidebarContent
            )}
          </Sidebar>
        )}
        {/* {isDeleteModalOpen && (
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title={deleteTarget ? deleteTarget.name : "delete"}
          />
        )} */}
      </div>
    </div>
  );
};

export default MainSection;
