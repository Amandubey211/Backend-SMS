import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubjectSideBar from "../../Component/SubjectSideBar";
import Chapter from "./Components/Chapter";
import ModuleCard from "./Components/ModuleCard";
import Sidebar from "../../../../../Components/Common/Sidebar";
import AddModule from "./Components/AddModule";
import { RiAddFill } from "react-icons/ri";
import MoveModule from "./Components/MoveModule";
import AddChapter from "./Components/AddChapter";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
import { fetchModules } from "../../../../../Store/Slices/Admin/Class/Module/moduleThunk";
import { setSelectedModule } from "../../../../../Store/Slices/Admin/Class/Module/moduleSlice";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaBookOpen } from "react-icons/fa";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import ProtectedAction from "../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../config/permission";

// Ant Design
import { Skeleton } from "antd";

const ChapterShimmer = () => {
  return (
    <div className="p-1 rounded-lg border-b mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Skeleton.Avatar active size={48} shape="square" className="mr-4" /> {/* Matches w-12 h-12 */}
          <div className="flex flex-col">
            <Skeleton.Input active style={{ width: 150, height: 16 }} className="mb-1" /> {/* Title */}
            <Skeleton.Input active style={{ width: 100, height: 14 }} /> {/* Subtitle */}
          </div>
        </div>
        <Skeleton.Button active size="small" shape="circle" style={{ width: 32, height: 32 }} /> {/* Button */}
      </div>
    </div>
  );
};

const ModuleCardShimmer = () => {
  return (
    <div className="mb-4 border border-gray-200 rounded-lg">
      {/* Image Placeholder */}
      <Skeleton
        active
        paragraph={false}
        title={{ style: { height: 144, margin: 0, borderRadius: "8px 8px 0 0" } }}
      />
      {/* Content Section */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Skeleton.Input active style={{ width: 150, height: 18 }} /> {/* Title */}
          <div className="flex gap-2">
            <Skeleton.Avatar active size={32} shape="circle" /> {/* Icon 1 */}
            <Skeleton.Avatar active size={32} shape="circle" /> {/* Icon 2 */}
          </div>
        </div>
        <Skeleton.Button active style={{ width: 80, height: 24 }} className="rounded-full" /> {/* Module Number */}
      </div>
    </div>
  );
};
// Shimmer Component for NoDataFound
const NoDataFoundShimmer = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Skeleton.Avatar active size={48} shape="circle" className="sm:size-64" />
      <Skeleton.Input
        active
        style={{ width: "70%", minWidth: 150, marginTop: 12 }}
        className="sm:mt-16"
      />
      <Skeleton.Input
        active
        style={{ width: "90%", minWidth: 200, marginTop: 6 }}
        className="sm:mt-8"
      />
    </div>
  );
};

