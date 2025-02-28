import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Modal, Skeleton, Table } from "antd";
import gradesFallbackIcon from "../../../Assets/ParentAssets/images/grades.png";
import { fetchParentStudentGrades } from "../../../Store/Slices/Parent/Grades/parentGrade.action";
import { fetchSemestersByClass } from "../../../Store/Slices/Parent/Semesters/parentSemester.action";

const StudentGradesAccordion = () => {
  const dispatch = useDispatch();
  const { studentId } = useParams();

  // Identify the child
  const { children } = useSelector((state) => state.Parent.children || {});
  const Child = children?.find((child) => child.id === studentId);

  // Redux "grades" slice
  const { loading, grades: gradesResponse = {} } = useSelector(
    (state) => state.Parent.grades || {}
  );

  // Destructure the fields
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

  // Semester state
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [semesterModalVisible, setSemesterModalVisible] = useState(false);

  // Local filters
  const [selectedMode, setSelectedMode] = useState("Online"); // default "Online"
  const [selectedType, setSelectedType] = useState("All");
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedChapter, setSelectedChapter] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); // used only in offline mode

  // Fetch semesters
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

  // Fetch grades
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

  // Semester select
  const handleSemesterSelect = (sem) => {
    setSelectedSemester(sem._id);
    setSemesterModalVisible(false);
  };

  // Unique filter values
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

  // Filter logic (online mode)
  const filteredGradesOnline = useMemo(() => {
    return grades.filter((g) => {
      if (selectedType !== "All" && g.type !== selectedType) return false;
      if (selectedModule !== "All" && g.moduleName !== selectedModule) return false;
      if (selectedChapter !== "All" && g.chapterName !== selectedChapter) return false;
      if (selectedStatus !== "All" && g.status !== selectedStatus) return false;
      return true;
    });
  }, [grades, selectedType, selectedModule, selectedChapter, selectedStatus]);

  // Filter logic (offline mode) + search
  const filteredGradesOffline = useMemo(() => {
    return grades.filter((g) => {
      // only filter by searchTerm in "Name" field
      if (
        searchTerm &&
        !g.Name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [grades, searchTerm]);

  // Decide final data source based on selectedMode
  const finalGrades = selectedMode === "Online" ? filteredGradesOnline : filteredGradesOffline;

  // Custom tag for status
  const renderStatusTag = (status) => {
    if (!status) return <span>-</span>;
    let bgColor = "bg-gray-200 text-gray-800";
    if (status.toLowerCase() === "submit") bgColor = "bg-green-200 text-green-800";
    else if (status.toLowerCase() === "missing") bgColor = "bg-red-200 text-red-800";
    else if (status.toLowerCase() === "present") bgColor = "bg-blue-200 text-blue-800";
    else if (status.toLowerCase() === "absent") bgColor = "bg-gray-200 text-gray-800";
    else if (status.toLowerCase() === "excused") bgColor = "bg-yellow-200 text-yellow-800";
    return (
      <span className={`px-2 py-1 rounded text-sm font-semibold ${bgColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Custom tag for type (under Name)
  const renderTypeTag = (type) => {
    if (!type) return null;
    let bgColor = "bg-gray-100 text-gray-600";
    if (type.toLowerCase() === "assignment") bgColor = "bg-purple-100 text-purple-700";
    else if (type.toLowerCase() === "quiz") bgColor = "bg-green-100 text-green-700";
    else if (type.toLowerCase() === "exam") bgColor = "bg-blue-100 text-blue-700";
    else if (type.toLowerCase() === "project") bgColor = "bg-yellow-100 text-yellow-700";
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${bgColor}`}>
        {type}
      </span>
    );
  };

  // Online columns: Name, Module, Chapter, Status, Score, etc.
  const onlineColumns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      render: (text, record) => (
        <div>
          <span className="font-medium text-gray-800">{text || "-"}</span>
          <div>{renderTypeTag(record.type)}</div>
        </div>
      ),
    },
    {
      title: "Module",
      dataIndex: "moduleName",
      key: "moduleName",
      render: (text) => text || "-",
    },
    {
      title: "Chapter",
      dataIndex: "chapterName",
      key: "chapterName",
      render: (text) => text || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => renderStatusTag(status),
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score, record) => {
        const max = record.maxMarks || 0;
        return (
          <span className="text-gray-800">
            {score ?? 0} / {max}
          </span>
        );
      },
    },
  ];

  // Offline columns: Name, Due Date, Submitted Date, Status, Score
  const offlineColumns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      render: (text, record) => (
        <div>
          <span className="font-medium text-gray-800">{text || "-"}</span>
          <div>{renderTypeTag(record.type)}</div>
        </div>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => (date ? date.slice(0, 10) : "-"),
    },
    {
      title: "Submitted Date",
      dataIndex: "submittedDate",
      key: "submittedDate",
      render: (date) => (date ? date.slice(0, 10) : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => renderStatusTag(status),
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score, record) => {
        const max = record.maxMarks || 0;
        return (
          <span className="text-gray-800">
            {score ?? 0} / {max}
          </span>
        );
      },
    },
  ];

  // Fallback image
  const fallbackStudentImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // "No Grades" fallback
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

  // Decide if data is present
  const hasData = Child && semesters.length > 0 && grades.length > 0;

  // Render main content
  let content = null;
  if (loading) {
    // Show skeleton
    content = <Skeleton active />;
  } else if (!hasData) {
    // Show fallback
    content = noGradesFallback;
  } else {
    // Normal UI
    const columns = selectedMode === "Online" ? onlineColumns : offlineColumns;
    const dataSource = finalGrades;

    content = (
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
            {/* Mode Dropdown */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Grade Mode</label>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            {/* If mode is Online, show the other dropdowns */}
            {selectedMode === "Online" && (
              <>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">Type</label>
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

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">Module</label>
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

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">Chapter</label>
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

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">Status</label>
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
              </>
            )}

            {/* If mode is Offline, show the Search field */}
            {selectedMode === "Offline" && (
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-600 mb-1">Search Exams</label>
                <input
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={{ pageSize: 5 }}
            rowKey={(record) => record._id || Math.random()}
          />
        </div>

        {/* Vertical Divider */}
        <div className="w-[1px] bg-gray-300 h-full min-h-screen mx-4" />

        {/* RIGHT COLUMN: Student Info + Grade Summary */}
        <div className="w-1/4 pl-4">
          <div className="mb-4 flex flex-col items-center">
            <img
              src={student?.profile || fallbackStudentImage}
              alt="Student Profile"
              className="w-24 h-24 object-cover rounded-full border"
            />
            <h3 className="mt-2 text-md font-semibold text-gray-700">
              {student?.fullName || "N/A"}
            </h3>
          </div>

          <hr className="mb-4" />

          {/* Grade Summary (TOTAL SCORE at top) */}
          <p className="text-gray-600 text-sm mb-1 font-semibold">Total Score</p>
          <p className="text-pink-500 text-2xl font-bold mb-4">{total ?? 0}</p>

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
        </div>
      </>
    );
  }

  return (
    <div className="w-full p-4 relative flex">
      {content}

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
              className={`w-full mb-2 text-left border rounded-md py-2 px-3 transition-colors duration-200 ${
                selectedSemester === sem._id
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
