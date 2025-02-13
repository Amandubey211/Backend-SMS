import { Button, Select } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { createOfflineExam } from "../../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { useNavigate, useParams } from "react-router-dom";
import { fetchStudentsByClassAndSectionNames } from "../../../../../../Store/Slices/Admin/Class/Students/studentThunks";

const NormalTable = ({ setIsOpen, isOpen }) => {
  const [headers] = useState([
    "Name",
    "Admission Number",
    "Exam Name",
    "Exam Type",
    "Obtained Score",
    "Max Score",
    "Status",
    "Actions",
  ]);

  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedExamName, setSelectedExamName] = useState("");
  const [enteredMaxScore, setEnteredMaxScore] = useState("");

  const [tableData, setTableData] = useState([
    ["", "", "", "", "", "", "", ""],
  ]);
  const dispatch = useDispatch();
  const { cid, sid } = useParams();
  const [selectedStatus, setSelectedStatus] = useState("Select Status");
  const { studentsList } = useSelector((state) => state.admin.students);
  const [student, setStudent] = useState("Select Student");
  const [status, setStatus] = useState("Select Status");
  const navigate = useNavigate();

  const handleCellChange = (rowIdx, colIdx, value) => {
    setTableData((prev) => {
      const newData = [...prev];
      newData[rowIdx][colIdx] = value;
      return newData;
    });
  };

  const addRow = () => {
    const newRow = new Array(headers.length).fill("");
    setTableData((prev) => [...prev, newRow]);
  };

  const removeRow = (rowIdx) => {
    setTableData((prev) => prev.filter((_, idx) => idx !== rowIdx));
  };

  useEffect(() => {
    dispatch(fetchStudentsByClassAndSectionNames(cid));
  }, [dispatch, cid]);

  console.log("student", studentsList);
  const isFormValid = () => {
    if (!selectedExamType || !selectedExamName || !enteredMaxScore) {
      return false; // ✅ Exam Name, Type, and Max Score must be filled
    }

    return tableData.every(
      (row) =>
        row[0] && // Name
        row[1] && // Admission Number
        row[4] && // Obtained Score
        row[5] && // Max Score
        row[6] // Status
    );
  };
  const handleCreate = () => {
    const payload = {
      examType: selectedExamType,
      examName: selectedExamName,
      classId: cid,
      subjectId: sid,
      students: tableData.map((row) => {
        const selectedStudent = studentsList.find(
          (student) => `${student.firstName} ${student.lastName}` === row[0]
        );
        return {
          studentId: selectedStudent ? selectedStudent._id : "",
          score: row[4] || 0,
          maxMarks: row[5] || 100,
          status: row[6] || "present",
        };
      }),
    };

    dispatch(createOfflineExam({ payload }));
    // setIsOpen(false);
  };

  const handleClear = () => {
    // setIsOpen(false);
    navigate(-1);
  };

  return (
    <div className="p-4 bg-white border shadow-md rounded-md w-full mt-4">
      {/* ✅ Buttons to Add Row */}
      <div className="flex gap-3 mb-3">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={addRow}
          style={{
            borderRadius: "6px",
            background: "linear-gradient(to right, #ec4899, #a855f7)",
            color: "white",
          }}
          className="hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-700"
        >
          Add Row
        </Button>
      </div>

      {/* ✅ Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border overflow-x-auto">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header, colIdx) => (
                <th
                  key={colIdx}
                  className="border px-4 py-1 text-center font-medium text-sm cursor-pointer"
                >
                  {header}

                  {/* ✅ Dropdown in Header for Exam Type */}
                  {header === "Exam Type" && (
                    <Select
                      defaultValue={"Select Exam Type"}
                      style={{ width: "100%", marginTop: "4px" }}
                      onChange={setSelectedExamType}
                      options={[
                        { value: "Quiz", label: "Quiz" },
                        { value: "Assignment", label: "Assignment" },
                        { value: "Practical", label: "Practical" },
                      ]}
                    />
                  )}
                  {header === "Exam Name" && (
                    <input
                      type="text"
                      placeholder="Enter Exam Name"
                      value={selectedExamName}
                      onChange={(e) => setSelectedExamName(e.target.value)}
                      className="w-full px-2 py-1 focus:outline-none focus:ring focus:border-blue-200 text-sm capitalize"
                    />
                  )}
                  {header === "Max Score" && (
                    <input
                      type="text"
                      placeholder="Enter Max Score"
                      value={enteredMaxScore}
                      onChange={(e) => setEnteredMaxScore(e.target.value)}
                      className="w-full px-2 py-1 focus:outline-none focus:ring focus:border-blue-200 text-sm capitalize"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIdx) => (
              <tr key={rowIdx} className="border">
                {row.map((cell, colIdx) => (
                  <td key={colIdx} className="border px-4 py-2 text-center">
                    {/* ✅ Combined "Exam Type" & "Exam Name" in One Column */}
                    {headers[colIdx] === "Exam Type" ? (
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                          {selectedExamType}
                        </div>
                      </div>
                    ) : headers[colIdx] === "Exam Name" ? (
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                          {selectedExamName}
                        </div>
                      </div>
                    ) : headers[colIdx] === "Actions" ? (
                      <RiDeleteBin6Line
                        onClick={() => removeRow(rowIdx)}
                        className="w-5 h-5 text-red-500 cursor-pointer"
                      />
                    ) : headers[colIdx] === "Name" ? (
                      <Select
                        defaultValue="Select Student"
                        style={{
                          width: "auto",
                          marginTop: "4px",
                          display: "flex",
                          alignSelf: "start",
                          paddingRight: "5px",
                        }}
                        value={tableData[rowIdx][0] || "Select Student"}
                        onChange={(value) => {
                          const selectedStudent = studentsList.find(
                            (student) =>
                              `${student.firstName} ${student.lastName}` ===
                              value
                          );
                          if (selectedStudent) {
                            handleCellChange(rowIdx, 0, value);
                            handleCellChange(
                              rowIdx,
                              1,
                              selectedStudent.admissionNumber
                            );
                          }
                        }}
                        options={studentsList?.map((student) => {
                          return {
                            value: `${student.firstName} ${student.lastName}`,
                            label: (
                              <div className="flex items-center gap-2">
                                <img
                                  src={student.profile}
                                  alt={student.firstName}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                                <span>
                                  {student.firstName} {student.lastName}
                                </span>
                                <span className="pr-2 text-xs text-gray-500">
                                  (2345)
                                </span>
                              </div>
                            ),
                          };
                        })}
                      />
                    ) : headers[colIdx] === "Max Score" ? (
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                          {enteredMaxScore}
                        </div>
                      </div>
                    ) : headers[colIdx] === "Status" ? (
                      <Select
                        defaultValue="Present"
                        style={{ width: "100%", marginTop: "4px" }}
                        value={row[6] || "Present"}
                        onChange={(value) => handleCellChange(rowIdx, 6, value)}
                        options={[
                          { value: "Present", label: "Present" },
                          { value: "Absent", label: "Absent" },
                        ]}
                      />
                    ) : (
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) =>
                          handleCellChange(rowIdx, colIdx, e.target.value)
                        }
                        className="w-full px-2 py-1 focus:outline-none focus:ring focus:border-blue-100 text-sm capitalize"
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Submit Buttons */}
      <div className="flex justify-end space-x-4 items-end w-[20%] fixed bottom-5 right-5">
        <Button onClick={handleClear}>Cancel</Button>
        <Button type="primary" onClick={handleCreate} disabled={!isFormValid()}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default NormalTable;
