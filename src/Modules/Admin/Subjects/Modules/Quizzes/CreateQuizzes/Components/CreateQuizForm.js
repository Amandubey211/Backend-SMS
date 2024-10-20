import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DateInput from "../../../../Component/DateInput";
import SectionSelect from "../../../../Component/SectionSelect";
import AssignToRadios from "../../../../Component/AssignToRadios";
import LabeledSelect from "./LabeledSelect";
import LabeledInput from "./LabeledInput";
import { useParams } from "react-router-dom";
import { fetchModules } from "../../../../../../../Store/Slices/Admin/Class/Module/moduleThunk";
import { format } from "date-fns"; // Import date-fns for formatting

const AllowedAttemptsSelect = ({ allowedAttempts, handleChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700">Allowed Attempts</label>
      <select
        name="allowedAttempts"
        value={allowedAttempts ? "true" : "false"} // Handle boolean as string
        onChange={(e) =>
          handleChange({
            target: {
              name: "allowedAttempts",
              value: e.target.value === "true", // Convert to boolean
            },
          })
        }
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select</option>
        <option value="false">Limited</option>
        <option value="true">Unlimited</option>
      </select>
    </div>
  );
};
const CreateQuizForm = ({
  quizType,
  allowShuffleAnswers,
  lockQuestionAfterAnswering,
  allowNumberOfAttempts,
  showOneQuestionOnly,
  allowedAttempts,
  assignTo,
  timeLimit,
  sectionId,
  dueDate,
  availableFrom,
  handleChange,
  studentSeeAnswer,
  showAnswerDate,
  moduleId,
  chapterId,
  groupId,
}) => {
  const dispatch = useDispatch();
  const [chapters, setChapters] = useState([]);
  const { modules } = useSelector((state) => state.admin.module);
  const { cid, sid } = useParams();

  useEffect(() => {
    // Fetch modules if not already present
    if (!modules || modules.length === 0) {
      dispatch(fetchModules({ cid, sid }));
    }
  }, [dispatch, modules]);

  // Populate chapters based on selected module
  useEffect(() => {
    if (moduleId) {
      const selectedModule = modules.find((mod) => mod._id === moduleId);
      setChapters(selectedModule ? selectedModule.chapters : []);
    } else {
      setChapters([]);
    }
  }, [moduleId, modules]);

  // Function to format date to "yyyy-MM-dd"
  const formatDate = (date) => {
    return date ? format(new Date(date), "yyyy-MM-dd") : "";
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white space-y-2">
      <h2 className="text-xl font-semibold">Options</h2>
      <div className="space-y-4">
        <LabeledSelect
          label="Quiz type"
          name="quizType"
          value={quizType}
          onChange={handleChange}
          options={[
            { value: "", label: "Select" },
            { value: "Practice", label: "Practice Quiz" },
            { value: "Graded", label: "Graded Quiz" },
          ]}
        />

        {/* Shuffle Answers Input */}
        <div className="p-2">
          <h3 className="text-gray-700">Shuffle Answers</h3>
          <div className="flex items-center">
            <input
              type="radio"
              id="shuffleYes"
              name="allowShuffleAnswers"
              value="true"
              checked={allowShuffleAnswers === true}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "allowShuffleAnswers",
                    value: true,
                  },
                })
              }
              className="mr-2"
            />
            <label htmlFor="shuffleYes" className="mr-4">
              Yes
            </label>
            <input
              type="radio"
              id="shuffleNo"
              name="allowShuffleAnswers"
              value="false"
              checked={allowShuffleAnswers === false}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "allowShuffleAnswers",
                    value: false,
                  },
                })
              }
              className="mr-2"
            />
            <label htmlFor="shuffleNo">No</label>
          </div>
        </div>

        {/* Time Limit Input */}
        <LabeledInput
          label="Time limit in Minutes"
          name="timeLimit"
          value={timeLimit}
          onChange={handleChange}
        />

        {/* Allowed Attempts
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowedAttempts"
            name="allowedAttempts"
            checked={allowedAttempts}
            onChange={handleChange}
            className="mr-2 p-3"
          />
          <label htmlFor="allowedAttempts" className="text-gray-700">
            Allow Multiple Attempts
          </label>
        </div>

        {!allowedAttempts && (
          <LabeledInput
            label="Allowed Attempts"
            name="allowNumberOfAttempts"
            type="number"
            value={allowNumberOfAttempts}
            onChange={handleChange}
          />
        )} */}

        {/* Allowed Attempts using Select Box */}
        <AllowedAttemptsSelect
          allowedAttempts={allowedAttempts}
          handleChange={handleChange}
        />

        {/* Conditionally show Number of Attempts input when allowedAttempts is false (i.e., Limited) */}
        {allowedAttempts === false && (
          <LabeledInput
            label="Number of Attempts"
            name="allowNumberOfAttempts"
            type="number"
            value={allowNumberOfAttempts || ""} // Reset to empty if null
            onChange={handleChange}
          />
        )}

        {/* Quiz Restrictions */}
        <h2 className="text-xl font-semibold mt-6 pt-4 border-t">
          Quiz Restrictions
        </h2>

        {/* See Answer Option */}
        <div className="p-2">
          <h3 className="text-gray-700 mb-1">
            Students See the Correct Answer
          </h3>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="seeAnswerYes"
              name="studentSeeAnswer"
              value="true"
              checked={studentSeeAnswer === "true" || studentSeeAnswer === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="seeAnswerYes" className="mr-4">
              Yes
            </label>
            <input
              type="radio"
              id="seeAnswerNo"
              name="studentSeeAnswer"
              value="false"
              checked={
                studentSeeAnswer === "false" || studentSeeAnswer === false
              }
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="seeAnswerNo">No</label>
          </div>
          {(studentSeeAnswer === "true" || studentSeeAnswer === true) && (
            <DateInput
              label="Select Date"
              name="showAnswerDate"
              value={formatDate(showAnswerDate)} // Use formatted date here
              handleChange={handleChange}
            />
          )}
        </div>

        {/* Show One Question at a Time */}
        <LabeledSelect
          label="Show one question at a time"
          name="showOneQuestionOnly"
          value={showOneQuestionOnly}
          onChange={handleChange}
          options={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ]}
        />

        {/* Lock Question After Answering */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="lockQuestionAfterAnswering"
            name="lockQuestionAfterAnswering"
            checked={lockQuestionAfterAnswering}
            onChange={handleChange}
            className="mr-2 p-3"
          />
          <label htmlFor="lockQuestionAfterAnswering" className="text-gray-700">
            Lock questions after answering
          </label>
        </div>

        {/* Assign To Section */}
        <AssignToRadios
          assignTo={assignTo}
          handleChange={handleChange}
          isAssignToLabel={true}
        />

        {/* Section Select */}
        <SectionSelect
          sectionId={sectionId}
          handleChange={handleChange}
          groupId={groupId}
          assignTo={assignTo}
        />

        {/* Module and Chapter Select */}
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="module-select">
            Module
          </label>
          <select
            id="module-select"
            className="mt-1 block w-full pl-3 pr-10 border py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={moduleId}
            name="moduleId"
            onChange={handleChange}
          >
            <option value="">Select</option>
            {modules.map((module) => (
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
            value={chapterId}
            name="chapterId"
            onChange={handleChange}
            disabled={!moduleId}
          >
            {moduleId ? (
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

        {/* Date Inputs */}
        <DateInput
          label="Available from"
          name="availableFrom"
          value={formatDate(availableFrom)} // Format date for input
          handleChange={handleChange}
        />
        <DateInput
          label="Due"
          name="dueDate"
          value={formatDate(dueDate)} // Format date for input
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CreateQuizForm;
