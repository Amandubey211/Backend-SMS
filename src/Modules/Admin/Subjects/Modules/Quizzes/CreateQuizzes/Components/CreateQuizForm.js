import React, { useEffect, useState } from "react";
import DateInput from "../../../../Component/DateInput";
import SectionSelect from "../../../../Component/SectionSelect";
import AssignToRadios from "../../../../Component/AssignToRadios";
import LabeledSelect from "./LabeledSelect";
import LabeledInput from "./LabeledInput";
import { useSelector } from "react-redux";
import useGetModulesForStudent from "../../../../../../../Hooks/AuthHooks/Staff/Admin/Assignment/useGetModulesForStudent";

const CreateQuizForm = ({
  quizType,
  allowShuffleAnswers,
  lockQuestionsAfterAnswering,
  numberOfAttempts,
  showOneQuestionAtATime,
  allowMultiple,
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
  const [chapters, setChapters] = useState([]);
  const { loading, error, fetchModules } = useGetModulesForStudent();

  const moduleList = useSelector((store) => store.Subject.modules);
  useEffect(() => {
    // Fetch modules if not available in the Redux store
    if (!moduleList || moduleList.length === 0) {
      fetchModules();
    }
  }, [moduleList, fetchModules]);

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

        <LabeledInput
          label="Time limit"
          name="timeLimit"
          value={timeLimit}
          onChange={handleChange}
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowMultiple"
            name="allowMultiple"
            checked={allowMultiple}
            onChange={handleChange}
            className="mr-2 p-3"
          />
          <label htmlFor="allowMultiple" className="text-gray-700">
            Allow Multiple Attempts
          </label>
        </div>

        {!allowMultiple && (
          <LabeledInput
            label="Allowed Attempts"
            name="numberOfAttempts"
            type="number"
            value={numberOfAttempts}
            onChange={handleChange}
          />
        )}

        <h2 className="text-xl font-semibold mt-6 pt-4 border-t">
          Quiz Restrictions
        </h2>
        <div className="p-2">
          <h3 className="text-gray-700 mb-1">
            Students See the Correct Answer
          </h3>
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="seeAnswerYes"
              name="studentSeeAnswer"
              value="yes"
              checked={studentSeeAnswer === "yes"}
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
              value="no"
              checked={studentSeeAnswer === "no"}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="seeAnswerNo">No</label>
          </div>
          {studentSeeAnswer === "yes" && (
            <DateInput
              label="Select Date"
              name="showAnswerDate"
              value={showAnswerDate}
              handleChange={handleChange}
            />
          )}
        </div>
        <div className="space-y-4">
          <LabeledSelect
            label="Show one question at a time"
            name="showOneQuestionAtATime"
            value={showOneQuestionAtATime}
            onChange={handleChange}
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="lockQuestionsAfterAnswering"
              name="lockQuestionsAfterAnswering"
              checked={lockQuestionsAfterAnswering}
              onChange={handleChange}
              className="mr-2 p-3"
            />
            <label
              htmlFor="lockQuestionsAfterAnswering"
              className="text-gray-700"
            >
              Lock questions after answering
            </label>
          </div>
        </div>

        <AssignToRadios
          assignTo={assignTo}
          handleChange={handleChange}
          isAssignToLabel={true}
        />
        <SectionSelect
          sectionId={sectionId}
          handleChange={handleChange}
          groupId={groupId}
          assignTo={assignTo}
        />
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
            value={chapterId}
            name="chapterId"
            onChange={handleChange}
            disabled={!moduleId} // Disable the dropdown if no module is selected
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

        <DateInput
          label="Available from"
          name="availableFrom"
          value={availableFrom || "DD/MM/YY"}
          handleChange={handleChange}
        />
        <DateInput
          label="Due"
          name="dueDate"
          value={dueDate || "DD/MM/YY"}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CreateQuizForm;
