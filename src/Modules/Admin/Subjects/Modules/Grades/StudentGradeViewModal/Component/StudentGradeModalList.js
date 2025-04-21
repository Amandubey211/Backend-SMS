import React from "react";
import { Empty, Button, Skeleton } from "antd";
import { motion } from "framer-motion";

// ------------------
// TableSkeleton Component
// ------------------
const MotionTr = motion.tr;
const MotionTableRow = (props) => (
  <MotionTr
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    {...props}
  />
);

const TableSkeleton = () => {
  const skeletonRows = 10;
  const rowStyle = {
    display: "flex",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #f0f0f0",
  };

  return (
    <div style={{ padding: 16, background: "#fff" }}>
      {Array.from({ length: skeletonRows }).map((_, index) => (
        <div key={index} style={rowStyle}>
          <div style={{ flex: 2, display: "flex", alignItems: "center" }}>
            <Skeleton.Avatar
              active
              size="small"
              shape="circle"
              style={{ marginRight: 8 }}
            />
            <Skeleton.Input active size="small" style={{ width: 80 }} />
          </div>
          <div style={{ flex: 1, padding: "0 8px" }}>
            <Skeleton.Input active size="small" style={{ width: "100%" }} />
          </div>
          <div style={{ flex: 1, padding: "0 8px" }}>
            <Skeleton.Input active size="small" style={{ width: "100%" }} />
          </div>
          <div style={{ flex: 1, padding: "0 8px" }}>
            <Skeleton.Input active size="small" style={{ width: "100%" }} />
          </div>
          <div style={{ flex: 1, padding: "0 8px" }}>
            <Skeleton.Input active size="small" style={{ width: "100%" }} />
          </div>
          <div style={{ flex: 1, padding: "0 8px" }}>
            <Skeleton.Input active size="small" style={{ width: "100%" }} />
          </div>
        </div>
      ))}
    </div>
  );
};

// ------------------
// Helper Functions for Status Formatting
// ------------------
const getStatusClass = (status) => {
  switch (status) {
    case "Submit":
      return "text-green-700";
    case "Excused":
      return "text-yellow-500";
    case "Missing":
      return "text-red-700";
    default:
      return "text-gray-500";
  }
};

const capitalizeText = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const getFormattedStatus = (status, gradeMode) => {
  if (gradeMode === "offline") {
    if (status === "submitted") {
      return "Submit";
    } else if (status === "present") {
      return "Present";
    } else if (status === "absent") {
      return "Missing";
    } else if (status === "excused") {
      return "Excused";
    }
  }
  return capitalizeText(status);
};

// ------------------
// StudentModalGradeList Component
// ------------------
const StudentModalGradeList = ({
  data,
  filters,
  tableLoading,
  onResetFilters,
}) => {
  // Apply status filtering only for online mode.
  let filteredData = data?.filter((item) => {
    if (filters.gradeMode === "online" && filters.status) {
      return item.status === filters.status;
    }
    return true;
  });

  // Filter based on mode.
  if (filters.gradeMode === "offline") {
    filteredData = filteredData?.filter((item) => item.mode === "offline");
    // Apply search filter for offline mode.
    if (filters.search) {
      filteredData = filteredData.filter((item) =>
        item.Name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
  } else {
    filteredData = filteredData?.filter((item) => item.mode === "online");
  }

  // If table is loading, show the TableSkeleton (shimmer UI)
  if (tableLoading) {
    return <TableSkeleton />;
  }

  // If no data is found, display an Empty UI with a Reset Filters button.
  if (!filteredData || filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Empty description={<span>No results found</span>} />
        {onResetFilters && (
          <Button type="primary" onClick={onResetFilters} className="mt-4">
            Reset Filters
          </Button>
        )}
      </div>
    );
  }

  // Helper for applying bold styling based on filter criteria.
  const getBoldClass = (item) => {
    const isBold =
      (filters.arrangeBy && item.type === filters.arrangeBy) ||
      (filters.module && item.module === filters.module) ||
      (filters.chapter && item.chapter === filters.chapter) ||
      (filters.status && item.status === filters.status);
    return isBold ? "font-bold bg-purple-50" : "";
  };

  return (
    <div className=" px-3">
      <table className="min-w-full border  divide-y divide-gray-200 ">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            {filters.gradeMode === "online" && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Module
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData?.map((item, index) => (
            <tr key={index} className={getBoldClass(item)}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item?.Name}</div>
                <div className="mt-1">
                  {item?.type && (
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        item?.type.toLowerCase() === "assignment"
                          ? "bg-blue-100 text-blue-800"
                          : item?.type.toLowerCase() === "quiz"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item?.type}
                    </span>
                  )}
                </div>
              </td>
              {filters.gradeMode === "online" && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {item?.moduleName}
                  </div>
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item?.dueDate?.slice(0, 10) || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.submittedDate ? item?.submittedDate.slice(0, 10) : "-"}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm ${getStatusClass(
                  getFormattedStatus(item?.status, filters.gradeMode)
                )}`}
              >
                {getFormattedStatus(item?.status, filters.gradeMode)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item?.score} / {item?.maxMarks}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentModalGradeList;
