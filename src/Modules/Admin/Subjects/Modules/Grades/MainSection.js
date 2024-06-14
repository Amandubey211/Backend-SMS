import React from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import GradeHeader from "./Component/GradeHeader";
import StudentTable from "./Component/StudentTable";

const MainSection = () => {
  return (
    <div className="flex ">
      <SubjectSideBar />
      <div className="border-l w-full">
        <GradeHeader />
        <div className="">
            <StudentTable/>

        </div>
      </div>
    </div>
  );
};

export default MainSection;
