import React, { useState, useEffect } from "react";
import Chapter from "./Components/Chapter";
import dummyData from "./Components/Data/DummyData";
import ModuleCard from "./Components/ModuleCard";
import dummyModules from "./Components/Data/DummyModules";
import Spinner from "../../../Components/Common/Spinner"; // Ensure correct path to the Spinner component
import { RiAddFill } from "react-icons/ri";

const ProgressChild = () => {
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Simulating data fetching process
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate an API call with a timeout
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // You can replace this with your actual data fetching logic
    };

    fetchData();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner /> {/* Display the spinner while loading */}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-[60%] bg-white p-2 border-l">
        <div className="bg-white p-2 rounded-lg">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-md font-semibold">Business Entrepreneurship</h1>
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
            <p className="bg-gradient-to-r from-pink-100 to-purple-200 font-semibold rounded-full p-1 px-2">
              <span className="text-gradient"> 06 </span>
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
      </div>
    </div>
  );
};

export default ProgressChild;
