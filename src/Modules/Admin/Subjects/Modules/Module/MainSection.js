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
import DeleteModal from "../../../../../Components/Common/DeleteModal";
import toast from "react-hot-toast";
import Spinner from "../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
import useAddModule from "../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useAddModule";
import useDeleteModule from "../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useDeleteModule";

const MainSection = () => {
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMoveSidebarOpen, setIsMoveSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const dispatch = useDispatch();
  const selectedModule = useSelector((state) => state.Common.selectedModule);
  const { error, fetchModules, loading, modulesData } =
    useGetModulesForStudent();

  const { addModule } = useAddModule(fetchModules);
  const { deleteModule } = useDeleteModule(fetchModules);

  // Fetch modules on component mount
  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  // Update selected module when modulesData changes
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

  const handleMoveSidebarClose = () => {
    setIsMoveSidebarOpen(false);
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

  const handleMoveModule = () => {
    setSidebarContent(<MoveModule />);
    setIsMoveSidebarOpen(true);
  };

  const handleDelete = (target) => {
    setDeleteTarget(target);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget.type === "Module") {
      const result = await deleteModule(deleteTarget.id);
      if (result.success) {
        toast.success(`${deleteTarget.type} deleted successfully!`);
        setIsDeleteModalOpen(false); // Close the modal on successful deletion
        setDeleteTarget(null);
        fetchModules(); // Refetch modules after successful deletion
      } else {
        toast.error(`Failed to delete ${deleteTarget.type}.`);
      }
    }
  };

  const handleModuleAdded = useCallback(() => {
    fetchModules(); // Refetch modules after adding a module
  }, [fetchModules]);

  // Handle editing a chapter
  const handleEditChapter = (chapter) => {
    setSidebarContent(
      <AddChapter
        chapterData={chapter}
        isEditing={true}
        onClose={() => {
          handleSidebarClose();
          fetchModules(); // Refetch after editing a chapter
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
                isExpanded={expandedChapters.includes(index + 1)}
                onToggle={() => handleToggle(index + 1)}
                onDelete={() =>
                  handleDelete({
                    type: "Chapter",
                    name: chapter.name,
                    id: chapter._id,
                    moduleId: selectedModule.moduleId,
                  })
                }
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
                isPublished={module.isPublished}
                isSelected={
                  selectedModule && selectedModule.moduleId === module._id
                }
                onSelect={() => handleModuleSelect(module)}
                onEdit={() => handleEditModule(module)}
                onMove={() => handleMoveModule(module)}
                onDelete={() =>
                  handleDelete({
                    type: "Module",
                    name: module.moduleName,
                    id: module._id,
                  })
                }
                fetchModules={fetchModules}
              />
            ))}
          </div>
        </div>
        <button
          onClick={openAddModule}
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4"
          aria-label="Add Module"
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
                : sidebarContent === "module"
                ? "Add New Module"
                : "Edit Module"
            }
          >
            {sidebarContent === "chapter" ? (
              <AddChapter
                onClose={() => {
                  handleSidebarClose();
                  fetchModules(); // Refetch after closing the sidebar
                }}
              />
            ) : sidebarContent === "module" ? (
              <AddModule
                onClose={() => {
                  handleSidebarClose();
                  fetchModules(); // Refetch after closing the sidebar
                }}
                onModuleAdded={handleModuleAdded}
              />
            ) : (
              sidebarContent
            )}
          </Sidebar>
        )}
        {isMoveSidebarOpen && (
          <Sidebar
            isOpen={isMoveSidebarOpen}
            onClose={handleMoveSidebarClose}
            title="Move Module"
          >
            <MoveModule />
          </Sidebar>
        )}
        {isDeleteModalOpen && (
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title={deleteTarget ? deleteTarget.name : ""}
          />
        )}
      </div>
    </div>
  );
};

export default MainSection;
