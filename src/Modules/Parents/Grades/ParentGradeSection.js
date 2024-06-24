import React, { useState } from "react";
// import SubjectSideBar from "../../Component/SubjectSideBar";
import Chapter from "./Components/Chapter";
import dummyData from "./Components/Data/DummyData";
import ModuleCard from "./Components/ModuleCard";
import dummyModules from "./Components/Data/DummyModules";
// import Sidebar from "../../../../../Components/Common/Sidebar";
// import AddModule from "./Components/AddModule";
// import AddChapter from "./Components/AddChapter";
import { RiAddFill } from "react-icons/ri";

const ParentGradeSection = () => {
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);

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

  // const handleSidebarClose = () => {
  //   setIsSidebarOpen(false);
  //   setSidebarContent(null);
  // };

  return (
    <div className="flex  min-h-screen">
      {/* <SubjectSideBar /> */}
      <div className="w-[60%] bg-white p-2  border-l">
        <div className="bg-white p-2 rounded-lg">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-md font-semibold">Business Entrepreneurship</h1>

            {/* <button
              onClick={openAddChapter}
              className="px-4 py-2 rounded-md  bg-gradient-to-r from-pink-100 to-purple-200"
            >
              <span className="text-gradient"> + Add Chapter</span>
            </button> */}
          </div>
          {dummyData.map((chapter, index) => (
            <Chapter
              key={index}
              title={chapter.title}
              chapterNumber={chapter.chapterNumber}
              imageUrl={chapter.imageUrl}
              items={chapter.items}
              isExpanded={expandedChapters.includes(chapter.chapterNumber)}
              onToggle={() => handleToggle(chapter.chapterNumber)}
            />
          ))}
        </div>
      </div>
      <div className="w-[35%] p-2 border">
        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center gap-1 mb-2">
            <h1 className="text-xl font-semibold">All Modules</h1>

            <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full p-1 px-2 ">
              {" "}
              <span className="text-gradient"> 06 </span>{" "}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {dummyModules.map((module, index) => (
              <ModuleCard
                key={index}
                title={module.title}
                moduleNumber={module.moduleNumber}
                imageUrl={module.imageUrl}
                isCompleted={module.isCompleted}
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
        {/* {isSidebarOpen && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={
              sidebarContent === "chapter"
                ? "Add New Chapter"
                : "Add New Module"
            }
          >
            {sidebarContent === "chapter" ? <AddChapter /> : <AddModule />}
          </Sidebar>
        )} */}
      </div>
    </div>
  );
};

export default ParentGradeSection;
