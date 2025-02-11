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
        <div className="border border-gray-300 bg-white mt-5">
          {/* Table Header Wrapper - Static Header */}
          <div className="overflow-hidden">
            <table className="w-full text-gray-700 text-sm">
              <thead className="bg-gray-100 sticky top-0 shadow-md">
                <tr className="text-left">
                  <th className="p-2 border w-[25%]">Student</th>
                  <th className="p-2 border w-[15%]">Type</th>
                  <th className="p-2 border w-[15%]">Obtained Marks</th>
                  <th className="p-2 border w-[15%]">Max Marks</th>
                  <th className="p-2 border w-[15%]">Exam Date</th>
                  <th className="p-2 border w-[15%]">Status</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Scrollable Body Wrapper */}
          <div className="max-h-[400px]">
            <table className="w-full text-gray-700 text-sm">
              <tbody>
                {students?.map((student, index) => (
                  <OfflineExamViewCard
                    key={index}
                    student={student}
                    examType={examType}
                    startDate={startDate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineExamView;
