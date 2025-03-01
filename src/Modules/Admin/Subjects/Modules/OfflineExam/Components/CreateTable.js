import { DatePicker, Select } from "antd";
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

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
  return (
    <div>
      <div className="flex flex-col justify-between">
        <div
          className="overflow-x-auto overflow-y-auto max-h-[1000px] mb-7 scroll-smooth scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400"
          style={{ scrollbarWidth: "thin", scrollbarHeight: "3px" }}
        >
          <table className="w-full border-collapse border table-auto mb-5">
            <thead>
              <tr className="bg-gray-100">
                {headers.map((header, colIdx) => (
                  <th
                    key={colIdx}
                    className="border px-2 pt-2 text-center font-medium text-sm cursor-pointer align-top"
                    style={{
                      minWidth: "150px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div className="flex flex-col items-center w-full">
                      <span>{header}</span>
                      {/* For entire exam fields in the header */}
                      {header === "Exam Type" && (
                        <input
                          type="text"
                          placeholder="Enter Type"
                          value={selectedExamType}
                          onChange={(e) => setSelectedExamType(e.target.value)}
                          className="w-full text-pink-700 align-middle focus:outline-none focus:ring p-1 border border-gray-200 rounded-md m-2 text-xs font-medium capitalize text-center"
                        />
                      )}
                      {header === "Exam Name" && (
                        <input
                          type="text"
                          placeholder="Enter Exam"
                          value={selectedExamName}
                          onChange={(e) => setSelectedExamName(e.target.value)}
                          className={inputClassName(selectedExamName)}
                        />
                      )}
                      {header === "Max Score" && (
                        <input
                          type="number"
                          placeholder="Enter Max Score"
                          value={enteredMaxScore}
                          onChange={(e) => setEnteredMaxScore(e.target.value)}
                          className={inputClassName(enteredMaxScore)}
                        />
                      )}
                      {header === "Start Date" && (
                        <DatePicker
                          selected={selectedStartDate}
                          onChange={(date) =>
                            setSelectedStartDate(date ? new Date(date) : null)
                          }
                          className="w-full h-6 text-pink-700 p-1 border border-gray-200 rounded-md m-2 font-medium text-xs text-center"
                          placeholderText="Select Start Date"
                        />
                      )}
                      {header === "End Date" && (
                        <DatePicker
                          selected={selectedEndDate}
                          onChange={(date) =>
                            setSelectedEndDate(date ? new Date(date) : null)
                          }
                          className="w-full h-6 text-pink-700 p-1 border border-gray-200 rounded-md m-2 font-medium text-xs text-center"
                          placeholderText="Select End Date"
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIdx) => (
                <tr key={rowIdx} className="border">
                  {row.map((cell, colIdx) => {
                    const header = headers[colIdx];

                    if (header === "Exam Type") {
                      return (
                        <td
                          key={colIdx}
                          className="border px-4 py-2 text-center"
                        >
                          <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                            {selectedExamType}
                          </div>
                        </td>
                      );
                    }

                    if (header === "Exam Name") {
                      return (
                        <td
                          key={colIdx}
                          className="border px-4 py-2 text-center"
                        >
                          <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                            {selectedExamName}
                          </div>
                        </td>
                      );
                    }

                    if (header === "Max Score") {
                      return (
                        <td
                          key={colIdx}
                          className="border px-4 py-2 text-center"
                        >
                          <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                            {enteredMaxScore}
                          </div>
                        </td>
                      );
                    }

                    if (header === "Start Date") {
                      return (
                        <td
                          key={colIdx}
                          className="border px-4 py-2 text-center"
                        >
                          <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
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
                          className="border px-4 py-2 text-center"
                        >
                          <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                            {selectedEndDate ? formatDate(selectedEndDate) : ""}
                          </div>
                        </td>
                      );
                    }

                    if (header === "Actions") {
                      return (
                        <td
                          key={colIdx}
                          className="border px-4 py-2 text-center"
                          style={{ minWidth: "80px" }}
                        >
                          <div className="w-full flex justify-center">
                            <RiDeleteBin6Line
                              onClick={() => removeRow(rowIdx)}
                              className="w-5 h-5 text-red-500 cursor-pointer"
                            />
                          </div>
                        </td>
                      );
                    }

                    if (header === "Name" && typeof cell === "object") {
                      return (
                        <td
                          key={colIdx}
                          className="border px-4 py-2 text-center"
                        >
                          <div className="flex items-center gap-2 justify-center">
                            {cell.avatar && (
                              <img
                                src={cell.avatar}
                                alt="avatar"
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            )}
                            <span className="text-sm font-medium">
                              {cell.name}
                            </span>
                          </div>
                        </td>
                      );
                    }

                    if (header === "Status") {
                      return (
                        <td
                          key={colIdx}
                          className="border px-4 py-2 text-center"
                        >
                          <Select
                            style={{ width: 90 }}
                            value={cell || "present"}
                            onChange={(value) =>
                              handleCellChange(rowIdx, colIdx, value)
                            }
                            options={[
                              {
                                value: "present",
                                label: (
                                  <span className="text-green-600 text-xs font-medium bg-green-100 px-3 rounded-3xl">
                                    Present
                                  </span>
                                ),
                              },
                              {
                                value: "absent",
                                label: (
                                  <span className="text-red-600 text-xs font-medium bg-red-100 px-3 rounded-3xl">
                                    Absent
                                  </span>
                                ),
                              },
                              {
                                value: "excused",
                                label: (
                                  <span className="text-orange-600 text-xs font-medium bg-orange-100 px-3 rounded-3xl">
                                    Excused
                                  </span>
                                ),
                              },
                            ]}
                          />
                        </td>
                      );
                    }

                    if (header === "Obtained Score") {
                      return (
                        <td
                          key={colIdx}
                          className="border px-4 py-2 text-center"
                        >
                          <input
                            type="number"
                            className="w-full px-2 py-1 text-center focus:outline-none focus:ring text-sm"
                            value={cell}
                            onChange={(e) =>
                              handleCellChange(rowIdx, colIdx, e.target.value)
                            }
                          />
                        </td>
                      );
                    }

                    // Default (e.g. "Admission Number")
                    return (
                      <td key={colIdx} className="border px-4 py-2 text-center">
                        <input
                          type="text"
                          className="w-full px-2 py-1 text-center focus:outline-none focus:ring text-sm"
                          value={cell}
                          onChange={(e) =>
                            handleCellChange(rowIdx, colIdx, e.target.value)
                          }
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CreateTable;
