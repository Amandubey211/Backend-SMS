import React from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import { useLocation } from "react-router-dom";
import OfflineExamViewCard from "./OfflineExamViewCard";

const OfflineExamView = () => {
  const location = useLocation();
  const { examName, students, examType, startDate } = location.state;

  console.log("data", examName, students, examType, startDate);
  
  return (
    <div className="flex ">
      <SubjectSideBar />
      <div className="p-2 bg-white w-full pr-4">
        {/* <h2 className="text-xl ps-2 font-semibold mb-3"></h2> */}
        <h2 className="text-xl ps-2 font-semibold mb-3">
          {examName}
          <span className="border-none rounded-full text-sm p-1 px-2 ml-1 text-purple-600 bg-purple-100">
            {students?.length}
          </span>
        </h2>
        {students?.map((student) => (
          <OfflineExamViewCard student={student} examType={examType} startDate={startDate} />
        ))}
      </div>
    </div>
  );
};

export default OfflineExamView;
