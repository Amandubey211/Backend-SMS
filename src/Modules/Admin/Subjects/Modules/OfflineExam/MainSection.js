import React, { useEffect, useState, useMemo } from "react";
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

import { PERMISSIONS } from "../../../../../config/permission";
import { debounce } from "lodash";
import * as XLSX from "xlsx";
import CreateExam from "./Components/CreateExam";
import { fetchAllStudents } from "../../../../../Store/Slices/Admin/Users/Students/student.action";
import ExportExcel from "./Components/ExportExcel";
import FilterExam from "./Components/FilterExam";

const MainSection = () => {
  const { sid, cid } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const { offlineExamData, loading } = useSelector(
    (store) => store.admin.offlineExam
  );
  const dispatch = useDispatch();
  const [semester, setSemester] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isExportModelOpen, setIsExportModelOpen] = useState(false);
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

    const filteredExams = offlineExamData?.filter((exam) => {
      const examDate = new Date(exam.startDate);
      const isWithinDateRange = examDate >= start && examDate <= end;
      const isMatchingExamType =
        selectedExportExamTypes.length === 0 ||
        selectedExportExamTypes.includes(exam.examType);
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
        studentData[studentId][exam.examName] =
          student.status === "absent" || student.status === "excused"
            ? `${student.status}/${student?.maxMarks}`
            : `${student.score}/${student?.maxMarks}`;
      });
    });
    const studentList = Object.values(studentData).map((student) => {
      examNames.forEach((exam) => {
        if (!student[exam]) {
          student[exam] = "NA";
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
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    debouncedSearch(searchQuery);

    dispatch(
      fetchAllOfflineExam({ classId: cid, subjectId: sid, query: searchQuery })
    );
    dispatch(fetchAllStudents());
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch, cid, sid, dispatch]);

  const filteredData = useMemo(() => {
    let data = offlineExamData;
    if (debouncedQuery.trim()) {
      data = data.filter((exam) =>
        exam.examName.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }
    if (semester) {
      data = data.filter((exam) => exam.semesterId?.title === semester);
    }
    const startISO = startDate ? new Date(startDate).toISOString() : null;
    const endISO = endDate ? new Date(endDate).toISOString() : null;
    if (startISO) {
      data = data.filter((exam) => exam.startDate >= startISO);
    }
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
                      key={index}
                      examType={item.examType}
                      examName={item.examName}
                      semester={item.semesterId?.title ?? "NA"}
                      startDate={formatDate(item.startDate)}
                      endDate={formatDate(item.endDate)}
                      maxMarks={item.students?.[0]?.maxMarks}
                      examId={item._id}
                      students={item.students}
                      semesterId={item.semesterId?._id}
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
            <ExportExcel
              isExportModelOpen={isExportModelOpen}
              setIsExportModelOpen={setIsExportModelOpen}
              handleExportExcel={handleExportExcel}
              selectedExportExamTypes={selectedExportExamTypes}
              setSelectedExportExamTypes={setSelectedExportExamTypes}
              startDate={startDate}
              setEndDate={setEndDate}
              endDate={endDate}
              setStartDate={setStartDate}
              handleCancel={handleCancel}
            />

            {/* Filter */}
            <FilterExam
              handleApplyFilters={handleApplyFilters}
              semester={semester}
              setSemester={setSemester}
              startDate={startDate}
              handleStartDateChange={handleStartDateChange}
              endDate={endDate}
              handleEndDateChange={handleEndDateChange}
            />
          </div>
        </div>
      </ProtectedSection>
      {/* Floating Add Exam Button */}
      <CreateExam />
    </div>
  );
};

export default MainSection;
