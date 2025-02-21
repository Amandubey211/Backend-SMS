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
  moduleRef,
  moduleError,
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
      const module = moduleList.find((mod) => mod._id === moduleId);
      if (module) {
        setChapters(module.chapters);
      } else {
        setChapters([]);
      }
    } else {
      setChapters([]);
    }
  }, [moduleId, moduleList]);

  const handleModuleChange = (e) => {
    const value = e.target.value;
    handleChange({ target: { name: "moduleId", value } });
  };

  const handleChapterChange = (e) => {
    const value = e.target.value;
    handleChange({ target: { name: "chapterId", value } });
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white border">
      <h3 className="text-lg font-semibold mb-4">Options</h3>

      <PointsInput points={points} handleChange={handleChange} />

      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="module-select">
          Module
        </label>
        <select
          id="module-select"
          ref={moduleRef}
          className={`mt-1 block w-full pl-3 pr-10 border py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
            moduleError ? "border-red-500" : "border-gray-300"
          }`}
          value={moduleId}
          onChange={handleModuleChange}
        >
          <option value="">Select</option>
          {moduleList?.map((module) => (
            <option key={module._id} value={module._id}>
              {module.moduleName}
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

      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="chapter-select">
          Chapter
        </label>
        <select
          id="chapter-select"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={chapterId}
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
        submissionType={submissionType}
        handleChange={handleChange}
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
    </div>
  );
};

export default CreateAssignmentForm;
