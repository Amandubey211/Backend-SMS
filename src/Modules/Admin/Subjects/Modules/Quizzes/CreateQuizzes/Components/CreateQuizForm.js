import React, { useEffect, useState } from "react";
import PointsInput from "../../../Assignments/CreateAssignment/Component/PointsInput";
import DateInput from "../../../../Component/DateInput";
import SectionSelect from "../../../../Component/SectionSelect";
import AssignToRadios from "../../../../Component/AssignToRadios";
import LabeledSelect from "./LabeledSelect";
import LabeledInput from "./LabeledInput";
import { useSelector } from "react-redux";

const CreateQuizForm = ({
  quizType,
  allowShuffleAnswers,
  lockQuestionsAfterAnswering,
  numberOfAttempts,
  showOneQuestionAtATime,
  allowMultiple,
  assignTo,
  timeLimit,
  section,
  dueDate,
  availableFrom,
  handleChange,
  studentSeeAnswer,
  showAnswerDate,
  moduleId,
  chapterId,
}) => {
  const [chapters, setChapters] = useState([]);
  const moduleList = useSelector((store) => store.Subject.modules);
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
      <h2 className="text-xl font-semibold">Option</h2>
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
          <div className="flex items-center ">
            <input
              type="radio"
              name="allowShuffleAnswers"
              value="true"
              // checked={allowShuffleAnswers === true}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "allowShuffleAnswers",
                    value: e.target.value === "true",
                  },
                })
              }
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="allowShuffleAnswers"
              value="false"
              // checked={allowShuffleAnswers === false}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "allowShuffleAnswers",
                    value: e.target.value === "false",
                  },
                })
              }
              className="mr-2"
            />
            <label>No</label>
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
            name="allowMultiple"
            checked={allowMultiple}
            onChange={handleChange}
            className="mr-2 p-3"
          />
          <label className="text-gray-700">Allow Multiple Attempts</label>
        </div>

        <LabeledInput
          label="Allowed Attempts"
          name="numberOfAttempts"
          type="number"
          value={numberOfAttempts}
          onChange={handleChange}
        />

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
              name="studentSeeAnswer"
              value="yes"
              checked={studentSeeAnswer === "yes"}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="studentSeeAnswer"
              value="no"
              checked={studentSeeAnswer === "no"}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
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
              name="lockQuestionsAfterAnswering"
              checked={lockQuestionsAfterAnswering}
              onChange={handleChange}
              className="mr-2 p-3"
            />
            <label className="text-gray-700">
              Lock questions after answering
            </label>
          </div>
        </div>

        <AssignToRadios
          assignTo={assignTo}
          handleChange={handleChange}
          isAssignToLabel={true}
        />
        <SectionSelect section={section} handleChange={handleChange} />
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
          >
            <option value="">Select</option>
            {chapters.map((chapter) => (
              <option key={chapter._id} value={chapter._id}>
                {chapter.name}
              </option>
            ))}
          </select>
        </div>
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
    </div>
  );
};

export default CreateQuizForm;
