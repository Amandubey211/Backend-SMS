import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Modal, Skeleton, Table, Button } from "antd";

import offlineExamIcon from "../../../Assets/ParentAssets/images/offline_exam.png";
import onlineExamIcon from "../../../Assets/ParentAssets/images/online_exam.png";
import profileIcon from "../../../Assets/DashboardAssets/profileIcon.png"; // Fallback image for student
import { fetchParentStudentGrades } from "../../../Store/Slices/Parent/Grades/parentGrade.action";
import { GrScorecard } from "react-icons/gr";
import { fetchSemestersByClass } from "../../../Store/Slices/Parent/Semesters/parentSemester.action";
import { t } from "i18next";
import { DownOutlined } from "@ant-design/icons";

const StudentGradesAccordion = () => {
  const dispatch = useDispatch();
  const { studentId } = useParams();

  // Identify the child from Redux state
  const { children, selectedChild } = useSelector(
    (state) => state.Parent.children || {}
  );
  const Child = children?.find((child) => child.id === studentId);

  // Redux "grades" slice state
  const { loading, grades: gradesResponse = {} } = useSelector(
    (state) => state?.Parent?.grades
  );

  // Destructure the fields from gradesResponse
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

  // Local filters for grades
  const [selectedMode, setSelectedMode] = useState("Online"); // Default mode is Online
  const [selectedType, setSelectedType] = useState("All");
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedChapter, setSelectedChapter] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch semesters when child or class changes
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

  // Fetch grades based on selected semester, mode, and class
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

  // Fetch grades again when mode changes
  useEffect(() => {
    if (Child?.presentClassId && selectedMode) {
      dispatch(
        fetchParentStudentGrades({
          params: {},
          studentId,
          studentClassId: Child.presentClassId,
          semesterId: selectedSemester,
        })
      );
    }
  }, [selectedMode, Child, dispatch, studentId, selectedSemester]);

  // Handler for semester selection modal
  const handleSemesterSelect = (sem) => {
    setSelectedSemester(sem._id);
    setSemesterModalVisible(false);
  };

  // Split grades into online and offline categories
  const onlineGrades = useMemo(
    () => grades.filter((g) => g.mode === "online"),
    [grades]
  );
  const offlineGrades = useMemo(
    () => grades.filter((g) => g.mode === "offline"),
    [grades]
  );

  // Generate unique filter options for online mode
  const uniqueTypes = useMemo(
    () => ["All", ...new Set(onlineGrades.map((g) => g.type).filter(Boolean))],
    [onlineGrades]
  );
  const uniqueModules = useMemo(
    () => [
      "All",
      ...new Set(onlineGrades.map((g) => g.moduleName).filter(Boolean)),
    ],
    [onlineGrades]
  );
  const uniqueChapters = useMemo(
    () => [
      "All",
      ...new Set(onlineGrades.map((g) => g.chapterName).filter(Boolean)),
    ],
    [onlineGrades]
  );
  const uniqueStatuses = useMemo(
    () => [
      "All",
      ...new Set(onlineGrades.map((g) => g.status).filter(Boolean)),
    ],
    [onlineGrades]
  );

  // Filter online grades based on selected filters
  const filteredGradesOnline = useMemo(() => {
    return onlineGrades.filter((g) => {
      if (selectedType !== "All" && g.type !== selectedType) return false;
      if (selectedModule !== "All" && g.moduleName !== selectedModule)
        return false;
      if (selectedChapter !== "All" && g.chapterName !== selectedChapter)
        return false;
      if (selectedStatus !== "All" && g.status !== selectedStatus) return false;
      return true;
    });
  }, [
    onlineGrades,
    selectedType,
    selectedModule,
    selectedChapter,
    selectedStatus,
  ]);

  // Filter offline grades based on search term
  const filteredGradesOffline = useMemo(() => {
    return offlineGrades.filter((g) => {
      if (
        searchTerm &&
        !g.Name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [offlineGrades, searchTerm]);

  // Utility function to render status tags
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

  // Utility function to render type tags
  const renderTypeTag = (type) => {
    if (!type) return null;
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
    let bgColor = "bg-gray-100 text-gray-600";
    if (type.toLowerCase() === "assignment")
      bgColor = "bg-purple-100 text-purple-700";
    else if (type.toLowerCase() === "quiz")
      bgColor = "bg-green-100 text-green-700";
    else if (type.toLowerCase() === "exam")
      bgColor = "bg-blue-100 text-blue-700";
    else if (type.toLowerCase() === "project")
      bgColor = "bg-yellow-100 text-yellow-700";
    return (
      <span
        className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${bgColor}`}
      >
        {formattedType}
      </span>
    );
  };

  // Define columns for the offline grades table
  const offlineColumns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      render: (text, record) => (
        <div>
          {text.toUpperCase() || "-"} {renderTypeTag(record.type)}
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
      render: (score, record) => (
        <span>
          {score ?? 0} / {record.maxMarks || 0}
        </span>
      ),
    },
  ];

  // Define columns for the online grades table
  const onlineColumns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      render: (text, record) => (
        <div>
          {text.charAt(0).toUpperCase() + text.slice(1)}{" "}
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
      render: (score, record) => (
        <span>
          {score ?? 0} / {record.maxMarks || 0}
        </span>
      ),
    },
  ];

  // Determine which columns and data to use based on the selected mode
  let columns;
  let dataSource;
  if (selectedMode === "Offline") {
    columns = offlineColumns;
    dataSource = filteredGradesOffline;
  } else {
    columns = onlineColumns;
    dataSource = filteredGradesOnline;
  }

  // Fallback if no grades exist
  // const noGradesFallback = (
  //   <div className="flex flex-col items-center justify-center min-h-screen flex-grow">
  //     <GrScorecard className="w-12 h-12 mb-2"/>
  //     <p className="text-gray-600 text-lg font-semibold text-center">
  //       No Grades Present for{" "}
  //       {selectedChild?.name?.split(" ")[0] || "this student"} yet.
  //       <br />
  //       Kindly check later!
  //     </p>
  //   </div>
  // );

  // If data is still loading
  if (loading) {
    return (
      <div className="w-full p-4 relative flex">
        {/* LEFT COLUMN: Filters + Table */}
        <div className="w-3/4 pr-4">
          {/* Semester Button */}
          <div className="mb-4">
            <Skeleton.Button active size="default" className="w-40" />
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-end gap-4 mb-4">
            {/* Grade Mode Select */}
            <div className="flex flex-col">
              <Skeleton.Input active size="small" className="w-32" />
            </div>

            {/* Filters for Online Mode */}
            {selectedMode === "Online" && onlineGrades.length > 0 && (
              <>
                <div className="flex flex-col">
                  <Skeleton.Input active size="small" className="w-32" />
                </div>

                <div className="flex flex-col">
                  <Skeleton.Input active size="small" className="w-32" />
                </div>

                <div className="flex flex-col">
                  <Skeleton.Input active size="small" className="w-32" />
                </div>

                <div className="flex flex-col">
                  <Skeleton.Input active size="small" className="w-32" />
                </div>

                {/* Reset All Button */}
                {selectedMode === "Online" && (
                  <Skeleton.Input active size="small" className="w-24" />
                )}
              </>
            )}

            {/* Skeleton Table Rows */}
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                columns={columns}
                dataSource={dataSource}
                rowKey={(record) => record._id || Math.random()}
                pagination={false} // Disable pagination
              />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Student Info + Grade Summary */}
        <div className="w-1/4 pl-4">
          {/* Skeleton for Student Info */}
          <div className="mb-4 flex flex-col items-center">
            <Skeleton.Avatar active size="large" />
            <Skeleton.Input active size="small" className="w-32 mt-2" />
          </div>

          <hr className="mb-4" />

          {/* Skeleton for Grade Summary */}
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  // Check if there's any data for the selected mode and semester
  const hasData = Child && semesters.length > 0 && grades.length > 0;
  // if (!hasData) {
  //   return <div className="w-full p-4 relative flex">{noGradesFallback}</div>;
  // }

  // Display message when no data is available for the selected mode
  let noModeDataMessage = null;
  if (selectedMode === "Online" && !onlineGrades.length) {
    noModeDataMessage = (
      <div className="p-4 flex flex-col items-center text-gray-600">
        <img
          src={onlineExamIcon}
          alt="No Online Data"
          className="w-24 h-24 mb-2"
        />
        <p className="font-semibold text-center">
          No Online data available yet. Kindly check later!
        </p>
      </div>
    );
  }
  if (selectedMode === "Offline" && !offlineGrades.length) {
    noModeDataMessage = (
      <div className="p-4 flex flex-col items-center text-gray-600">
        <img
          src={offlineExamIcon}
          alt="No Offline Data"
          className="w-24 h-24 mb-2"
        />
        <p className="font-semibold text-center">
          No Offline data available yet. Kindly check later!
        </p>
      </div>
    );
  }

  // Function to reset all filters
  const handleResetFilters = () => {
    setSelectedType("All");
    setSelectedModule("All");
    setSelectedChapter("All");
    setSelectedStatus("All");
    setSearchTerm("");
  };

  return (
    <div className="w-full p-4 relative flex">
      {/* LEFT COLUMN: Filters + Table */}
      <div className="w-3/4 pr-4">
        {/* Semester Button */}

        <div className="mb-4">
          <button
            onClick={() => setSemesterModalVisible(true)}
            className="flex items-center border border-pink-400 bg-white text-black font-semibold px-4 py-1 rounded-md transition-colors"
          >
            {/* Display selected semester or "Select Semester" */}
            {(() => {
              if (!selectedSemester) return "Select Semester";
              const found = semesters.find((s) => s._id === selectedSemester);
              return found ? found.title : "Select Semester";
            })()}

            {/* Down Arrow Icon */}
            <DownOutlined className="ml-2" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-end gap-4 mb-4">
          {/* Grade Mode Select */}
          <div className="flex flex-col">
            <label className="text-sm  text-gray-600 mb-1">Grade Mode</label>
            <select
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* Filters for Online Mode */}
          {selectedMode === "Online" && onlineGrades.length > 0 && (
            <>
              <div className="flex flex-col">
                <label className="text-sm  text-gray-600 mb-1">Type</label>
                <select
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none"
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
                <label className="text-sm text-gray-600 mb-1">Module</label>
                <select
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none"
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
                <label className="text-sm text-gray-600 mb-1">Chapter</label>
                <select
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none w-48 truncate"
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                >
                  {uniqueChapters.map((chap) => (
                    <option key={chap} value={chap}>
                      {chap.length > 20 ? chap.substring(0, 20) + "..." : chap}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm  text-gray-600 mb-1">Status</label>
                <select
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none"
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

              <div className="flex flex-col">
                <label className="text-sm  text-gray-600 mb-1">
                  Hard Reset
                </label>
                {/* Reset All Button */}
                {selectedMode === "Online" && (
                  <Button
                    type="default"
                    onClick={handleResetFilters}
                    className="self-start px-4 py-1 rounded-md"
                  >
                    Reset All
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Search for Offline Exams */}
          {selectedMode === "Offline" && offlineGrades.length > 0 && (
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Search Exams</label>
              <input
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Display Table or No Data Message */}
        {noModeDataMessage ? (
          noModeDataMessage
        ) : (
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={(record) => record._id || Math.random()}
            pagination={false} // Disable pagination
          />
        )}
      </div>

      {/* Right Column: Student Info + Grade Summary */}
      <div className="w-1/4 pl-4">
        <div className="mb-4 flex flex-col items-center">
          <div className="w-26 h-26 flex items-center justify-center rounded-full border-[2px] border-gray-300 p-0.5">
            <img
              src={student?.profile || profileIcon} // Fallback image
              alt="Student Profile"
              className="w-24 h-24 object-cover rounded-full"
            />
          </div>

          <h3 className="mt-2 text-md font-semibold text-gray-700">
            {student?.fullName || "N/A"}
          </h3>
        </div>

        <hr className="mb-4" />

        {/* Grade Summary */}
        <div className="flex items-center justify-between my-7">
          <p className="text-xl font-semibold">Total Score</p>
          <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xl font-bold px-4 py-2 rounded-full shadow-lg">
            {total ?? 0}
          </span>
        </div>

        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Grade Summary
        </h3>
        <div className="flex items-center justify-between mb-2 text-gray-600">
          <span>Assignment</span>
          <span>
            {totalScoreOfSubmitAssignments ?? 0} /{" "}
            {totalScoreOfAllAssignments ?? 0}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2 text-gray-600">
          {/* <span>Group Assignment</span>
          <span>
            {submittedGroupAssignmentScore ?? 0} /{" "}
            {totalGroupAssignmentScore ?? 0}
          </span> */}
        </div>
        <div className="flex items-center justify-between mb-2 text-gray-600">
          <span>Quiz</span>
          <span>
            {totalQuizCompletedScore ?? 0} / {totalScoreOfAllQuizzes ?? 0}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2 text-gray-600">
          {/* <span>Group Quiz</span>
          <span>
            {submittedGroupQuizScore ?? 0} / {totalGroupQuizScore ?? 0}
          </span> */}
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