const MainSection = () => {
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const { sid, cid } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation("admClass");

  const {
    selectedModule,
    modules: modulesData,
    error,
    moduleLoading,
    chapterLoading,
  } = useSelector((state) => state.admin.module);

  useEffect(() => {
    const fetchAndSetModules = async () => {
      if (cid && sid) {
        const resultAction = await dispatch(fetchModules({ cid, sid }));

        if (fetchModules.fulfilled.match(resultAction)) {
          const modules = resultAction.payload;

          if (modules?.length > 0) {
            dispatch(
              setSelectedModule({
                moduleId: modules[0]._id,
                name: modules[0].moduleName,
                chapters: modules[0].chapters,
              })
            );
          } else {
            dispatch(setSelectedModule(null));
          }
        } else {
          console.error("Failed to fetch modules:", resultAction.payload);
        }
      }
    };

    fetchAndSetModules();
  }, [dispatch, cid, sid]);

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
          dispatch(fetchModules());
        }}
      />
    );
    setIsSidebarOpen(true);
  };

  const handleMoveModule = (module) => {
    if (!selectedModule || !selectedModule?.moduleId) {
      toast.error(t("No module selected to move."));
      return;
    }

    const currentIndex = modulesData?.findIndex(
      (mod) => mod._id === module?._id
    );

    setSidebarContent(
      <MoveModule
        moduleId={selectedModule.moduleId}
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
    <div className="flex flex-col sm:flex-row min-h-screen h-full w-full">
      {/* SubjectSideBar - Assuming it's responsive or hidden on small screens */}
      <SubjectSideBar className="w-full sm:w-64 sm:flex-shrink-0" />

      <ProtectedSection
        requiredPermission={PERMISSIONS.MODULES_FOR_A_STUDENT_MODULES}
        title="Module"
        className="flex-1"
      >
        {moduleLoading ? (
          <div className="flex flex-col lg:flex-row w-full min-h-screen">
  {/* Left Column Shimmer (Chapters) */}
  <div className="w-full lg:w-[60%] bg-white p-2 sm:p-3">
    <div className="bg-white p-2 sm:p-3 rounded-lg">
      <div className="flex justify-between px-2 sm:px-4 mb-3 items-center">
        <Skeleton.Input active style={{ width: "50%", minWidth: 150 }} />
        <Skeleton.Button active style={{ width: "30%", minWidth: 80 }} />
      </div>
      {/* Mimic a few chapters */}
      <div className="space-y-2">
        {[1, 2,3,4].map((_, index) => (
          <ChapterShimmer key={index} />
        ))}
      </div>
    </div>
  </div>

  {/* Right Column Shimmer (Modules) */}
  <div className="w-full lg:w-[35%] min-h-[50vh] lg:min-h-screen p-2 sm:p-3 border-t lg:border-t-0 lg:border-l">
    <div className="bg-white p-3 sm:p-4 rounded-lg">
      <div className="flex items-center gap-1 mb-2">
        <Skeleton.Input active style={{ width: "40%", minWidth: 120 }} />
        <Skeleton.Avatar active size={24} shape="circle" />
      </div>
      <div className="grid grid-cols-1 gap-2">
        {[1, 2, 3].map((_, index) => (
          <ModuleCardShimmer key={index} />
        ))}
      </div>
    </div>
  </div>
</div>
        ) : modulesData?.length === 0 ? (
          // If no modules, show a single NoDataFound centered both horizontally and vertically
          <div className="flex items-center justify-center w-full min-h-screen p-4">
            {moduleLoading ? (
              <NoDataFoundShimmer />
            ) : (
              <NoDataFound
                title="Modules"
                desc={t(
                  "No modules available yet! Start by adding your first module."
                )}
                icon={FaBookOpen}
                iconColor="text-blue-500"
                textColor="text-gray-600"
                className="text-center"
              />
            )}
          </div>
        ) : (
          // Otherwise, render two-column layout for modules and chapters
          <div className="flex flex-col lg:flex-row w-full">
            {/* Left Section: Chapters */}
            <div className="w-full lg:w-[60%] bg-white p-2 sm:p-3">
              <div className="bg-white p-2 sm:p-3 rounded-lg">
                <div className="flex justify-between px-2 sm:px-4 mb-3 items-center">
                  <h1 className="text-base sm:text-lg font-semibold capitalize">
                    {selectedModule?.name
                      ? selectedModule.name
                      : t("Select a Module")}
                  </h1>
                  {selectedModule?.name && (
                    <ProtectedAction
                      requiredPermission={PERMISSIONS.ADD_CHAPTER}
                    >
                      <button
                        onClick={openAddChapter}
                        className="px-3 sm:px-4 py-1 sm:py-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-200 text-sm sm:text-base"
                      >
                        <span className="text-gradient">
                          {t("+ Add Chapter")}
                        </span>
                      </button>
                    </ProtectedAction>
                  )}
                </div>

                {chapterLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((_, index) => (
                      <ChapterShimmer key={index} />
                    ))}
                  </div>
                ) : selectedModule?.chapters?.length > 0 ? (
                  selectedModule?.chapters?.map((chapter, index) => (
                    <Chapter
                      key={index}
                      chapterNumber={index + 1}
                      chapter={chapter}
                      isExpanded={expandedChapters.includes(index + 1)}
                      onToggle={() => handleToggle(index + 1)}
                      onEdit={() => handleEditChapter(chapter)}
                      className="p-3 sm:p-4"
                    />
                  ))
                ) : (
                  // Centering NoDataFound for chapters when none exist
                  <div className="flex items-center justify-center min-h-[150px] sm:min-h-[200px] p-4">
                    {chapterLoading ? (
                      <NoDataFoundShimmer />
                    ) : (
                      <NoDataFound
                        title={t("Chapter")}
                        desc={t(
                          "No chapters available in this module yet! Start by adding your first chapter."
                        )}
                        icon={FaBookOpen}
                        iconColor="text-green-500"
                        textColor="text-gray-600"
                        className="text-center"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Section: Modules List */}
            <div className="w-full lg:w-[35%] min-h-[50vh] lg:min-h-screen p-2 sm:p-3 border-t lg:border-t-0 lg:border-l">
              <div className="bg-white p-3 sm:p-4 rounded-lg">
                <div className="flex items-center gap-1 mb-2">
                  <h1 className="text-lg sm:text-xl font-semibold">
                    {t("All Modules")}
                  </h1>
                  <p className="bg-gradient-to-r from-pink-100 flex justify-center items-center to-purple-200 font-semibold rounded-full w-5 h-5 sm:w-6 sm:h-6 mt-1.5">
                    <span className="text-gradient text-xs sm:text-sm">
                      {modulesData?.length}
                    </span>
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {modulesData?.map((module) => (
                    <ModuleCard
                      key={module._id}
                      module={module}
                      onSelect={() => handleModuleSelect(module)}
                      onEdit={() => handleEditModule(module)}
                      onMove={() => handleMoveModule(module)}
                      className="p-3 sm:p-4"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Add Module Button (always accessible) */}
        <div className="relative">
          <ProtectedAction requiredPermission={PERMISSIONS.ADD_MODULE}>
            <button
              onClick={openAddModule}
              className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-3 sm:p-4 fixed rounded-full shadow-md bottom-3 sm:bottom-4 right-3 sm:right-4 transform transition-transform duration-300 hover:scale-110"
              aria-label={t("Add Module")}
            >
             <RiAddFill size={24} />
            </button>
          </ProtectedAction>

          <span className="absolute bottom-12 sm:bottom-14 right-1/2 transform translate-x-1/2 bg-black text-white text-xs sm:text-sm p-1 sm:p-2 rounded opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none">
            {t("Add Module")}
          </span>
        </div>

        {/* Sidebar for Adding/Editing Modules or Chapters */}
        {isSidebarOpen && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={
              sidebarContent === "chapter"
                ? t("Add New Chapter")
                : sidebarContent === "module"
                ? t("Add New Module")
                : t("Edit Module")
            }
            className="w-full sm:w-96"
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
      </ProtectedSection>
    </div>
  );
};

export default MainSection;