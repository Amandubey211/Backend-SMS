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
import debounce from "lodash/debounce";
import * as XLSX from "xlsx";
import CreateExam from "./Components/CreateExam";
import { fetchAllStudents } from "../../../../../Store/Slices/Admin/Users/Students/student.action";
import ExportExcel from "./Components/ExportExcel";
import FilterExam from "./Components/FilterExam";
import Pagination from "../../../../../Components/Common/pagination";
import { PERMISSIONS } from "../../../../../config/permission";
import { useTranslation } from "react-i18next";


const MainSection = () => {
  const { sid, cid } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    offlineExamData,
    loading,
    totalExams,
    totalPages,
    currentPage,
  } = useSelector((store) => store.admin.offlineExam);
  const { allStudents } = useSelector((store) => store.admin.all_students);
  const [page, setPage] = useState(currentPage);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isExportModelOpen, setIsExportModelOpen] = useState(false);
  const [selectedExportExamTypes, setSelectedExportExamTypes] = useState([]);

  const debouncedSearch = useMemo(
    () => debounce((query) => setDebouncedQuery(query), 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    dispatch(fetchAllOfflineExam({
      classId: cid,
      subjectId: sid,
      query: debouncedQuery,
      page: page,
      limit,
      startDate,
      endDate,
    }));
    dispatch(fetchAllStudents());
  }, [cid, sid, debouncedQuery, page, limit, startDate, endDate, dispatch]);

  const handlePageChange = (page) => {
    setPage(page);
  };


  const handleExportExcel = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Please select both start and end dates!");
      return;
    }

    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999);

    const filteredExams = offlineExamData.filter((exam) => {
      const examDate = new Date(exam.startDate);
      return (
        examDate >= start &&
        examDate <= end &&
        (selectedExportExamTypes.length === 0 ||
          selectedExportExamTypes.includes(exam.examType))
      );
    });

    if (filteredExams.length === 0) {
      alert("No exams found for the selected date range!");
      return;
    }

    const examNames = [...new Set(filteredExams.map((exam) => exam.examName))];
    const studentData = {};

    filteredExams.forEach((exam) => {
      exam.students.forEach((student) => {
        const studentId = student.studentId._id;
        const matchedStudent = allStudents.find((s) => s._id === studentId);
        if (!studentData[studentId]) {
          studentData[studentId] = {
            Name: `${student.studentId.firstName} ${student.studentId.lastName}`,
            AdmissionNumber: matchedStudent ? matchedStudent.admissionNumber : "N/A",
          };
        }
        studentData[studentId][exam.examName] =
          student.status === "absent" || student.status === "excused"
            ? `${student.status}/${student.maxMarks}`
            : `${student.score}/${student.maxMarks}`;
      });
    });

    const studentList = Object.values(studentData).map((student) => {
      examNames.forEach((name) => {
        if (!student[name]) student[name] = "NA";
      });
      return student;
    });

    const worksheet = XLSX.utils.json_to_sheet(studentList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Offline Exams");
    XLSX.writeFile(workbook, `Offline_Exams_${formatDate(startDate)}_to_${formatDate(endDate)}.xlsx`);
  };


  const handleCancel = () => {
    setIsExportModelOpen(false);
    setSelectedExportExamTypes([]);
    setStartDate(null);
    setEndDate(null);
  };
  return (
    <div className="flex h-full w-full">
      <SubjectSideBar />
      <ProtectedSection title="All Offline Exams" requiredPermission={PERMISSIONS.GET_OFFLINE_EXAM}>
        <div className="flex pt-4">
          <div className="w-[62%] border-l">
            <Header
              loading={loading}
              data={offlineExamData}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <hr className="my-4" />

            {loading ? (
              <Spinner />
            ) : offlineExamData.length ? (
              <div className="overflow-y-auto h-[calc(100vh-150px)]">
                {offlineExamData.map((exam) => (
                  <OfflineExamCard
                    key={exam._id}
                    examType={exam.examType}
                    examName={exam.examName}
                    semester={exam.semesterId?.title ?? "NA"}
                    startDate={formatDate(exam.startDate)}
                    endDate={formatDate(exam.endDate)}
                    maxMarks={exam.students?.[0]?.maxMarks}
                    examId={exam._id}
                    students={exam.students}
                    semesterId={exam.semesterId?._id}
                    resultsPublishDate={exam.resultsPublishDate}
                    resultsPublished={exam.resultsPublished}
                  />
                ))}
              </div>
            ) : (
              <NoDataFound
                title="Offline Exam"
                desc="No Offline Exam Found!"
                icon={FaClipboardList}
              />
            )}

            {totalExams > 0 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                totalRecords={totalExams}
                limit={limit}
                setPage={handlePageChange}
                setLimit={setLimit}
                t={t}
              />
            )}
          </div>

          <div className="w-[33%] px-2">
            <ExportExcel
              isExportModelOpen={isExportModelOpen}
              setIsExportModelOpen={setIsExportModelOpen}
              handleExportExcel={handleExportExcel}
              selectedExportExamTypes={selectedExportExamTypes}
              setSelectedExportExamTypes={setSelectedExportExamTypes}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              handleCancel={handleCancel}
            />

            <FilterExam
              startDate={startDate}
              handleStartDateChange={setStartDate}
              endDate={endDate}
              handleEndDateChange={setEndDate}
            />
          </div>
        </div>
      </ProtectedSection>
      <CreateExam />
    </div>
  );
};

export default MainSection;
