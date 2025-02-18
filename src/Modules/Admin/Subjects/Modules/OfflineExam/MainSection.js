import React, { useEffect, useState, useMemo, useCallback } from "react";
import SubjectSideBar from "../../Component/SubjectSideBar";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
import { FaClipboardList } from "react-icons/fa";
import Spinner from "../../../../../Components/Common/Spinner";
import OfflineExamCard from "./Components/OfflineExamCard";
import Header from "./Components/Header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOfflineExam } from "../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { formatDate } from "../../../../../Utils/helperFunctions";
import { useTranslation } from "react-i18next";
import { AiFillFileExcel } from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";

import { PERMISSIONS } from "../../../../../config/permission";
import { debounce } from "lodash";
import * as XLSX from "xlsx";
import { DatePicker, Select } from "antd";
import CreateExam from "./Components/CreateExam";
import { fetchAllStudents } from "../../../../../Store/Slices/Admin/Users/Students/student.action";

const MainSection = () => {
  const { sid, cid } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const { offlineExamData, loading } = useSelector(
    (store) => store.admin.offlineExam
  );
  const dispatch = useDispatch();
  const { t } = useTranslation("admModule");
  const [semester, setSemester] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const SemesterList = ["Semester I", "Semester II", "Semester III"];
  const [isExportModelOpen, setIsExportModelOpen] = useState(false); // ✅ Modal state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { allStudents } = useSelector((store) => store.admin.all_students);
  const [selectedExportExamTypes, setSelectedExportExamTypes] = useState([]);

  const handleExportExcel = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Please select both start and end dates!");
      return;
    }

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    // Convert start & end dates to proper comparison format
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999);

    const filteredExams = offlineExamData.filter((exam) => {
      const examDate = new Date(exam.startDate);
      const isWithinDateRange = examDate >= start && examDate <= end;
      const isMatchingExamType =
        selectedExportExamTypes.length === 0 ||
        selectedExportExamTypes.includes(exam.examType);
      console.log("jjhj", isMatchingExamType, isWithinDateRange);

      return isWithinDateRange && isMatchingExamType;
    });

    if (filteredExams.length === 0) {
      alert("No exams found for the selected date range!");
      return;
    }

    const examNames = new Set(filteredExams.map((exam) => exam.examName));

    const studentData = {};

    filteredExams.forEach((exam) => {
      examNames.add(exam.examName);
      exam.students.forEach((student) => {
        const studentId = student.studentId._id;
        const matchedStudent = allStudents.find((i) => i._id === studentId);
        if (!studentData[studentId]) {
          studentData[studentId] = {
            Name: `${student.studentId.firstName} ${student.studentId.lastName}`,
            AdmissionNumber: matchedStudent
              ? matchedStudent.admissionNumber
              : "N/A",
          };
        }
        studentData[studentId][
          exam.examName
        ] = `${student.score}/${student.maxMarks}`;
      });
    });
    // Ensure all students have all exam columns (fill missing exams with "-")
    const studentList = Object.values(studentData).map((student) => {
      examNames.forEach((exam) => {
        if (!student[exam]) {
          student[exam] = "-"; // Placeholder for exams the student didn't take
        }
      });
      return student;
    });

    generateExcel(
      studentList,
      `Offline_Exams_${formattedStartDate}_to_${formattedEndDate}.xlsx`
    );
  };
  const generateExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Offline Exams");

    XLSX.writeFile(workbook, filename);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((searchQuery) => {
        setDebouncedQuery(searchQuery);
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, cid, sid, dispatch, debouncedSearch]);

  useEffect(() => {
    debouncedSearch(searchQuery);

    dispatch(
      fetchAllOfflineExam({ classId: cid, subjectId: sid, query: searchQuery })
    );
    dispatch(fetchAllStudents());
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, cid, sid, dispatch, debouncedSearch]);

  const filteredData = useMemo(() => {
    let data = offlineExamData;

    // Apply search filter
    if (debouncedQuery.trim()) {
      data = data.filter((exam) =>
        exam.examName.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }

    // Apply semester filter
    if (semester) {
      data = data.filter((exam) => exam.semesterId?.title === semester);
    }

    // Convert start and end dates to ISO format
    const startISO = startDate ? new Date(startDate).toISOString() : null;
    const endISO = endDate ? new Date(endDate).toISOString() : null;

    console.log("Start Date (ISO):", startISO);
    console.log("End Date (ISO):", endISO);

    // Apply start date filter
    if (startISO) {
      data = data.filter((exam) => exam.startDate >= startISO);
    }

    // Apply end date filter
    if (endISO) {
      data = data.filter((exam) => exam.endDate <= endISO);
    }

    return data;
  }, [offlineExamData, debouncedQuery, semester, startDate, endDate]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleApplyFilters = () => {
    setSearchQuery("");
    setSemester("");
    setStartDate(null);
    setEndDate(null);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    if (!startDate) {
      alert("Please select a start date first.");
      return;
    }
    setEndDate(date);
  };

  const handleCancel = () => {
    setIsExportModelOpen(false);
    setSelectedExportExamTypes([]);
  };

  return (
    <div className="flex h-full w-full">
      <SubjectSideBar />
      <ProtectedSection
        title="All Offline Exams"
        requiredPermission={PERMISSIONS.GET_OFFLINE_EXAM}
      >
        <div className="flex pt-4">
          {/* Left Section */}
          <div className="w-[62%] border-l">
            <Header
              loading={loading}
              data={offlineExamData}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              searchedData={filteredData}
            />
            <ul className="border-t mt-4 ml-4 mr-6"></ul>
            {/* Offline Exam Card */}
            {loading ? (
              <Spinner />
            ) : filteredData?.length ? (
              <div className="h-[calc(100vh-150px)] overflow-y-auto">
                {filteredData?.map((item, index) => (
                  <div>
                    <OfflineExamCard
                      examType={item.examType}
                      examName={item.examName}
                      semester={item.semesterId?.title ?? "NA"}
                      startDate={formatDate(item.startDate)}
                      endDate={formatDate(item.endDate)}
                      maxMarks={item.students?.[0].maxMarks}
                      examId={item._id}
                      students={item.students}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <NoDataFound
                title="Offline Exam"
                desc="No Offline Exam Found !"
                icon={FaClipboardList}
                iconColor="text-blue-500"
                textColor="text-gray-700"
                bgColor="bg-gray-100"
              />
            )}
          </div>
          {/* Right Section */}
          <div className="w-[33%] px-2">
            <div>
              <div className=" w-full">
                <button
                  onClick={() => setIsExportModelOpen(true)}
                  className="flex justify-center items-center gap-x-2 px-4 py-2 w-full rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
                >
                  <span>
                    <AiFillFileExcel className="text-lg text-red-600" />
                  </span>
                  <span className="text-gradient">Export Excel</span>
                </button>
              </div>
              {/* Export Excel */}
              {isExportModelOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] relative">
                    <h2 className="text-lg font-semibold mb-4">
                      Export Offline Exam Data
                    </h2>
                    <form onSubmit={handleExportExcel} className="space-y-4">
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 font-medium text-sm"
                          htmlFor="module-select"
                        >
                          Exam Type
                        </label>

                        <Select
                          mode="multiple" // ✅ Enables multi-selection with tags
                          allowClear
                          placeholder="Select Exam Type"
                          className="w-full"
                          value={selectedExportExamTypes}
                          onChange={(values) =>
                            setSelectedExportExamTypes(values)
                          } // ✅ Updates state with selected values
                          tagRender={(props) => {
                            const { label, closable, onClose } = props;
                            return (
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md m-1 flex items-center gap-1 text-xs capitalize">
                                {label}
                                {closable && (
                                  <span
                                    onClick={onClose}
                                    className="cursor-pointer text-red-500 ml-1 hover:text-red-700"
                                  >
                                    ✕
                                  </span>
                                )}
                              </span>
                            );
                          }}
                          options={[
                            ...new Set(
                              offlineExamData.map((exam) => exam.examType)
                            ),
                          ].map((examType) => ({
                            label: (
                              <span className="capitalize">{examType}</span>
                            ),
                            value: examType,
                          }))}
                        />
                      </div>

                      <div>
                        <label className=" text-gray-700 font-medium text-sm">
                          Start Date:
                        </label>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          className="border p-2 rounded-md w-full"
                          placeholderText="Select Start Date"
                        />
                      </div>

                      <div>
                        <label className=" text-gray-700 font-medium text-sm">
                          End Date:
                        </label>
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                          className="border p-2 rounded-md w-full"
                          placeholderText="Select End Date"
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="bg-white px-4 py-2 rounded-md border border-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-md"
                        >
                          Export
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
            {/* Filter */}
            <div className="bg-white p-4 border border-gray-200 rounded-lg  w-80 relative mt-8">
              <button
                onClick={handleApplyFilters}
                className="absolute right-2 mr-1 text-gray-600 rounded-full  pr-4 focus:outline-none transform transition-transform duration-300 hover:rotate-180"
                aria-label={t("Reset filters")}
              >
                <FiRefreshCw size={24} />
              </button>

              <h2 className="text-lg font-medium mb-4">{t("Filter")}</h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium text-sm"
                  htmlFor="module-select"
                >
                  Semester
                </label>
                <select
                  className="mt-1 block w-full pl-3 pr-5 border border-gray-200 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="">{t("Select")}</option>
                  {SemesterList.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-medium text-sm">
                  Start Date
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="border p-2 rounded-md w-full"
                  placeholderText="Select Start Date"
                />
              </div>

              <div className="mt-4">
                <label className="text-gray-700 font-medium text-sm">
                  End Date
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  selectsEnd
                  isClearable
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate} // Prevents selecting an end date before the start date
                  className="border p-2 rounded-md w-full"
                  placeholderText="Select End Date"
                />
              </div>

              {/* <button
                // onClick={handleApplyFilters}
                className="w-full bg-gradient-to-r mt-5 from-purple-500 to-pink-500 text-white py-2 rounded-full focus:outline-none transform transition-transform duration-300 hover:scale-105"
                aria-label={t("Apply filters")}
              >
                {t("Apply")}
              </button> */}
            </div>
          </div>
        </div>
      </ProtectedSection>
      {/* Floating Add Exam Button */}
      <CreateExam />
    </div>
  );
};

export default MainSection;
