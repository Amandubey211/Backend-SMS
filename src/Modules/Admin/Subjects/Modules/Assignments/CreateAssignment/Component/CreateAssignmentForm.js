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
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Button } from "antd";
import { FiInfo, FiCheck } from "react-icons/fi";

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
          className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
        >
          <FiInfo className="w-5 h-5" />
          <span>Guidelines</span>
        </button>
      </div>

      {/* Existing form fields remain unchanged */}
      <PointsInput
        id="points"
        points={points}
        handleChange={handleChange}
        inputRef={pointsRef}
        error={pointsError}
      />

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

      {/* Guidelines Modal - Updated text for Assignment context */}
      <Modal
        visible={showGuidelines}
        onCancel={() => setShowGuidelines(false)}
        footer={null}
        width={550}
        className="rounded-xl shadow-lg"
        maskStyle={{ backdropFilter: "blur(5px)" }}
      >
        <AnimatePresence>
          {showGuidelines && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col p-6"
            >
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FiInfo className="text-purple-600 text-4xl" />
                </div>
                <h2 className="text-purple-800 text-xl font-semibold">
                  Assignment Creation Guidelines
                </h2>
              </div>

              {/* Guidelines List */}
              <ul className="list-none text-gray-700 pl-6 space-y-2">
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>
                    Use a <strong>descriptive title</strong> for the assignment.
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>
                    Provide a <strong>clear</strong> and{" "}
                    <strong>concise</strong> description.
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>
                    Ensure the <strong>available from</strong> and{" "}
                    <strong>due date</strong> are valid and within the course
                    timeframe.
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>
                    The <strong>due date</strong> must be after the{" "}
                    <strong>available from</strong> date.
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>
                    Fill all <strong>required fields</strong> before submission.
                  </span>
                </li>
              </ul>

              {/* Footer */}
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setShowGuidelines(false)}
                  className="border border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-all"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
      {/* End Guidelines Modal */}
    </div>
  );
};

export default CreateAssignmentForm;
