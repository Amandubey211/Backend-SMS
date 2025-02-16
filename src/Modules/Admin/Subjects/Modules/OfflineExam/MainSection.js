import React, { useEffect } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { useState } from "react";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
import { FaClipboardList } from "react-icons/fa";
import Spinner from "../../../../../Components/Common/Spinner";
import OfflineExamCard from "./Components/OfflineExamCard";
import CreateButton from "./Components/CreateButton";
import Header from "./Components/Header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOfflineExam } from "../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { formatDate } from "../../../../../Utils/helperFunctions";
import { useTranslation } from "react-i18next";

import { AiFillFileExcel } from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";
import DatePicker from "../../../../../Utils/calendar";

const MainSection = () => {
  const { sid, cid } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const { offlineExamData, loading } = useSelector(
    (store) => store.admin.offlineExam
  );

  const dispatch = useDispatch();

  const { t } = useTranslation("admModule");
  const [examType, setExamType] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [semester, setSemester] = useState("");
  const [filteredData, setFilteredData] = useState(offlineExamData);

  const SemesterList = ["Semester I", "Semester II", "Semester III"];

  // const handleApplyFilters = () => {
  //   const data = offlineExamData.filter(
  //     (i) => i.data?.semesterId?.title === semester
  //   );
  //   setFilteredData(data);
  // };

  // const handleResetFilters = () => {
  //   setSemester("");
  //   setStartDate(new Date());
  //   setFilteredData(offlineExamData);
  // };

  useEffect(() => {
    dispatch(
      fetchAllOfflineExam({ classId: cid, subjectId: sid, query: searchQuery })
    );
  }, [dispatch]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchedData = offlineExamData?.filter((exam) => {
    const matchedSearch = exam.examName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchedSearch;
  });
  console.log("data", filteredData, searchQuery);

  return (
    <div className="flex h-full w-full">
      <SubjectSideBar />
      <ProtectedSection title="All Offline Exams">
        <div className="flex pt-4">
          {/* Left Section */}
          <div className="w-[65%] border-l">
            <Header
              loading={loading}
              data={filteredData}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              searchedData={searchedData}
            />
            <ul className="border-t mt-4 mx-4"></ul>
            {/* Offline Exam Card */}
            {loading ? (
              <Spinner />
            ) : filteredData?.length ? (
              <div className="h-[calc(100vh-150px)] overflow-y-auto">
                {filteredData?.map((item, index) => (
                  <div>
                    <OfflineExamCard
                      key={index}
                      examType={item.examType}
                      examName={item.examName}
                      semester={item.semesterId?.title ?? "NA"}
                      startDate={formatDate(item.startDate)}
                      endDate={formatDate(item.endDate)}
                      maxScore={item.students[0]?.maxMarks}
                      examId={item._id}
                      students={item.students}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <NoDataFound
                title="Offline Exam"
                desc={"No Offline Exam Found !"}
                icon={FaClipboardList}
                iconColor="text-blue-500"
                textColor="text-gray-700"
                bgColor="bg-gray-100"
              />
            )}
          </div>
          {/* Right Section */}
          <div className="w-[30%] p-2">
            <div className="pl-5 pt-1">
              <button
                onClick={() => {}}
                className="flex justify-center items-center mt-2 gap-x-2 px-4 py-2 w-full rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
              >
                <span>
                  <AiFillFileExcel className="text-lg text-red-600" />
                </span>
                <span className="text-gradient">Export Excel</span>
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md w-80 relative">
              <button
                // onClick={handleResetFilters}
                className="absolute top-2 right-2 text-gray-600 rounded-full p-2 focus:outline-none transform transition-transform duration-300 hover:rotate-180"
                aria-label={t("Reset filters")}
              >
                <FiRefreshCw size={24} />
              </button>

              <h2 className="text-lg font-semibold mb-4">{t("Filter")}</h2>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="module-select">
                  Semester
                </label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 border py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={examType}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="">{t("Select")}</option>
                  {SemesterList?.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <DatePicker startDate={startDate} setStartDate={setStartDate} />
              </div>

              <button
                // onClick={handleApplyFilters}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-full focus:outline-none transform transition-transform duration-300 hover:scale-105"
                aria-label={t("Apply filters")}
              >
                {t("Apply")}
              </button>
            </div>
          </div>
        </div>
      </ProtectedSection>
      {/* Floating Add Exam Button */}
      <CreateButton />
    </div>
  );
};

export default MainSection;
