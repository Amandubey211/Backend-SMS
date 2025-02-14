import { Button, Select } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { createOfflineExam } from "../../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { useNavigate, useParams } from "react-router-dom";
import { fetchStudentsByClassAndSectionNames } from "../../../../../../Store/Slices/Admin/Class/Students/studentThunks";
import { fetchAllStudents } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import toast from "react-hot-toast";

const NormalTable = ({ setIsOpen, setLoading, loading, isOpen }) => {
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
  const { studentsList } = useSelector((state) => state.admin.students);
  const { allStudents } = useSelector((store) => store.admin.all_students);
  const navigate = useNavigate();

  const handleCellChange = (rowIdx, colIdx, value) => {
    setTableData((prev) => {
      const newData = [...prev];
      newData[rowIdx] = [...newData[rowIdx]]; // ✅ Ensure row reference changes
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
    dispatch(fetchAllStudents());
  }, []);

  console.log("student", studentsList);
  console.log("all students", allStudents);

  const handleCreate = () => {
    if (!validateInputs()) return;
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
          score: row[4],
          maxMarks: row[5],
          status: row[6] || "present",
        };
      }),
    };
    setLoading(true);
    dispatch(createOfflineExam({ payload }))
      .then(() => {
        setLoading(false);
        toast.success("Exam Created Successfully");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message || "Failed to Create Exam");
      });
    // setIsOpen(false);
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
        <table className="w-full border-collapse border overflow-x-auto mt-2">
          <thead>
            <tr className="bg-red-50">
              {headers.map((header, colIdx) => (
                <th
                  key={colIdx}
                  className={`border px-4 py-1 text-center font-medium text-sm cursor-pointer  ${
                    header === "Name" ? "w-[20%]" : ""
                  }`}
                >
                  <div className="flex flex-col justify-center items-center w-full">
                    <span className="mb-1">{header}</span>
                    {header === "Exam Type" && (
                      <input
                        type="text"
                        placeholder="Enter Type"
                        value={selectedExamType}
                        onChange={(e) => setSelectedExamType(e.target.value)}
                        className="w-full align-middle focus:outline-none focus:ring focus:border-blue-200  p-1  border border-gray-200 rounded-md m-2 text-xs font-medium capitalize placeholder: text-center"
                      />
                    )}
                    {header === "Exam Name" && (
                      <input
                        type="text"
                        placeholder="Enter Exam"
                        value={selectedExamName}
                        onChange={(e) => setSelectedExamName(e.target.value)}
                        className="w-full p-1  border border-gray-200 rounded-md m-2 font-medium  focus:outline-none focus:ring focus:border-blue-200 text-xs capitalize placeholder: text-center"
                      />
                    )}
                    {header === "Max Score" && (
                      <input
                        type="number"
                        placeholder="Enter Max Score"
                        value={enteredMaxScore}
                        onChange={(e) => setEnteredMaxScore(e.target.value)}
                        className="w-full p-1  border border-gray-200 rounded-md m-2 font-medium  focus:outline-none focus:ring focus:border-blue-100 text-xs capitalize placeholder: text-center"
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
                    ) : headers[colIdx] === "Max Score" ? (
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 capitalize">
                          {enteredMaxScore}
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
                        options={studentsList?.map((student) => {
                          const matchedStudent = allStudents.find(
                            (s) =>
                              s.firstName === student.firstName &&
                              s.lastName === student.lastName
                          );
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
                                  {matchedStudent?.admissionNumber || "NA"}
                                </span>
                              </div>
                            ),
                          };
                        })}
                      />
                    ) : headers[colIdx] === "Status" ? (
                      <Select
                        defaultValue="present"
                        // className={`w-full px-2 py-1 rounded-md focus:outline-none focus:ring focus:border-blue-100 text-sm capitalize
                        //   ${
                        //     row[6] === "present"
                        //       ? "bg-green-100 text-green-700"
                        //       : ""
                        //   }
                        //   ${
                        //     row[6] === "absent" ? "bg-red-100 text-red-700" : ""
                        //   }
                        //   ${
                        //     row[6] === "excused"
                        //       ? "bg-orange-100 text-orange-700"
                        //       : ""
                        //   }
                        // `}
                        value={row[6] || "present"}
                        onChange={(value) => handleCellChange(rowIdx, 6, value)}
                        options={[
                          {
                            value: "present",
                            label: (
                              <span className="text-green-600 font-medium">
                                Present
                              </span>
                            ),
                          },
                          {
                            value: "absent",
                            label: (
                              <span className="text-red-600 font-medium">
                                Absent
                              </span>
                            ),
                          },
                          {
                            value: "excused",
                            label: (
                              <span className="text-orange-600 font-medium">
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
        <Button type="primary" disabled={loading} onClick={handleCreate}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default NormalTable;
