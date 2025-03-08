// CreateManually.js
import React, { useEffect, useState } from "react";
import { Button, Select, Checkbox, DatePicker, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createOfflineExam } from "../../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { fetchStudentsByClassAndSectionNames } from "../../../../../../Store/Slices/Admin/Class/Students/studentThunks";
import { fetchSectionsByClass } from "../../../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchAllStudents } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import toast from "react-hot-toast";
import { formatDate } from "../../../../../../Utils/helperFunctions";
import CreateTable from "./CreateTable";

const CreateManually = ({ setIsOpen, isOpen, cid, sid }) => {
  const dispatch = useDispatch();

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
  const [tableData, setTableData] = useState([]);

  // Exam-level fields
  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedExamName, setSelectedExamName] = useState("");
  const [enteredMaxScore, setEnteredMaxScore] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  // New fields for results publishing
  const [resultsPublished, setResultsPublished] = useState(false);
  const [resultsPublishDate, setResultsPublishDate] = useState(null);

  // Multiple section selection
  const [selectedSections, setSelectedSections] = useState([]);

  const { sectionsList } = useSelector((store) => store.admin.group_section);
  const { studentsList } = useSelector((state) => state.admin.students);
  const { allStudents } = useSelector((store) => store.admin.all_students);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchSectionsByClass(cid));
    dispatch(fetchStudentsByClassAndSectionNames(cid));
    dispatch(fetchAllStudents());
  }, [cid, dispatch]);

  const handleSectionsChange = (values) => {
    setSelectedSections(values);

    // If "all" is selected, show all students
    if (values.includes("all")) {
      const updatedTableData = studentsList.map((student) => {
        const matchedStudent = allStudents.find(
          (s) =>
            s.firstName === student.firstName && s.lastName === student.lastName
        );
        return [
          {
            name: `${student.firstName} ${student.lastName}`,
            avatar: student.profile,
          },
          matchedStudent?.admissionNumber ?? "",
          "", // examName
          "", // examType
          "", // obtainedScore
          "", // maxScore
          "", // startDate
          "", // endDate
          "present", // status
          "", // actions
        ];
      });
      setTableData(updatedTableData);
    } else {
      const filtered = studentsList.filter((student) =>
        values.includes(student.presentSectionId)
      );
      const updatedTableData = filtered.map((student) => {
        const matchedStudent = allStudents.find(
          (s) =>
            s.firstName === student.firstName && s.lastName === student.lastName
        );
        return [
          {
            name: `${student.firstName} ${student.lastName}`,
            avatar: student.profile,
          },
          matchedStudent?.admissionNumber ?? "",
          "", // examName
          "", // examType
          "", // obtainedScore
          "", // maxScore
          "", // startDate
          "", // endDate
          "present",
          "",
        ];
      });
      setTableData(updatedTableData);
    }
  };

  const removeRow = (rowIdx) => {
    setTableData((prev) => prev.filter((_, idx) => idx !== rowIdx));
  };

  const handleCellChange = (rowIdx, colIdx, value) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      if (colIdx === 0 && typeof newData[rowIdx][0] === "object") {
        newData[rowIdx][0] = { ...newData[rowIdx][0], name: value };
      } else {
        newData[rowIdx][colIdx] = value;
      }
      return newData;
    });
  };

  const handleCreate = () => {
    // Basic validation
    if (!selectedExamName || !enteredMaxScore) {
      message.error(
        "Please fill out both 'Exam Name' and 'Max Score' before creating."
      );
      return;
    }

    const payload = {
      examType: selectedExamType,
      examName: selectedExamName,
      classId: cid,
      subjectId: sid,
      startDate: selectedStartDate ? selectedStartDate.toISOString() : null,
      endDate: selectedEndDate ? selectedEndDate.toISOString() : null,
      // New results publishing fields added to payload
      resultsPublished: resultsPublished,
      resultsPublishDate: resultsPublishDate
        ? resultsPublishDate.toISOString()
        : null,
      students: tableData.map((row) => {
        const fullName = typeof row[0] === "object" ? row[0].name : row[0];
        const [firstName, lastName = ""] = fullName.split(" ");
        const matchedStudent =
          studentsList.find(
            (st) => st.firstName === firstName && st.lastName === lastName
          ) || {};
        return {
          studentId: matchedStudent?._id || "",
          score: row[4] || 0,
          maxMarks: enteredMaxScore || 0,
          status: row[8] ?? "present",
        };
      }),
    };

    setLoading(true);
    dispatch(createOfflineExam({ payload, cid, sid }))
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
    setEnteredMaxScore("");
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectedSections([]);
    setTableData([]);
    // Reset new results fields
    setResultsPublished(false);
    setResultsPublishDate(null);
  };

  const handleClear = () => {
    setIsOpen(false);
  };

  const pinkColor = "#EC407A";
  const purpleColor = "#AB47BC";
  const primaryGradient = `linear-gradient(to right, ${pinkColor}, ${purpleColor})`;

  // Basic red border style if fields are missing
  const inputClassName = (fieldValue) =>
    `w-full p-1 border rounded-md m-2 font-medium text-xs capitalize text-center focus:outline-none focus:ring 
    ${fieldValue ? "border-gray-200" : "border-red-500"}`;

  return (
    <div className="px-4 w-full -mb-9 min-h-[500px]">
      {/* Section(s) multi-select */}
      <div className="mb-4 w-full">
        <label className="font-semibold block mb-1">Select Section(s):</label>
        <Select
          mode="multiple"
          placeholder="Choose one or more sections"
          style={{ width: "100%", maxWidth: 350 }}
          value={selectedSections}
          onChange={handleSectionsChange}
          allowClear
          options={[
            { label: "All Sections", value: "all" },
            ...sectionsList.map((section) => ({
              value: section._id,
              label: section.sectionName,
            })),
          ]}
        />
      </div>

      {/* Create Table */}
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
        handleCellChange={handleCellChange}
        inputClassName={inputClassName}
      />

      {/* New Results Publish Options */}
      <div className="mb-4">
        <Checkbox
          checked={resultsPublished}
          onChange={(e) => setResultsPublished(e.target.checked)}
        >
          Publish Results Immediately
        </Checkbox>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Results Publish Date</label>
        <DatePicker
          value={resultsPublishDate}
          onChange={(date, dateString) => setResultsPublishDate(date)}
          disabled={resultsPublished}
          style={{ width: "100%" }}
        />
      </div>

      {/* Submit / Cancel Buttons */}
      <div className="bottom-5 right-5 fixed flex justify-end space-x-4">
        <Button onClick={handleClear}>Cancel</Button>
        <Button
          style={{
            marginBottom: "20px",
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
