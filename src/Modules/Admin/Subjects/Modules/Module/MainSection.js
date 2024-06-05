import React, { useState } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import Chapter from "./Components/Chapter";
import dummyData from "./Components/Data/DummyData";
import ModuleCard from "./Components/ModuleCard";
import dummyModules from "./Components/Data/DummyModules";
import { FaPlus } from 'react-icons/fa';
import Sidebar from "../../../../../Components/Common/Sidebar";
import AddModule from "./Components/AddModule";
import AddChapter from "./Components/AddChapter";

const MainSection = () => {
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
    setSidebarContent('chapter');
    setIsSidebarOpen(true);
  };

  const openAddModule = () => {
    setSidebarContent('module');
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
    setSidebarContent(null);
  };

  return (
    <div className="flex  min-h-screen">
      <SubjectSideBar />
      <div className="w-[60%] bg-white p-4 rounded-lg shadow-md">
        <div className="bg-white p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold">Business Entrepreneurship</h1>
            <button
              onClick={openAddChapter}
              className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-md shadow"
            >
              + Add Chapter
            </button>
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
            <div className="text-purple-600 text-sm text-center font-semibold bg-purple-100 rounded-full p-1 px-2">06</div>
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
          <FaPlus />
        </button>
        {isSidebarOpen && (
          <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} title={sidebarContent === 'chapter' ? "Add New Chapter" : "Add New Module"}>
            {sidebarContent === 'chapter' ? <AddChapter /> : <AddModule />}
          </Sidebar>
        )}
      </div>
    </div>
  );
};

export default MainSection;
