import React from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import AssignmentDetailCard from "./AssignmentComponents/AssignmentDetailCard";
import AssignmentSection from "./AssignmentComponents/AssignmentSection";
import AssignmentHeader from "./AssignmentComponents/AssignmentHeader";


const MainSection = () => {
  return (
    <div className="flex  ">
      <SubjectSideBar />
      <div className="w-[65%] border">
     <AssignmentHeader/>
        <AssignmentSection />
      </div>
      <div className="w-[30%]">
        <AssignmentDetailCard />
      </div>
    </div>
  );
};

export default MainSection;
