import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Modal, Skeleton, Table, Tag } from "antd";
import gradesFallbackIcon from "../../../Assets/ParentAssets/images/grades.png";
import { fetchParentStudentGrades } from "../../../Store/Slices/Parent/Grades/parentGrade.action";
import { fetchSemestersByClass } from "../../../Store/Slices/Parent/Semesters/parentSemester.action";

const StudentGradesAccordion = () => {
  const dispatch = useDispatch();
  const { studentId } = useParams();

  // Identify the correct child from parent store
  const { children } = useSelector((state) => state.Parent.children || {});
  const Child = children?.find((child) => child.id === studentId);

  // Destructure the 'grades' slice
  const { loading, grades: gradesResponse = {} } = useSelector(
    (state) => state.Parent.grades || {}
  );

  const {
    grades = [],
    student,
    attendance,
    total,
    totalScoreOfSubmitAssignments,
    totalScoreOfAllAssignments,
    totalQuizCompletedScore,
    totalScoreOfAllQuizzes,
    totalGroupAssignmentScore,
    submittedGroupAssignmentScore,
    totalGroupQuizScore,
    submittedGroupQuizScore,
  } = gradesResponse;

  // Semester-related state
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [semesterModalVisible, setSemesterModalVisible] = useState(false);

  // Local filter states
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedChapter, setSelectedChapter] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const capitalizeFirstLetter = (text) => {
    if (!text) return "-"; // Fallback for missing values
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };
  // 1) Fetch semesters
  useEffect(() => {
    if (!Child?.presentClassId) return;
    dispatch(fetchSemestersByClass({ classId: Child.presentClassId }))
      .unwrap()
      .then((response) => {
        if (Array.isArray(response) && response.length > 0) {
          setSemesters(response);
          setSelectedSemester(response[0]._id);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch semesters:", error);
      });
  }, [Child, dispatch]);

  // 2) Fetch grades
  useEffect(() => {
    if (Child?.presentClassId && selectedSemester) {
      dispatch(
        fetchParentStudentGrades({
          params: {},
          studentId,
          studentClassId: Child.presentClassId,
          semesterId: selectedSemester,
        })
      );
    }
  }, [Child, dispatch, studentId, selectedSemester]);

  // Handler for selecting a semester from the modal
  const handleSemesterSelect = (sem) => {
    setSelectedSemester(sem._id);
    setSemesterModalVisible(false);
  };

  // Collect unique values for each filter
  const uniqueModes = useMemo(
    () => ["All", ...new Set(grades.map((g) => g.mode).filter(Boolean))],
    [grades]
  );
  const uniqueTypes = useMemo(
    () => ["All", ...new Set(grades.map((g) => g.type).filter(Boolean))],
    [grades]
  );
  const uniqueModules = useMemo(
    () => ["All", ...new Set(grades.map((g) => g.moduleName).filter(Boolean))],
    [grades]
  );
  const uniqueChapters = useMemo(
    () => ["All", ...new Set(grades.map((g) => g.chapterName).filter(Boolean))],
    [grades]
  );
  const uniqueStatuses = useMemo(
    () => ["All", ...new Set(grades.map((g) => g.status).filter(Boolean))],
    [grades]
  );

  // Filter the grades array locally based on user's selections
  const filteredGrades = useMemo(() => {
    return grades.filter((g) => {
      if (selectedMode !== "All" && g.mode !== selectedMode) return false;
      if (selectedType !== "All" && g.type !== selectedType) return false;
      if (selectedModule !== "All" && g.moduleName !== selectedModule) return false;
      if (selectedChapter !== "All" && g.chapterName !== selectedChapter) return false;
      if (selectedStatus !== "All" && g.status !== selectedStatus) return false;
      return true;
    });
  }, [grades, selectedMode, selectedType, selectedModule, selectedChapter, selectedStatus]);

  // AntD Table columns (with Status color tagging)
  const columns = [
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
      render: (text) => capitalizeFirstLetter(text),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => capitalizeFirstLetter(text),
    },
    {
      title: "Module",
      dataIndex: "moduleName",
      key: "moduleName",
      render: (text) => capitalizeFirstLetter(text),
    },
    {
      title: "Chapter",
      dataIndex: "chapterName",
      key: "chapterName",
      render: (text) => capitalizeFirstLetter(text),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        switch (status.toLowerCase()) {
          case "submit":
            color = "green";
            break;
          case "missing":
            color = "red";
            break;
          case "present":
            color = "blue";
            break;
          case "absent":
            color = "gray";
            break;
          case "excused":
            color = "gold";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status.charAt(0).toUpperCase() + status.slice(1)}</Tag>;
      },
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score) => (score !== undefined && score !== null ? score : "-"),
    },
  ];

  // Fallback student image
  const fallbackStudentImage =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // "No Grades" fallback UI
  const noGradesFallback = (
    <div className="flex flex-col items-center justify-center min-h-screen flex-grow">
      <img
        src={gradesFallbackIcon}
        alt="No Grades"
        className="w-32 h-32 mb-4"
      />
      <p className="text-gray-600 text-lg font-semibold text-center">
        No Grades Present for {Child?.fullName || "the child"} yet.
        <br />
        Kindly check later!
      </p>
    </div>
  );

  // Decide if we have valid data
  const hasData = Child && semesters.length > 0 && grades.length > 0;

  return (
    <div className="w-full p-4 relative flex">
      {/* 1) Show Skeleton if loading */}
      {loading ? (
        <Skeleton active />
      ) : /* 2) If not loading but no data, show fallback */
        !hasData ? (
          noGradesFallback
        ) : (
          /* 3) Otherwise, render the main UI */
          <>
            {/* LEFT COLUMN: Semester Button, Filters, and Table */}
            <div className="w-3/4 pr-4">
              {/* Semester Button */}
              <div className="mb-4">
                <button
                  onClick={() => setSemesterModalVisible(true)}
                  className="border border-pink-400 bg-white text-black font-semibold px-4 py-2 rounded-md
                     hover:bg-pink-400 hover:text-white transition-colors"
                >
                  {(() => {
                    if (!selectedSemester) return "Select Semester";
                    const found = semesters.find((s) => s._id === selectedSemester);
                    return found ? found.title : "Select Semester";
                  })()}
                </button>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-wrap items-end gap-4 mb-4">
                {/* Grade Mode */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">
                    Grade Mode
                  </label>
                  <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                  >
                    {uniqueModes.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">
                    Type
                  </label>
                  <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {uniqueTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Module */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">
                    Module
                  </label>
                  <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                  >
                    {uniqueModules.map((mod) => (
                      <option key={mod} value={mod}>
                        {mod}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chapter */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">
                    Chapter
                  </label>
                  <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                  >
                    {uniqueChapters.map((chap) => (
                      <option key={chap} value={chap}>
                        {chap}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">
                    Status
                  </label>
                  <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    {uniqueStatuses.map((stat) => (
                      <option key={stat} value={stat}>
                        {stat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* AntD Table with Pagination */}
              <Table
                columns={columns}
                dataSource={filteredGrades}
                pagination={{ pageSize: 5 }}
                rowKey={(record) => record._id || Math.random()}
              />
            </div>

            {/* Vertical Divider */}
            <div className="w-[1px] bg-gray-300 h-full min-h-screen mx-4" />

            {/* RIGHT COLUMN: Student Info + Grade Summary */}
            <div className="w-1/4 pl-4">
              {/* Student Info */}
              <div className="mb-4">
                <div className="flex flex-col items-center">
                  <img
                    src={student?.profile || fallbackStudentImage}
                    alt="Student Profile"
                    className="w-16 h-16 object-cover rounded-full border"
                  />
                  <h3 className="mt-2 text-md font-semibold text-gray-700">
                    {student?.fullName || "N/A"}
                  </h3>
                </div>
              </div>

              <hr className="mb-4" />

              {/* Grade Summary */}
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Grade Summary</h3>
              <div className="flex items-center justify-between mb-2 text-gray-600">
                <span>Assignment</span>
                <span>
                  {totalScoreOfSubmitAssignments ?? 0} / {totalScoreOfAllAssignments ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2 text-gray-600">
                <span>Group Assignment</span>
                <span>
                  {submittedGroupAssignmentScore ?? 0} / {totalGroupAssignmentScore ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2 text-gray-600">
                <span>Quiz</span>
                <span>
                  {totalQuizCompletedScore ?? 0} / {totalScoreOfAllQuizzes ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2 text-gray-600">
                <span>Group Quiz</span>
                <span>
                  {submittedGroupQuizScore ?? 0} / {totalGroupQuizScore ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2 text-gray-600">
                <span>Attendance</span>
                <span>{attendance ?? 0} DAY</span>
              </div>
              <div className="border-t mt-4 pt-3 flex items-center justify-between text-gray-700">
                <p className="text-lg font-semibold">Total Score:</p>
                <p className="text-pink-500 text-xl font-semibold">{total ?? 0}</p>
              </div>
            </div>
          </>
        )}

      {/* Semester Selection Modal */}
      <Modal
        open={semesterModalVisible}
        onCancel={() => setSemesterModalVisible(false)}
        footer={null}
        title="Select Semester"
        bodyStyle={{ padding: "1rem" }}
        destroyOnClose
      >
        {semesters.length > 0 ? (
          semesters.map((sem) => (
            <button
              key={sem._id}
              onClick={() => handleSemesterSelect(sem)}
              className={`w-full mb-2 text-left border rounded-md py-2 px-3 transition-colors duration-200 ${selectedSemester === sem._id
                  ? "bg-purple-100 border-purple-400"
                  : "bg-white hover:bg-purple-50"
                }`}
            >
              {sem.title}
            </button>
          ))
        ) : (
          <p className="text-center">No semesters available.</p>
        )}
      </Modal>
    </div>
  );
};

export default StudentGradesAccordion;
