import React from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { useState } from "react";
import data from "../OfflineExam/data.json";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
import { FaClipboardList } from "react-icons/fa";
import Spinner from "../../../../../Components/Common/Spinner";
import OfflineExamCard from "./Components/OfflineExamCard";
import CreateButton from "./Components/CreateButton";
import Header from "./Components/Header";
import UploadAndFilter from "./Components/UploadAndFilter";

const MainSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // const [filters, setFilters] = useState({ examType: "", startDate: "" });
  const loading = false;

  return (
    <div className="flex h-full w-full">
      <SubjectSideBar />
      <ProtectedSection title="All Offline Exams">
        <div className="flex pt-4">
          {/* Left Section */}
          <div className="w-[65%] border-l">
            <Header
              data={data}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <ul className="border-t mt-4 mx-4"></ul>

            {/* Offline Exam Card */}
            {loading ? (
              <Spinner />
            ) : data?.length ? (
              <div>
                {data?.map((item, index) => (
                  <OfflineExamCard
                    key={index}
                    exampType={item.examType}
                    examName={item.examName}
                    mode={item.mode}
                    semester={item.semester}
                    startDate={item.startDate}
                    endDate={item.endDate}
                    students={item.students}
                    maxScore={item.students[0]?.maxMarks}
                  />
                ))}
              </div>
            ) : (
              <NoDataFound
                title="Offline Exam"
                desc={
                  "Click 'Add New Rubric' to define your evaluation criteria."
                }
                icon={FaClipboardList}
                iconColor="text-blue-500"
                textColor="text-gray-700"
                bgColor="bg-gray-100"
              />
            )}
          </div>

          {/* Right Section */}
          <UploadAndFilter/>
        </div>
      </ProtectedSection>

      {/* Floating Add Exam Button */}
      <CreateButton />
    </div>
  );
};

export default MainSection;
