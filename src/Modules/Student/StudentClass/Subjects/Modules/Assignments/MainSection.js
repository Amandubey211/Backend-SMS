import React, { useState } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import AssignmentDetailCard from "./AssignmentComponents/AssignmentDetailCard";
import AssignmentSection from "./AssignmentComponents/AssignmentSection";
import AssignmentHeader from "./AssignmentComponents/AssignmentHeader";


const MainSection = () => {
  const [isSubmitted,setIsSubmitted]=useState(false)
  const handleFormSubmit = () => {
    setIsSubmitted(true);
  };
  return (
    <div className="flex  ">
      <SubjectSideBar />
      <div className="w-[65%] border">
     {/* <AssignmentHeader/> */}
        <AssignmentSection isSubmitted={isSubmitted}  onFormSubmit={handleFormSubmit} />
      </div>
      <div className="w-[30%]">
        <AssignmentDetailCard isSubmitted={isSubmitted}/>
      </div>
    </div>
  );
};

export default MainSection;
