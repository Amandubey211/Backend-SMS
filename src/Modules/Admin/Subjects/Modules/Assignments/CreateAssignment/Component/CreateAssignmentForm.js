import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PointsInput from "./PointsInput";
import AllowedAttemptsSelect from "./AllowedAttemptsSelect";
import NumberOfAttemptsInput from "./NumberOfAttemptsInput";
import AssignToRadios from "../../../../Component/AssignToRadios";
import SectionSelect from "../../../../Component/SectionSelect";
import DateInput from "../../../../Component/DateInput";
import GradeOption from "./GradeOption";
import SubmissionTypeDropdown from "./SubmissionTypeDropdown";
import useGetModulesForStudent from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useGetModulesForStudent";
import useGetGroupsByClass from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Groups/useGetGroupByClass";
import { useParams } from "react-router-dom";

const CreateAssignmentForm = ({
  points,
  displayGrade,
  setDisplayGrade,
  submissionType,
  handleChange,
  allowedAttempts,
  numberOfAttempts,
  assignTo,
  sectionId,
  dueDate,
  availableFrom,
  moduleId,
  chapterId,
  groupId,
}) => {
  const moduleList = useSelector((store) => store.Subject.modules);
  const { loading, error, fetchModules } = useGetModulesForStudent();
  const [chapters, setChapters] = useState([]);
  const [selectedModule, setSelectedModule] = useState(moduleId || "");
  const [selectedChapter, setSelectedChapter] = useState(chapterId || "");

  useEffect(() => {
    // if (!moduleList || moduleList.length === 0) {
    fetchModules();
    // }
  }, [fetchModules]);

  useEffect(() => {
    if (selectedModule) {
      const module = moduleList.find((mod) => mod._id === selectedModule);
      if (module) {
        setChapters(module.chapters);
      } else {
        setChapters([]);
      }
    } else {
      setChapters([]);
    }
  }, [selectedModule, moduleList]);

  const handleModuleChange = (e) => {
    const value = e.target.value;
    setSelectedModule(value);
    setSelectedChapter("");
    handleChange({ target: { name: "moduleId", value } });
  };

  const handleChapterChange = (e) => {
    const value = e.target.value;
    setSelectedChapter(value);
    handleChange({ target: { name: "chapterId", value } });
  };

  if (loading) return <p>Loading modules...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-sm mx-auto p-6 bg-white border">
      <h3 className="text-lg font-semibold mb-4">Option</h3>

      <PointsInput points={points} handleChange={handleChange} />
      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="module-select">
          Module
        </label>
        <select
          id="module-select"
          className="mt-1 block w-full pl-3 pr-10 border py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedModule}
          onChange={handleModuleChange}
        >
          <option value="">Select</option>
          {moduleList.map((module) => (
            <option key={module._id} value={module._id}>
              {module.moduleName}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="chapter-select">
          Chapter
        </label>
        <select
          id="chapter-select"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedChapter}
          onChange={handleChapterChange}
          disabled={!selectedModule} // Disable the dropdown if no module is selected
        >
          {selectedModule ? (
            <>
              <option value="">Select</option>
              {chapters.map((chapter) => (
                <option key={chapter._id} value={chapter._id}>
                  {chapter.name}
                </option>
              ))}
            </>
          ) : (
            <option value="">Select module first</option>
          )}
        </select>
      </div>

      <GradeOption
        displayGrade={displayGrade}
        setDisplayGrade={setDisplayGrade}
      />
      <SubmissionTypeDropdown
        submissionType={submissionType}
        handleChange={handleChange}
      />
      <AllowedAttemptsSelect
        allowedAttempts={allowedAttempts}
        handleChange={handleChange}
      />
      {allowedAttempts === true && (
        <NumberOfAttemptsInput
          numberOfAttempts={numberOfAttempts}
          handleChange={handleChange}
        />
      )}
      <AssignToRadios
        isAssignToLabel={true}
        assignTo={assignTo}
        handleChange={handleChange}
      />
      <SectionSelect
        assignTo={assignTo}
        section={sectionId}
        handleChange={handleChange}
        group={groupId}
      />
      <DateInput
        label="Available from"
        name="availableFrom"
        value={availableFrom}
        handleChange={handleChange}
      />
      <DateInput
        label="Due"
        name="dueDate"
        value={dueDate}
        handleChange={handleChange}
      />
      {/* <button className="py-2 text-green-500 font-medium rounded-md hover:text-green-800 transition">
        + Add Assign
      </button> */}
    </div>
  );
};

export default CreateAssignmentForm;
