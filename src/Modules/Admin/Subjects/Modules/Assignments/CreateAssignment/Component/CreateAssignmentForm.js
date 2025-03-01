// CreateAssignmentForm.jsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PointsInput from "./PointsInput";
import AllowedAttemptsSelect from "./AllowedAttemptsSelect";
import NumberOfAttemptsInput from "./NumberOfAttemptsInput";
import AssignToRadios from "../../../../Component/AssignToRadios";
import SectionSelect from "../../../../Component/SectionSelect";
import DateInput from "../../../../Component/DateInput";
import GradeOption from "./GradeOption";
import SubmissionTypeDropdown from "./SubmissionTypeDropdown";
import { useParams } from "react-router-dom";
import { fetchModules } from "../../../../../../../Store/Slices/Admin/Class/Module/moduleThunk";
import { motion } from "framer-motion";

const CreateAssignmentForm = ({
  points,
  displayGrade,
  setDisplayGrade,
  submissionType,
  handleChange,
  allowedAttempts,
  numberOfAttempts,
  assignTo,
  sectionIds, // expected as array for assignments
  dueDate,
  availableFrom,
  moduleId,
  chapterId,
  groupIds, // expected as array for assignments
  // Refs for validation
  moduleRef,
  pointsRef,
  submissionTypeRef,
  availableFromRef,
  dueDateRef,
  // Error messages:
  moduleError,
  pointsError,
  submissionTypeError,
  availableFromError,
  dueDateError,
  multiSelect,
}) => {
  const dispatch = useDispatch();
  const moduleList = useSelector((store) => store.admin.module.modules);
  const { cid, sid } = useParams();
  const [chapters, setChapters] = useState([]);

  // State for guidelines modal
  const [showGuidelines, setShowGuidelines] = useState(false);

  useEffect(() => {
    dispatch(fetchModules({ cid, sid }));
  }, [dispatch, cid, sid]);

  useEffect(() => {
    if (moduleId) {
      const currentModule = moduleList.find((m) => m._id === moduleId);
      setChapters(currentModule ? currentModule.chapters : []);
    } else {
      setChapters([]);
    }
  }, [moduleId, moduleList]);

  const handleModuleChange = (e) => {
    handleChange(e);
  };

  const handleChapterChange = (e) => {
    handleChange(e);
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white border relative">
      {/* Heading + Guidelines Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Options</h3>
        <button
          onClick={() => setShowGuidelines(true)}
          className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9 2a7 7 0 100 14A7 7 0 109 2zm1 10.93a.75.75 0 01-1.5 0V9a.75.75 0 011.5 0v3.93zM9.25 7a.75.75 0 011.5 0 .75.75 0 01-1.5 0z" />
          </svg>
          Guidelines
        </button>
      </div>

      <PointsInput
        id="points"
        points={points}
        handleChange={handleChange}
        inputRef={pointsRef}
        error={pointsError}
      />

      {/* Module Select */}
      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="moduleId">
          Module
        </label>
        <select
          id="moduleId"
          ref={moduleRef}
          name="moduleId"
          value={moduleId || ""}
          onChange={handleModuleChange}
          className={`mt-1 block w-full border pl-3 pr-10 py-3 text-base sm:text-sm rounded-md focus:outline-none ${
            moduleError
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        >
          <option value="">Select</option>
          {moduleList?.map((mod) => (
            <option key={mod._id} value={mod._id}>
              {mod.moduleName}
            </option>
          ))}
        </select>
        {moduleError && (
          <motion.p
            className="text-red-500 text-sm mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {moduleError}
          </motion.p>
        )}
      </div>

      {/* Chapter Select */}
      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="chapterId">
          Chapter
        </label>
        <select
          id="chapterId"
          name="chapterId"
          className="mt-1 block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={chapterId || ""}
          onChange={handleChapterChange}
          disabled={!moduleId}
        >
          <option value="">Select</option>
          {chapters?.map((chapter) => (
            <option key={chapter._id} value={chapter._id}>
              {chapter.name}
            </option>
          ))}
        </select>
      </div>

      <GradeOption
        displayGrade={displayGrade}
        setDisplayGrade={setDisplayGrade}
      />

      <SubmissionTypeDropdown
        id="submissionType"
        submissionType={submissionType}
        handleChange={handleChange}
        inputRef={submissionTypeRef}
        error={submissionTypeError}
      />

      <AllowedAttemptsSelect
        allowedAttempts={allowedAttempts}
        handleChange={handleChange}
      />

      {allowedAttempts && (
        <NumberOfAttemptsInput
          numberOfAttempts={numberOfAttempts}
          handleChange={handleChange}
        />
      )}

      <AssignToRadios
        isAssignToLabel
        assignTo={assignTo}
        handleChange={handleChange}
      />

      {/* Updated SectionSelect usage */}
      <SectionSelect
        sectionValue={sectionIds}
        groupValue={groupIds}
        assignTo={assignTo}
        handleChange={handleChange}
        formErrors={{}}
        multiSelect={multiSelect}
        fieldSection="sectionIds"
        fieldGroup="groupIds"
      />

      <DateInput
        label="Available From"
        name="availableFrom"
        value={availableFrom}
        handleChange={handleChange}
        fieldId="availableFrom"
        inputRef={availableFromRef}
        error={availableFromError}
      />
      <DateInput
        label="Due"
        name="dueDate"
        value={dueDate}
        handleChange={handleChange}
        fieldId="dueDate"
        inputRef={dueDateRef}
        error={dueDateError}
      />

      {/* Guidelines Modal */}
      {showGuidelines && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md mx-4 p-6 rounded shadow-lg relative">
            <button
              onClick={() => setShowGuidelines(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="flex items-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9 2a7 7 0 100 14A7 7 0 109 2zm1 10.93a.75.75 0 01-1.5 0V9a.75.75 0 011.5 0v3.93zM9.25 7a.75.75 0 011.5 0 .75.75 0 01-1.5 0z" />
              </svg>
              <h2 className="text-xl font-semibold">
                Assignment Creation Guidelines
              </h2>
            </div>

            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Use a descriptive title for the assignment.</li>
              <li>Provide a clear and concise description.</li>
              <li>
                Ensure start and end dates are valid and within the academic
                year.
              </li>
              <li>End date must be after the start date.</li>
              <li>Fill all required fields before submission.</li>
            </ul>
          </div>
        </div>
      )}
      {/* End of Guidelines Modal */}
    </div>
  );
};

export default CreateAssignmentForm;
