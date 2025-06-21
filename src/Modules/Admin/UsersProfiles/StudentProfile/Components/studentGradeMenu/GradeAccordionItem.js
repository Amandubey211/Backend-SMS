import React, { useState } from "react";
import {
  MdOutlineQuiz,
  MdAssignment,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { FiAlertCircle, FiBook } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Empty, Tooltip, Tag, Progress, Divider, Table } from "antd";
import { BsBookmarkCheck, BsBookmarkX } from "react-icons/bs";
import { RiTestTubeFill } from "react-icons/ri";
import { FaChalkboardTeacher } from "react-icons/fa";
import { LoadingOutlined } from "@ant-design/icons";

const GradeAccordionItem = ({
  getData,
  selectedMode,
  loading,
  selectedSubjectId,
}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { grades, studentSubjectProgress, error } = useSelector(
    (store) => store.admin.all_students
  );

  const toggleExpand = (index, subjectId, subjectName) => {
    const newIndex = expandedIndex === index ? null : index;
    setExpandedIndex(newIndex);
    if (newIndex !== null) {
      getData(subjectId, subjectName);
    }
  };

  const getColorForStatus = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "submit":
      case "submitted":
      case "present":
      case "completed":
      case "graded":
        return "green";
      case "pending":
      case "in progress":
      case "absent":
        return "orange";
      case "failed":
      case "missing":
      case "late":
        return "red";
      case "excused":
      case "exempt":
        return "blue";
      default:
        return "gray";
    }
  };

  const getStatusTag = (status) => {
    const color = getColorForStatus(status);
    return (
      <Tag color={color} className="capitalize text-xs">
        {status?.toLowerCase() || "N/A"}
      </Tag>
    );
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "submit":
      case "submitted":
      case "present":
      case "completed":
      case "graded":
        return <BsBookmarkCheck className="text-green-500 text-sm" />;
      case "pending":
      case "in progress":
      case "absent":
        return (
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" />
        );
      case "failed":
      case "missing":
      case "late":
        return <BsBookmarkX className="text-red-500 text-sm" />;
      case "excused":
      case "exempt":
        return <FiAlertCircle className="text-blue-500 text-sm" />;
      default:
        return <FiBook className="text-gray-400 text-sm" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "quiz":
        return <MdOutlineQuiz className="text-purple-500 text-sm" />;
      case "assignment":
        return <MdAssignment className="text-pink-500 text-sm" />;
      case "test":
        return <RiTestTubeFill className="text-red-500 text-sm" />;
      case "lecture":
        return <FaChalkboardTeacher className="text-blue-500 text-sm" />;
      default:
        return <FiBook className="text-gray-400 text-sm" />;
    }
  };

  const getTypeTag = (type) => {
    const typeLower = type?.toLowerCase();
    let color = "gray";
    if (typeLower === "quiz") color = "purple";
    if (typeLower === "assignment") color = "pink";
    if (typeLower === "test") color = "red";
    if (typeLower === "lecture") color = "blue";

    return (
      <Tag color={color} className="capitalize text-xs">
        {type?.toLowerCase() || "N/A"}
      </Tag>
    );
  };

  const calculateTotalScore = () => {
    if (!grades?.grades) return { score: 0, maxMarks: 0, percentage: 0 };

    const result = grades.grades.reduce(
      (acc, grade) => {
        const score = parseInt(grade.score) || 0;
        const maxMarks = parseInt(grade.maxMarks) || 0;
        return {
          score: acc.score + score,
          maxMarks: acc.maxMarks + maxMarks,
        };
      },
      { score: 0, maxMarks: 0 }
    );

    const percentage =
      result.maxMarks > 0
        ? Math.round((result.score / result.maxMarks) * 100)
        : 0;

    return { ...result, percentage };
  };

  const countActivitiesByType = (type) => {
    if (!grades?.grades) return 0;
    return grades.grades.filter(
      (activity) => activity.type?.toLowerCase() === type.toLowerCase()
    ).length;
  };

  const columns = [
    {
      title: "Activity",
      dataIndex: "Name",
      key: "Name",
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          <span className="font-medium text-gray-800 text-sm truncate block max-w-[180px]">
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(type)}
          {getTypeTag(type)}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(status)}
          {getStatusTag(status)}
        </div>
      ),
    },
    {
      title: "Score",
      key: "score",
      render: (_, record) => (
        <div className="flex items-center gap-2 w-full">
          <Progress
            percent={
              record.maxMarks > 0
                ? Math.round((record.score / record.maxMarks) * 100)
                : 0
            }
            status={
              record.maxMarks > 0 &&
              (record.score / record.maxMarks) * 100 >= 80
                ? "success"
                : record.maxMarks > 0 &&
                  (record.score / record.maxMarks) * 100 >= 50
                ? "active"
                : "exception"
            }
            strokeWidth={12}
            strokeColor={
              record.maxMarks > 0 &&
              (record.score / record.maxMarks) * 100 >= 80
                ? "#10B981"
                : record.maxMarks > 0 &&
                  (record.score / record.maxMarks) * 100 >= 50
                ? "#F59E0B"
                : "#EF4444"
            }
            showInfo={false}
            className="flex-1"
          />
          <span className="text-xs font-medium w-16 text-right">
            {record.score || 0}/{record.maxMarks || 0}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full text-sm space-y-4">
      {error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4"
        >
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
            <FiAlertCircle className="text-red-500 mt-0.5 text-lg" />
            <div>
              <h4 className="font-medium text-red-800 text-sm mb-1">
                Error Loading Data
              </h4>
              <p className="text-xs text-red-600">
                {error.message || "Failed to load subject progress."}
              </p>
            </div>
          </div>
        </motion.div>
      ) : loading && !studentSubjectProgress ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#C83B62]/10 to-[#7F35CD]/10 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
                <div className="w-6 h-6 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : studentSubjectProgress?.length > 0 ? (
        studentSubjectProgress.map((subject, index) => (
          <motion.div
            key={subject.subjectId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all ${
              selectedSubjectId === subject.subjectId
                ? "ring-2 ring-purple-500 border-purple-500"
                : "hover:shadow-md"
            }`}
          >
            {/* Accordion Header */}
            <motion.div
              className={`cursor-pointer p-4 flex items-center justify-between transition-colors ${
                expandedIndex === index ? "bg-gray-50" : "hover:bg-gray-50"
              }`}
              onClick={() =>
                toggleExpand(index, subject.subjectId, subject.subjectName)
              }
            >
              <div className="flex items-center gap-4">
                {subject.subjectIcon ? (
                  <img
                    src={subject.subjectIcon}
                    className="h-12 w-12 object-cover rounded-lg"
                    alt={subject.subjectName}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-[#C83B62] to-[#7F35CD] flex items-center justify-center shadow-sm">
                    <FiBook className="text-white text-lg" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-800 text-base">
                    {subject.subjectName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {subject.subjectCode}
                  </p>
                  {expandedIndex === index && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {countActivitiesByType("quiz")} Quizzes
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        {countActivitiesByType("assignment")} Assignments
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {expandedIndex === index && loading && (
                  <LoadingOutlined className="text-purple-500" />
                )}
                <motion.div
                  animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  {expandedIndex === index ? (
                    <MdKeyboardArrowUp className="text-gray-500 text-xl" />
                  ) : (
                    <MdKeyboardArrowDown className="text-gray-500 text-xl" />
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Accordion Content */}
            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    {loading ? (
                      <div className="space-y-4 py-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                              <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                            </div>
                            <div className="h-4 bg-gray-100 rounded w-12 animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    ) : grades?.grades?.length > 0 ? (
                      <div className="space-y-4">
                        <Table
                          columns={columns}
                          dataSource={grades.grades}
                          rowKey={(record) => record.id || record.Name}
                          pagination={false}
                          className="rounded-lg border border-gray-200"
                          scroll={{ x: true }}
                        />

                        {/* Summary Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-gradient-to-r from-[#C83B62]/5 to-[#7F35CD]/5 rounded-xl border border-gray-200 p-4"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-gray-800">
                              Overall Performance
                            </h4>
                            <Tag
                              color="purple"
                              className="font-medium text-sm px-2 py-1"
                            >
                              {calculateTotalScore().percentage}%
                            </Tag>
                          </div>
                          <Progress
                            percent={calculateTotalScore().percentage}
                            status={
                              calculateTotalScore().percentage >= 80
                                ? "success"
                                : calculateTotalScore().percentage >= 50
                                ? "active"
                                : "exception"
                            }
                            strokeColor={
                              calculateTotalScore().percentage >= 80
                                ? "#10B981"
                                : calculateTotalScore().percentage >= 50
                                ? "#F59E0B"
                                : "#EF4444"
                            }
                            strokeWidth={10}
                            className="mb-2"
                          />
                          <Divider className="my-3" />
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-xs text-gray-500">
                                Total Assignments
                              </p>
                              <p className="font-medium text-lg text-gray-800">
                                {grades.grades.length}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Total Score
                              </p>
                              <p className="font-medium text-lg text-gray-800">
                                {calculateTotalScore().score}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Max Possible
                              </p>
                              <p className="font-medium text-lg text-gray-800">
                                {calculateTotalScore().maxMarks}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={
                            <span className="text-sm text-gray-500">
                              No grades available for this subject
                            </span>
                          }
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm"
        >
          <Empty
            image={
              <div className="bg-gradient-to-r from-[#C83B62]/10 to-[#7F35CD]/10 p-6 rounded-full">
                <FiBook className="text-gradient bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-3xl" />
              </div>
            }
            description={
              <div className="mt-4 text-center">
                <h4 className="text-base font-medium text-gray-800 mb-1 ">
                  No subjects found
                </h4>
                <p className="text-sm text-gray-500">
                  There are currently no subjects assigned to this student
                </p>
              </div>
            }
          />
        </motion.div>
      )}
    </div>
  );
};

export default GradeAccordionItem;
