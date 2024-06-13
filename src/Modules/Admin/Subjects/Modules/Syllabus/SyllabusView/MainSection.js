import React from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import SyllabusHeader from "./Components/SyllabusHeader";
import SyllabusSection from "./Components/SyllabusSection";


const MainSection = () => {
    
  return (
    <div className="flex  ">
      <SubjectSideBar />
      <div className="border-l w-full p-4">
        <SyllabusHeader />
        <SyllabusSection/>

      </div>
    </div>
  );
};

export default MainSection;
