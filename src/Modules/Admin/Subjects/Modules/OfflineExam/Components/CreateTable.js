import React from "react";
import { DatePicker, Tooltip } from "antd";

// Ant Design Icons
import {
  DeleteOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled,
} from "@ant-design/icons";

function CreateTable({
  headers,
  selectedExamType,
  setSelectedExamType,
  selectedExamName,
  setSelectedExamName,
  enteredMaxScore,
  setEnteredMaxScore,
  selectedStartDate,
  setSelectedStartDate,
  selectedEndDate,
  setSelectedEndDate,
  tableData,
  removeRow,
  formatDate,
  handleCellChange,
  inputClassName = () => "",
}) {
  // Decide row background color based on status
  const getStatusBgClass = (status) => {
    if (status === "present") return "bg-green-50";
    if (status === "absent") return "bg-red-50";
    if (status === "excused") return "bg-orange-50";
    return "";
  };

  return (
    <div>
      <div className="flex flex-col justify-between">
        <div
          className="overflow-x-auto overflow-y-auto max-h-[1000px] mb-7 scroll-smooth scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400"
          style={{ scrollbarWidth: "thin", scrollbarHeight: "3px" }}
        >
          <table className="w-full border-collapse border table-auto mb-5">
            <thead>
              <tr className="bg-gray-100 text-sm">
                {headers.map((header, colIdx) => (
                  <th
                    key={colIdx}
                    className="border text-center font-medium align-top"
                    style={{
                      minWidth:
                        header === "Actions"
                          ? "50px"
                          : header === "Max Score" ||
                            header === "Obtained Score"
                          ? "60px"
                          : "120px",
                      whiteSpace: "nowrap",
                      padding: "8px",
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{header}</span>
                      {header === "Exam Type" && (
                        <input
                          type="text"
                          placeholder="Type"
                          value={selectedExamType}
                          onChange={(e) => setSelectedExamType(e.target.value)}
                          className="w-[80px] focus:outline-none focus:ring p-1 border border-gray-200 rounded-md text-xs text-center"
                        />
                      )}
                      {header === "Exam Name" && (
                        <input
                          type="text"
                          placeholder="Exam"
                          value={selectedExamName}
                          onChange={(e) => setSelectedExamName(e.target.value)}
                          className={`w-[80px] focus:outline-none focus:ring p-1 border border-gray-200 rounded-md text-xs text-center ${inputClassName(
                            selectedExamName
                          )}`}
                        />
                      )}
                      {header === "Max Score" && (
                        <input
                          type="number"
                          placeholder="Max"
                          value={enteredMaxScore}
                          onChange={(e) => setEnteredMaxScore(e.target.value)}
                          className={`focus:outline-none focus:ring p-1 border border-gray-200 rounded-md text-xs text-center ${inputClassName(
                            enteredMaxScore
                          )}`}
                          style={{ width: "60px" }}
                        />
                      )}
                      {header === "Start Date" && (
                        <DatePicker
                          selected={selectedStartDate}
                          onChange={(date) =>
                            setSelectedStartDate(date ? new Date(date) : null)
                          }
                          className="h-6 text-pink-700 p-1 border border-gray-200 rounded-md text-xs text-center"
                          placeholderText="Start"
                        />
                      )}
                      {header === "End Date" && (
                        <DatePicker
                          selected={selectedEndDate}
                          onChange={(date) =>
                            setSelectedEndDate(date ? new Date(date) : null)
                          }
                          className="h-6 text-pink-700 p-1 border border-gray-200 rounded-md text-xs text-center"
                          placeholderText="End"
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIdx) => {
                const rowStatus = row[8];
                const rowBgClass = getStatusBgClass(rowStatus);

                return (
                  <tr key={rowIdx} className={`border ${rowBgClass}`}>
                    {row.map((cell, colIdx) => {
                      const header = headers[colIdx];

                      // Pre-Filled for entire exam
                      if (header === "Exam Type") {
                        return (
                          <td
                            key={colIdx}
                            className="border px-2 py-2 text-center"
                          >
                            <div className="text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                              {selectedExamType}
                            </div>
                          </td>
                        );
                      }
                      if (header === "Exam Name") {
                        return (
                          <td
                            key={colIdx}
                            className="border px-2 py-2 text-center"
                          >
                            <div className="text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                              {selectedExamName}
                            </div>
                          </td>
                        );
                      }
                      if (header === "Max Score") {
                        return (
                          <td
                            key={colIdx}
                            className="border px-2 py-2 text-center"
                            style={{ width: "60px" }}
                          >
                            <div className="text-gray-600 text-xs font-semibold rounded-full px-2 py-1">
                              {enteredMaxScore}
                            </div>
                          </td>
                        );
                      }
                      if (header === "Start Date") {
                        return (
                          <td
                            key={colIdx}
                            className="border px-2 py-2 text-center"
                          >
                            <div className="text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                              {selectedStartDate
                                ? formatDate(selectedStartDate)
                                : ""}
                            </div>
                          </td>
                        );
                      }
                      if (header === "End Date") {
                        return (
                          <td
                            key={colIdx}
                            className="border px-2 py-2 text-center"
                          >
                            <div className="text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                              {selectedEndDate
                                ? formatDate(selectedEndDate)
                                : ""}
                            </div>
                          </td>
                        );
                      }

                      // Delete action
                      if (header === "Actions") {
                        return (
                          <td
                            key={colIdx}
                            className="border px-2 py-2 text-center"
                            style={{ width: "50px" }}
                          >
                            <DeleteOutlined
                              onClick={() => removeRow(rowIdx)}
                              className="w-5 h-5 text-red-500 cursor-pointer mx-auto"
                            />
                          </td>
                        );
                      }

                      // Student name (with avatar)
                      if (header === "Name" && typeof cell === "object") {
                        return (
                          <td
                            key={colIdx}
                            className="border px-2 py-2 text-center"
                          >
                            <div className="flex items-center gap-2 justify-center">
                              {cell.avatar && (
                                <img
                                  src={cell.avatar}
                                  alt="avatar"
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              )}
                              <span className="text-xs font-medium">
                                {cell.name}
                              </span>
                            </div>
                          </td>
                        );
                      }

                      // Status icons (Present, Absent, Excused)
                      if (header === "Status") {
                        return (
                          <td
                            key={colIdx}
                            className="border px-2 py-2 text-center"
                          >
                            <div className="flex items-center gap-2 justify-center">
                              <Tooltip title="Present">
                                <CheckCircleFilled
                                  onClick={() =>
                                    handleCellChange(rowIdx, colIdx, "present")
                                  }
                                  style={{ fontSize: "1.25rem" }}
                                  className={`cursor-pointer ${
                                    cell === "present"
                                      ? "text-green-600"
                                      : "text-gray-400"
                                  }`}
                                />
                              </Tooltip>
                              <Tooltip title="Absent">
                                <CloseCircleFilled
                                  onClick={() =>
                                    handleCellChange(rowIdx, colIdx, "absent")
                                  }
                                  style={{ fontSize: "1.25rem" }}
                                  className={`cursor-pointer ${
                                    cell === "absent"
                                      ? "text-red-600"
                                      : "text-gray-400"
                                  }`}
                                />
                              </Tooltip>
                              <Tooltip title="Excused">
                                <InfoCircleFilled
                                  onClick={() =>
                                    handleCellChange(rowIdx, colIdx, "excused")
                                  }
                                  style={{ fontSize: "1.25rem" }}
                                  className={`cursor-pointer ${
                                    cell === "excused"
                                      ? "text-orange-600"
                                      : "text-gray-400"
                                  }`}
                                />
                              </Tooltip>
                            </div>
                          </td>
                        );
                      }

                      // Obtained Score
                      if (header === "Obtained Score") {
                        return (
                          <td
                            key={colIdx}
                            className="border px-2 py-2 text-center"
                            style={{ width: "60px" }}
                          >
                            <Tooltip
                              title={
                                cell && cell.toString().length > 4
                                  ? cell
                                  : undefined
                              }
                            >
                              <input
                                type="number"
                                className="w-full px-1 text-center focus:outline-none focus:ring text-xs"
                                value={cell}
                                onChange={(e) =>
                                  handleCellChange(
                                    rowIdx,
                                    colIdx,
                                    e.target.value
                                  )
                                }
                              />
                            </Tooltip>
                          </td>
                        );
                      }

                      // Default text inputs (e.g. "Admission Number")
                      return (
                        <td
                          key={colIdx}
                          className="border px-2 py-2 text-center"
                        >
                          <Tooltip
                            title={
                              cell && cell.toString().length > 7
                                ? cell
                                : undefined
                            }
                          >
                            <input
                              type="text"
                              className="w-full px-1 text-center focus:outline-none focus:ring text-xs"
                              value={cell}
                              onChange={(e) =>
                                handleCellChange(rowIdx, colIdx, e.target.value)
                              }
                            />
                          </Tooltip>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CreateTable;
