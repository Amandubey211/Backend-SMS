import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Modal, Skeleton, Table } from "antd";
import gradesFallbackIcon from "../../../Assets/ParentAssets/images/grades.png";
import offlineExamIcon from "../../../Assets/ParentAssets/images/offline_exam.png";
import onlineExamIcon from "../../../Assets/ParentAssets/images/online_exam.png";
import { fetchParentStudentGrades } from "../../../Store/Slices/Parent/Grades/parentGrade.action";
import { fetchSemestersByClass } from "../../../Store/Slices/Parent/Semesters/parentSemester.action";
import { t } from "i18next";

const StudentGradesAccordion = () => {
  const dispatch = useDispatch();
  const { studentId } = useParams();

  // Identify the child
  const { children, selectedChild } = useSelector((state) => state.Parent.children || {});
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
  const [selectedMode, setSelectedMode] = useState("Online"); // Always show both in dropdown
  const [selectedType, setSelectedType] = useState("All");
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedChapter, setSelectedChapter] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Handler for semester modal
  const handleSemesterSelect = (sem) => {
    setSelectedSemester(sem._id);
    setSemesterModalVisible(false);
  };

  // Split data into online/offline
  const onlineGrades = useMemo(
    () => grades.filter((g) => g.mode === "online"),
    [grades]
  );
  const offlineGrades = useMemo(
    () => grades.filter((g) => g.mode === "offline"),
    [grades]
  );

  // Unique filter values (only for online)
  const uniqueTypes = useMemo(
    () => ["All", ...new Set(onlineGrades.map((g) => g.type).filter(Boolean))],
    [onlineGrades]
  );
  const uniqueModules = useMemo(
    () => ["All", ...new Set(onlineGrades.map((g) => g.moduleName).filter(Boolean))],
    [onlineGrades]
  );
  const uniqueChapters = useMemo(
    () => ["All", ...new Set(onlineGrades.map((g) => g.chapterName).filter(Boolean))],
    [onlineGrades]
  );
  const uniqueStatuses = useMemo(
    () => ["All", ...new Set(onlineGrades.map((g) => g.status).filter(Boolean))],
    [onlineGrades]
  );

  // Filter logic for online
  const filteredGradesOnline = useMemo(() => {
    return onlineGrades.filter((g) => {
      if (selectedType !== "All" && g.type !== selectedType) return false;
      if (selectedModule !== "All" && g.moduleName !== selectedModule) return false;
      if (selectedChapter !== "All" && g.chapterName !== selectedChapter) return false;
      if (selectedStatus !== "All" && g.status !== selectedStatus) return false;
      return true;
    });
  }, [onlineGrades, selectedType, selectedModule, selectedChapter, selectedStatus]);
  const fallbackStudentImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // Filter logic for offline + search
  const filteredGradesOffline = useMemo(() => {
    return offlineGrades.filter((g) => {
      if (searchTerm && !g.Name?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [offlineGrades, searchTerm]);

  // Reusable custom status tag
  const renderStatusTag = (status) => {
    if (!status) return <span>-</span>;
    let bgColor = "bg-gray-200 text-gray-800";
    const s = status.toLowerCase();
    if (s === "submit") bgColor = "bg-green-200 text-green-800";
    else if (s === "missing") bgColor = "bg-red-200 text-red-800";
    else if (s === "present") bgColor = "bg-blue-200 text-blue-800";
    else if (s === "absent") bgColor = "bg-gray-200 text-gray-800";
    else if (s === "excused") bgColor = "bg-yellow-200 text-yellow-800";

    return (
      <span className={`px-2 py-1 rounded text-sm font-semibold ${bgColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Custom type tag (below the name)
  const renderTypeTag = (type) => {
    if (!type) return null;

    // Capitalize first letter
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

    let bgColor = "bg-gray-100 text-gray-600";
    const t = type.toLowerCase();
    if (t === "assignment") bgColor = "bg-purple-100 text-purple-700";
    else if (t === "quiz") bgColor = "bg-green-100 text-green-700";
    else if (t === "exam") bgColor = "bg-blue-100 text-blue-700";
    else if (t === "project") bgColor = "bg-yellow-100 text-yellow-700";

    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${bgColor}`}>
        {formattedType}
      </span>
    );
  };


  // Offline columns
  const offlineColumns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      render: (text, record) => (
        <div>
          <div className="font-medium text-gray-800">{text.toUpperCase() || "-"}</div>
          {renderTypeTag(record.type)}
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

  // Online columns
  const onlineColumns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      render: (text, record) => (
        <div>
          <div className="font-medium text-gray-800">
            {text ? text.charAt(0).toUpperCase() + text.slice(1) : "-"}
          </div>
          {renderTypeTag(record.type)}
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

  // Decide which columns + data to show
  let columns;
  let dataSource;
  if (selectedMode === "Offline") {
    columns = offlineColumns;
    dataSource = filteredGradesOffline;
  } else {
    columns = onlineColumns;
    dataSource = filteredGradesOnline;
  }

  // "No Grades" fallback
  const noGradesFallback = (
    <div className="flex flex-col items-center justify-center min-h-screen flex-grow">
      <img
        src={gradesFallbackIcon}
        alt="No Grades"
        className="w-32 h-32 mb-4"
      />
      <p className="text-gray-600 text-lg font-semibold text-center">
        No Grades Present for {selectedChild?.name?.split(" ")[0] || "this student"} yet.
        <br />
        Kindly check later!
      </p>
    </div>
  );

  // Are we still loading?
  if (loading) {
    return (
      <div className="w-full p-4 relative flex">
        <Skeleton active />
      </div>
    );
  }

  // Basic "has data" check
  const hasData = Child && semesters.length > 0 && grades.length > 0;
  if (!hasData) {
    return (
      <div className="w-full p-4 relative flex">
        {noGradesFallback}
      </div>
    );
  }

  // If user selected "Online" but there's no online data => show message
  let noModeDataMessage = null;
  if (selectedMode === "Online" && !onlineGrades.length) {
    noModeDataMessage = (
      <div className="p-4 flex flex-col items-center text-gray-600">
        <img src={onlineExamIcon} alt="No Online Data" className="w-24 h-24 mb-2" />
        <p className="font-semibold text-center">No Online data available yet. Kindly check later!</p>
      </div>
    );
  }
  // If user selected "Offline" but there's no offline data => show message
  if (selectedMode === "Offline" && !offlineGrades.length) {
    noModeDataMessage = (
      <div className="p-4 flex flex-col items-center text-gray-600">
        <img src={offlineExamIcon} alt="No Offline Data" className="w-24 h-24 mb-2" />
        <p className="font-semibold text-center">No Offline data available yet. Kindly check later!</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 relative flex">
      {/* LEFT COLUMN: Filters + Table */}
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
          {/* Always show both "Online" & "Offline" */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Grade Mode</label>
            <select
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* If Online mode + we do have some online data => show the filter dropdowns */}
          {selectedMode === "Online" && onlineGrades.length > 0 && (
            <>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-600 mb-1">Type</label>
                <select
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
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
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
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
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none w-48 truncate"
                  aria-label="Chapter Name"
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                >
                  {uniqueChapters.map((chap) => (
                    <option key={chap} value={chap} title={chap}>
                      {chap.length > 20 ? chap.substring(0, 20) + "..." : chap}
                    </option>
                  ))}
                </select>
              </div>


              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-600 mb-1">Status</label>
                <select
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
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

          {/* If Offline mode + we do have some offline data => show the search box */}
          {selectedMode === "Offline" && offlineGrades.length > 0 && (
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Search Exams</label>
              <input
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* If there's no data for the selected mode => show fallback message. Otherwise, show table */}
        {noModeDataMessage ? (
          noModeDataMessage
        ) : (
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={{ pageSize: 5 }}
            rowKey={(record) => record._id || Math.random()}
          />
        )}
      </div>

      {/* Vertical Divider */}
      <div className="w-[1px] bg-gray-300 h-full min-h-screen mx-4" />

      {/* RIGHT COLUMN: Student Info + Grade Summary */}
      <div className="w-1/4 pl-4">
        <div className="mb-4 flex flex-col items-center">
          <div className="w-26 h-26 flex items-center justify-center rounded-full border-[2px] border-gray-300 p-0.5">
            <img
              src={student?.profile || fallbackStudentImage}
              alt="Student Profile"
              className="w-24 h-24 object-cover rounded-full"
            />
          </div>

          <h3 className="mt-2 text-md font-semibold text-gray-700">
            {student?.fullName || "N/A"}
          </h3>
        </div>


        <hr className="mb-4" />

        {/* Grade Summary (TOTAL SCORE at top) */}
        <div className="flex items-center justify-between my-7">
          <p className="text-xl font-semibold">Total Score</p>
          <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xl font-bold px-4 py-2 rounded-full shadow-lg">
            {total ?? 0}
          </span>
        </div>

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
