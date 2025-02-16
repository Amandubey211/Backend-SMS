import React, { useState } from "react";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import { useLocation } from "react-router-dom";
import OfflineExamViewCard from "./OfflineExamViewCard";
import { CiSearch } from "react-icons/ci";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

const OfflineExamView = () => {
  const location = useLocation();
  const { examName, students, examType, startDate } = location.state;
  const [searchQuery, setSearchQuery] = useState("");

  console.log("data", examName, students, examType, startDate);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex ">
      <SubjectSideBar />
      <div className="p-4  w-full pr-4">
      <ProtectedSection title={'Exam View'} requiredPermission={PERMISSIONS.SHOW_ALL_EXAMS}>
        <div className="flex gap-7 items-center">
          <h2 className="text-xl font-semibold">
            {examName}
            <span className="border-none rounded-full text-sm p-1 px-2 ml-1 text-purple-600 bg-purple-100">
              {students?.length}
            </span>
          </h2>
          <div className="relative flex items-center max-w-xs w-full mr-4">
            <input
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={handleSearchChange}
              className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
            />
            <button className="absolute right-3">
              <CiSearch className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="border border-gray-300 bg-white mt-5">
          {/* Table Header Wrapper */}
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
        </ProtectedSection>
      </div>
    </div>
  );
};

export default OfflineExamView;
