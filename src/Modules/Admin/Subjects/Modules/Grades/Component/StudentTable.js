import React from "react";
import { Table, Empty, Avatar, Tooltip, Skeleton } from "antd";
import { motion } from "framer-motion";
import profileIcon from "../../../../../../Assets/DashboardAssets/profileIcon.png";

// Custom animated row using Framer Motion
const MotionTr = motion.tr;
const MotionTableRow = (props) => (
  <MotionTr
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    {...props}
  />
);

// Override default row rendering with our animated row
const components = {
  body: {
    row: MotionTableRow,
  },
};

/**
 * TableSkeleton renders a custom skeleton UI that mimics the table rows.
 * It uses a flex layout to simulate the columns of the table.
 */
 export const TableSkeleton = () => {
  // Number of skeleton rows to display
  const skeletonRows = 10;

  // Define a style object for each skeleton row container
  const rowStyle = {
    display: "flex",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #f0f0f0",
  };

  // Flex distribution for each column:
  // Student column gets flex: 2; the others get flex: 1 each.
  return (
    <div style={{ padding: 16, background: "#fff" }}>
      {Array.from({ length: skeletonRows }).map((_, index) => (
        <div key={index} style={rowStyle}>
          {/* Student Column: Avatar + Text Skeleton */}
          <div style={{ flex: 2, display: "flex", alignItems: "center" }}>
            <Skeleton.Avatar
              active
              size="small"
              shape="circle"
              style={{ marginRight: 8 }}
            />
            <Skeleton.Input active size="small" style={{ width: 80 }} />
          </div>
          {/* Group Column */}
          <div style={{ flex: 1, padding: "0 8px" }}>
            <Skeleton.Input active size="small" style={{ width: "100%" }} />
          </div>
          {/* Assignments Column */}
          <div style={{ flex: 1, padding: "0 8px" }}>
            <Skeleton.Input active size="small" style={{ width: "100%" }} />
          </div>
          {/* Quizzes Column */}
          <div style={{ flex: 1, padding: "0 8px" }}>
            <Skeleton.Input active size="small" style={{ width: "100%" }} />
          </div>
          {/* Offline Marks Column */}
          <div style={{ flex: 1, padding: "0 8px" }}>
            <Skeleton.Input active size="small" style={{ width: "100%" }} />
          </div>
          {/* Attendance Column */}
          <div style={{ flex: 1, padding: "0 8px" }}>
            <Skeleton.Input active size="small" style={{ width: "100%" }} />
          </div>
          {/* Score (%) Column */}
          <div style={{ flex: 1, padding: "0 8px" }}>
            <Skeleton.Input active size="small" style={{ width: "100%" }} />
          </div>
        </div>
      ))}
    </div>
  );
};

const StudentTable = ({ students, loading, onRowClick }) => {
  // Define table columns with enhanced sorting, tooltips, and custom cell styling
  const columns = [
    {
      title: "Student",
      dataIndex: "studentName",
      key: "studentName",
      sorter: (a, b) => a.studentName.localeCompare(b.studentName),
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={record.studentProfile || profileIcon}
            alt={record.studentName}
          />
          <div style={{ marginLeft: 8 }}>
            <Tooltip title={record.studentName}>
              <div style={{ fontWeight: 500 }}>{record.studentName}</div>
            </Tooltip>
            <div style={{ color: "green" }}>
              {record.section || "Section 1"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
      render: (text) => (
        <Tooltip title={text ? text : "No group assigned"}>
          <span style={{ color: text ? "inherit" : "#f56565" }}>
            {text || "No Group"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Assignments",
      key: "assignments",
      sorter: (a, b) =>
        a.completedAssignmentsScore - b.completedAssignmentsScore,
      render: (text, record) => (
        <div
          style={{
            border: "1px solid #ec4899",
            color: "#ec4899",
            padding: "4px",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          {record.completedAssignmentsScore} / {record.totalAssignmentsPoints}
        </div>
      ),
    },
    {
      title: "Quizzes",
      key: "quizzes",
      sorter: (a, b) => a.completedQuizzes - b.completedQuizzes,
      render: (text, record) => (
        <div
          style={{
            border: "1px solid #10b981",
            color: "#10b981",
            padding: "4px",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          {record.completedQuizzes} / {record.totalQuizzes}
        </div>
      ),
    },
    {
      title: "Offline Marks",
      key: "offline",
      sorter: (a, b) =>
        a.completedOfflineExamScore - b.completedOfflineExamScore,
      render: (text, record) => (
        <div
          style={{
            border: "1px solid #3b82f6",
            color: "#3b82f6",
            padding: "4px",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          {record.completedOfflineExamScore} / {record.totalOfflineMaxMarks}
        </div>
      ),
    },
    {
      title: "Attendance",
      dataIndex: "attendance",
      key: "attendance",
      align: "center",
    },
    {
      title: "Score (%)",
      dataIndex: "score",
      key: "score",
      align: "center",
      render: (value) => (
        <span style={{ color: "#ec4899" }}>
          {value === "NaN" ? 0 : value} %
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: 16, background: "#fff" }}>
      {loading ? (
        <TableSkeleton />
      ) : (
        <Table
          components={components}
          columns={columns}
          dataSource={students}
          rowKey="studentId"
          // Make the entire row clickable and add keyboard focus support
          onRow={(record) => ({
            onClick: () => onRowClick(record),
            style: { cursor: "pointer" },
            tabIndex: 0,
            onKeyPress: (e) => {
              if (e.key === "Enter") onRowClick(record);
            },
            "aria-label": `View details for ${record.studentName}`,
          })}
          locale={{ emptyText: <Empty description="No data found" /> }}
          pagination={{ pageSize: 10, responsive: true }}
        />
      )}
    </div>
  );
};

export default StudentTable;
