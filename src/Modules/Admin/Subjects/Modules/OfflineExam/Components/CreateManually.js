import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createOfflineExam } from "../../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { useNavigate, useParams } from "react-router-dom";
import { fetchStudentsByClassAndSectionNames } from "../../../../../../Store/Slices/Admin/Class/Students/studentThunks";
import { fetchAllStudents } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import toast from "react-hot-toast";
import { formatDate } from "../../../../../../Utils/helperFunctions";
import CreateTable from "./CreateTable";

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
    setTableData((prevData) => {
      const newData = [...prevData];
      newData[rowIdx][colIdx] = value;
      console.log("new", newData);

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

  const handleCreate = () => {
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

        return {
          studentId: selectedStudent?._id || "",
          score: row[4],
          maxMarks: enteredMaxScore || 0,
          status: row[8] ?? "present",
        };
      }),
    };
    setLoading(true);
    dispatch(createOfflineExam({ payload: payload, cid: cid, sid: sid }))
      .then(() => {
        setLoading(false);
        toast.success("Exam Created Successfully");
        resetForm();
        setIsOpen(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message || "Failed to Create Exam");
      });
  };

  const resetForm = () => {
    setSelectedExamType("");
    setSelectedExamName("");
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setTableData([["", "", "", "", "", "", "", "", "", ""]]);
  };

  const handleClear = () => {
    setIsOpen(false);
  };

  console.log("entered Max Score", enteredMaxScore);
  console.log("Table data", tableData);
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
      <CreateTable
        headers={headers}
        selectedExamType={selectedExamType}
        setSelectedExamType={setSelectedExamType}
        selectedExamName={selectedExamName}
        setSelectedExamName={setSelectedExamName}
        enteredMaxScore={enteredMaxScore}
        setEnteredMaxScore={setEnteredMaxScore}
        selectedStartDate={selectedStartDate}
        setSelectedStartDate={setSelectedStartDate}
        selectedEndDate={selectedEndDate}
        setSelectedEndDate={setSelectedEndDate}
        tableData={tableData}
        removeRow={removeRow}
        formatDate={formatDate}
        studentsList={studentsList}
        allStudents={allStudents}
        handleCellChange={handleCellChange}
      />

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
