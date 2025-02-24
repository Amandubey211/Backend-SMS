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
  sectionId,
  dueDate,
  availableFrom,
  moduleId,
  chapterId,
  groupId,
  // Refs passed from MainSection:
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
}) => {
  const dispatch = useDispatch();
  const moduleList = useSelector((store) => store.admin.module.modules);
  const { cid, sid } = useParams();
  const [chapters, setChapters] = useState([]);

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
    <div className="max-w-sm mx-auto p-6 bg-white border">
      <h3 className="text-lg font-semibold mb-4">Options</h3>

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
          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md focus:outline-none ${
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
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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

      <SectionSelect
        sectionId={sectionId}
        groupId={groupId}
        assignTo={assignTo}
        handleChange={handleChange}
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
    </div>
  );
};

export default CreateAssignmentForm;
