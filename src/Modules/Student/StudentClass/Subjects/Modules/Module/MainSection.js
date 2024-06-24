import React, { useState } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import Chapter from "./Components/Chapter";
import dummyData from "./Components/Data/DummyData";
import ModuleCard from "./Components/ModuleCard";
import dummyModules from "./Components/Data/DummyModules";


const MainSection = () => {
  const [expandedChapters, setExpandedChapters] = useState([]);
  

  const handleToggle = (chapterNumber) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterNumber)
        ? prev.filter((number) => number !== chapterNumber)
        : [...prev, chapterNumber]
    );
  };


  return (
    <div className="flex  min-h-screen">
      <SubjectSideBar />
      <div className="w-[60%] bg-white p-2  border-l">
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
        
      </div>
    </div>
  );
};

export default MainSection;
