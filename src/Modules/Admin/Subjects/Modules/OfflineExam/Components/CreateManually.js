import React, { useEffect, useState } from "react";
import { Button, Select, DatePicker, message, Switch, Tooltip } from "antd";
import { TeamOutlined, CalendarOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createOfflineExam } from "../../../../../../Store/Slices/Admin/Class/OfflineExam/oflineExam.action";
import { fetchStudentsByClassAndSection } from "../../../../../../Store/Slices/Admin/Class/Students/studentThunks";
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

  // Fields for results publishing
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
    dispatch(fetchStudentsByClassAndSection(cid));
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
      // Filter by selected sections
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
      // If changing the "Name" object
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
      resultsPublished,
      resultsPublishDate: resultsPublishDate
        ? resultsPublishDate.toISOString()
        : null,
      students: tableData.map((row) => {
        const fullName = typeof row[0] === "object" ? row[0].name : row[0];
        const matchedStudent =
          studentsList.find(
            (st) => st.firstName + " " +st.lastName === fullName
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
    `w-full p-1 border rounded-md text-xs capitalize text-center focus:outline-none focus:ring 
    ${fieldValue ? "border-gray-200" : "border-red-500"}`;

  return (
    <div className="px-4 w-full -mb-9 min-h-[500px]">
      {/* Container for Section(s) and Results Publish Options */}
      <div className="flex flex-wrap items-center justify-between mb-6 p-4 bg-gray-50 rounded-md shadow-sm gap-4">
        {/* Section(s) Selection */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 mb-1">
            <TeamOutlined className="text-xl text-gray-600" />
            <label className="font-semibold text-gray-700">
              Select Student Sections
            </label>
          </div>
          <Select
            mode="multiple"
            placeholder="Choose one or more sections"
            style={{ width: 300 }}
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

        {/* Results Publish Options */}
        <div className="flex flex-col md:flex-row items-start md:items-end space-x-0 md:space-x-4 w-full md:w-auto">
          {/* Publish Results Switch (Tooltip only) */}
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <Tooltip title="Publish Results Immediately">
              <Switch
                checked={resultsPublished}
                onChange={(checked) => setResultsPublished(checked)}
              />
            </Tooltip>
          </div>
          {/* Results Publish Date */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-1">
              <CalendarOutlined className="text-xl text-gray-600" />
              <label className="font-semibold text-gray-700">
                Results Publish Date
              </label>
            </div>
            <DatePicker
              value={resultsPublishDate}
              onChange={(date) => setResultsPublishDate(date)}
              disabled={resultsPublished}
              style={{ width: 220 }}
            />
          </div>
        </div>
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
