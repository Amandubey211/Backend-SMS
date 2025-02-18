import { Button, DatePicker, Select } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { createOfflineExam } from "../../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { useNavigate, useParams } from "react-router-dom";
import { fetchStudentsByClassAndSectionNames } from "../../../../../../Store/Slices/Admin/Class/Students/studentThunks";
import { fetchAllStudents } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import toast from "react-hot-toast";
import { formatDate } from "../../../../../../Utils/helperFunctions";

const CreateManually = ({ setIsOpen, setLoading, loading, isOpen }) => {
  const [headers] = useState([
    "Name",
    "Admission Number",
    "Exam Name",
    "Exam Type",
    "Obtained Score",
    "Max Score",
    "Start Date",
    "End Date",
    "Status",
    "Actions",
  ]);

  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedExamName, setSelectedExamName] = useState("");
  const [enteredMaxScore, setEnteredMaxScore] = useState("");

  const [tableData, setTableData] = useState([
    ["", "", "", "", "", "", "", "", "", ""],
  ]);
  const dispatch = useDispatch();
  const { cid, sid } = useParams();
  const { studentsList } = useSelector((state) => state.admin.students);
  const { allStudents } = useSelector((store) => store.admin.all_students);
  const navigate = useNavigate();
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const pinkColor = "#EC407A";
  const purpleColor = "#AB47BC";
  const primaryGradient = `linear-gradient(to right, ${pinkColor}, ${purpleColor})`;

  const handleCellChange = (rowIdx, colIdx, value) => {
    setTableData((prev) => {
      const newData = [...prev];
      newData[rowIdx] = [...newData[rowIdx]];
      newData[rowIdx][colIdx] = value;
      return newData;
    });
  };

  const addRow = () => {
    if (!isRowFilled(tableData[tableData.length - 1])) {
      toast.error("Please fill the current row before adding a new one.");
      return;
    }
    const newRow = new Array(headers.length).fill("");
    setTableData((prev) => [...prev, newRow]);
  };

  const removeRow = (rowIdx) => {
    setTableData((prev) => prev.filter((_, idx) => idx !== rowIdx));
  };

  useEffect(() => {
    dispatch(fetchStudentsByClassAndSectionNames(cid));
    dispatch(fetchAllStudents());
  }, []);

  const isRowFilled = (row) =>
    row.every((cell) => (cell || "").toString().trim() !== "");

  const isTableValid = tableData.every(isRowFilled);

  const handleCreate = () => {
    if (!tableData.every(isRowFilled)) {
      toast.error("All fields must be filled before submitting.");
      return;
    }

    if (!validateInputs()) return;
    const payload = {
      examType: selectedExamType,
      examName: selectedExamName,
      classId: cid,
      subjectId: sid,
      startDate: selectedStartDate ? selectedStartDate.toISOString() : null,
      endDate: selectedEndDate ? selectedEndDate.toISOString() : null,
      students: tableData.map((row) => {
        const selectedStudent = studentsList.find(
          (student) => `${student.firstName} ${student.lastName}` === row[0]
        );
        console.log("max marks", row[5]);

        return {
          studentId: selectedStudent?._id || "",
          score: row[4],
          maxMarks: enteredMaxScore || 0,
          status: row[6] || "present",
        };
      }),
    };
    setLoading(true);
    dispatch(createOfflineExam({ payload }))
      .then(() => {
        setLoading(false);
        toast.success("Exam Created Successfully");
        resetForm();
        navigate(-1);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message || "Failed to Create Exam");
      });
  };
  // Function to reset form values
  const resetForm = () => {
    setSelectedExamType("");
    setSelectedExamName("");
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setTableData([["", "", "", "", "", "", "", "", "", ""]]);
  };

  const validateInputs = () => {
    if (!selectedExamName.trim()) {
      toast.error("Exam name cannot be empty.");
      return false;
    }
    if (!selectedExamType) {
      toast.error("Exam type is required.");
      return false;
    }
    if (!cid) {
      toast.error("Class ID is missing.");
      return false;
    }
    if (!sid) {
      toast.error("Subject ID is missing.");
      return false;
    }

    return true;
  };

  const handleClear = () => {
    navigate(-1);
  };

  console.log("entered Max Score", enteredMaxScore);

  return (
    <div className="px-4  w-full -mb-9 min-h-[500px]">
      {/* Buttons to Add Row */}
      <div className="flex gap-3 mb-3">
        <Button
          icon={<PlusOutlined />}
          onClick={addRow}
          style={{
            borderRadius: "6px",
            border: "none",
          }}
          className="px-4 py-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-200 flex items-center gap-2"
        >
          Add Row
        </Button>
      </div>

      {/* Table */}
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
                    className={`border px-4 pt-2 text-center font-medium text-sm cursor-pointer align-top`}
                    style={{
                      minWidth: header === "Actions" ? "50px" : "150px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div className="flex flex-col items-center w-full">
                      <span>{header}</span>
                      {header === "Exam Type" && (
                        <input
                          type="text"
                          placeholder="Enter Type"
                          value={selectedExamType}
                          onChange={(e) => setSelectedExamType(e.target.value)}
                          className="w-full  text-pink-700 align-middle focus:outline-none focus:ring focus:border-blue-200  p-1  border border-gray-200 rounded-md m-2 text-xs font-medium capitalize placeholder: text-center"
                        />
                      )}
                      {header === "Exam Name" && (
                        <input
                          type="text"
                          placeholder="Enter Exam"
                          value={selectedExamName}
                          onChange={(e) => setSelectedExamName(e.target.value)}
                          className="w-full p-1 text-pink-700  border border-gray-200 rounded-md m-2 font-medium  focus:outline-none focus:ring focus:border-blue-200 text-xs capitalize placeholder: text-center"
                        />
                      )}
                      {header === "Max Score" && (
                        <input
                          type="number"
                          placeholder="Enter Max Score"
                          value={enteredMaxScore}
                          onChange={(e) => setEnteredMaxScore(e.target.value)}
                          className="w-full p-1  text-pink-700  border border-gray-200 rounded-md m-2 font-medium  focus:outline-none focus:ring focus:border-blue-100 text-xs capitalize placeholder: text-center"
                        />
                      )}
                      {header === "Start Date" && (
                        <DatePicker
                          selected={selectedStartDate}
                          onChange={(date) =>
                            setSelectedStartDate(date ? new Date(date) : null)
                          }
                          className="w-full  text-pink-700 p-1 border border-gray-200 rounded-md m-2 font-medium text-xs text-center"
                          placeholderText="Select Start Date"
                        />
                      )}

                      {header === "End Date" && (
                        <DatePicker
                          selected={selectedEndDate}
                          onChange={(date) =>
                            setSelectedEndDate(date ? new Date(date) : null)
                          }
                          className="w-full  text-pink-700 p-1 border border-gray-200 rounded-md m-2 font-medium text-xs text-center"
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
                  {row.map((cell, colIdx) => (
                    <td
                      key={colIdx}
                      className="border px-4 py-2 text-center"
                      style={{
                        minWidth: "150px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {headers[colIdx] === "Exam Type" ? (
                        <div className="items-center gap-2 flex justify-center">
                          <div className="bg-gray-100  text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                            {selectedExamType}
                          </div>
                        </div>
                      ) : headers[colIdx] === "Exam Name" ? (
                        <div className="flex items-center gap-2 justify-center">
                          <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                            {selectedExamName}
                          </div>
                        </div>
                      ) : headers[colIdx] === "Max Score" ? (
                        <div className="flex items-center gap-2 justify-center">
                          <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                            {enteredMaxScore}
                          </div>
                        </div>
                      ) : headers[colIdx] === "Actions" ? (
                        <div className="w-full flex justify-center">
                          <RiDeleteBin6Line
                            onClick={() => removeRow(rowIdx)}
                            className="w-5 h-5 text-red-500 cursor-pointer"
                          />
                        </div>
                      ) : headers[colIdx] === "Start Date" ? (
                        <div className="flex items-center gap-2 justify-center">
                          <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                            {selectedStartDate
                              ? formatDate(selectedStartDate)
                              : ""}
                          </div>
                        </div>
                      ) : headers[colIdx] === "End Date" ? (
                        <div className="flex items-center gap-2 justify-center">
                          <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                            {selectedEndDate ? formatDate(selectedEndDate) : ""}
                          </div>
                        </div>
                      ) : headers[colIdx] === "Name" ? (
                        <Select
                          showSearch
                          allowClear
                          defaultValue="Select Student"
                          style={{
                            width: "auto",
                            mode: "single",
                            marginTop: "4px",
                            display: "flex",
                            alignSelf: "start",
                            paddingRight: "5px",
                            overflowX: "auto",
                          }}
                          value={tableData[rowIdx][0] || "Select Student"}
                          onChange={(value) => {
                            const selectedStudent = studentsList.find(
                              (student) =>
                                `${student.firstName} ${student.lastName}` ===
                                value
                            );

                            if (selectedStudent) {
                              const matchedStudent = allStudents.find(
                                (s) =>
                                  s.firstName === selectedStudent.firstName &&
                                  s.lastName === selectedStudent.lastName
                              );
                              handleCellChange(rowIdx, 0, value);
                              handleCellChange(
                                rowIdx,
                                1,
                                matchedStudent?.admissionNumber || ""
                              );
                            }
                          }}
                          onClear={() => handleCellChange(rowIdx, 0, null)}
                          filterOption={(input, option) =>
                            option?.value
                              ?.toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={studentsList?.map((student) => {
                            const matchedStudent = allStudents.find(
                              (s) =>
                                s.firstName === student.firstName &&
                                s.lastName === student.lastName
                            );
                            const isSelected =
                              tableData[rowIdx][0] ===
                              `${student.firstName} ${student.lastName}`;
                            return {
                              value: `${student.firstName} ${student.lastName}`,
                              label: (
                                <div className="flex items-center gap-2 min-w-[200px] whitespace-nowrap overflow-x-auto">
                                  <img
                                    src={student.profile}
                                    alt={student.firstName}
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                  <span>
                                    {student.firstName} {student.lastName}
                                  </span>
                                  {!isSelected && (
                                    <span className="pr-2 text-xs text-gray-500">
                                      {matchedStudent?.admissionNumber || "NA"}
                                    </span>
                                  )}
                                </div>
                              ),
                            };
                          })}
                        />
                      ) : headers[colIdx] === "Status" ? (
                        <Select
                          defaultValue="present"
                          value={row[8] || "present"}
                          onChange={(value) =>
                            handleCellChange(rowIdx, 8, value)
                          }
                          options={[
                            {
                              value: "present",
                              label: (
                                <span className="text-green-600 text-xs font-medium bg-green-100 px-3 py-1 border border-none rounded-3xl">
                                  Present
                                </span>
                              ),
                            },
                            {
                              value: "absent",
                              label: (
                                <span className="text-red-600 font-medium text-xs bg-red-100 px-3 py-1 border border-none rounded-3xl">
                                  Absent
                                </span>
                              ),
                            },
                            {
                              value: "excused",
                              label: (
                                <span className="text-orange-600 font-medium text-xs bg-orange-100 px-3 py-1 border border-none rounded-3xl">
                                  Excused
                                </span>
                              ),
                            },
                          ]}
                        />
                      ) : (
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) =>
                            handleCellChange(rowIdx, colIdx, e.target.value)
                          }
                          className="w-full px-2 py-1 text-center flex items-center justify-center focus:outline-none focus:ring focus:border-blue-100 text-sm capitalize"
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="fixed bottom-5 right-5 flex space-x-4 ">
        <Button onClick={handleClear}>Cancel</Button>
        <Button
          style={{
            background: primaryGradient,
            border: "none",
            color: "white",
          }}
          disabled={loading}
          onClick={handleCreate}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateManually;
