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

  const handleCellChange = (rowIdx, colIdx, value, updateAll = false) => {
    setTableData((prev) => {
      const newData = [...prev];

      if (updateAll) {
        // Update the entire column for all rows
        return newData.map((row) => {
          row[colIdx] = value.trim();
          return row;
        });
      } else {
        // Update only the specific row
        newData[rowIdx] = [...newData[rowIdx]];
        newData[rowIdx][colIdx] = value.trim();
        return newData;
      }
    });
  };

  // const isRowFilled = (row) => row.every((cell) => cell.trim() !== "");

  const addRow = () => {
    if (tableData.length >= 5) {
      toast.error("You can only add up to 5 rows. Please upload via Excel.");
      return;
    }

    // if (!isRowFilled(tableData[tableData.length - 1])) {
    //   toast.error("Please fill the current row before adding a new one.");
    //   return;
    // }

    const newRow = new Array(headers.length).fill("");
    setTableData((prev) => [...prev, newRow]);
  };

  const removeRow = (rowIdx) => {
    setTableData((prev) => prev.filter((_, idx) => idx !== rowIdx));
  };
  useEffect(() => {
    // Update Exam Type for all rows
    setTableData((prev) =>
      prev.map((row) => {
        row[3] = selectedExamType || ""; // 3rd index is "Exam Type"
        return row;
      })
    );
  }, [selectedExamType]);

  useEffect(() => {
    // Update Exam Name for all rows
    setTableData((prev) =>
      prev.map((row) => {
        row[2] = selectedExamName || ""; // 2nd index is "Exam Name"
        return row;
      })
    );
  }, [selectedExamName]);

  useEffect(() => {
    // Update Max Score for all rows
    setTableData((prev) =>
      prev.map((row) => {
        row[5] = enteredMaxScore || ""; // 5th index is "Max Score"
        return row;
      })
    );
  }, [enteredMaxScore]);

  useEffect(() => {
    dispatch(fetchStudentsByClassAndSectionNames(cid));
    dispatch(fetchAllStudents());
  }, []);

  const handleCreate = () => {
    // if (!tableData.every(isRowFilled)) {
    //   toast.error("All fields must be filled before submitting.");
    //   return;
    // }
    // for (let row of tableData) {
    //   const obtainedScore = parseFloat(row[4]);
    //   const maxScore = parseFloat(row[5]);

    //   if (isNaN(obtainedScore) || isNaN(maxScore) || obtainedScore > maxScore) {
    //     toast.error("Obtained Score must be less than or equal to Max Score.");
    //     return;
    //   }
    // }

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
