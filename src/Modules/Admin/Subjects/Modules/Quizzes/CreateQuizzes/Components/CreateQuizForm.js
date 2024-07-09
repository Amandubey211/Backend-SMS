import React from "react";
import PointsInput from "../../../Assignments/CreateAssignment/Component/PointsInput";
import DateInput from "../../../../Component/DateInput";
import SectionSelect from "../../../../Component/SectionSelect";
import AssignToRadios from "../../../../Component/AssignToRadios";
import LabeledSelect from "./LabeledSelect";
import LabeledInput from "./LabeledInput";

const CreateQuizForm = ({
  displayGrade,
  setDisplayGrade,
  submissionType,
  submissionFormat,
  lockQuestionsAfterAnswering,
  numberOfAttempts,
  showOneQuestionAtATime,
  allowMultiple,
  assignTo,
  timeLimit,
  section,
  dueDate,
  availableFrom,
  until,
  handleChange,
  accessCode,
  ipAddresses,
  studentSeeAnswer,
  showAnswerDate,
}) => {
  return (
    <div className="max-w-md mx-auto p-4 bg-white space-y-2">
      <h2 className="text-xl font-semibold">Option</h2>
      <div className="space-y-4">
        <LabeledSelect
          label="Quiz type"
          name="submissionType"
          value={submissionType}
          onChange={handleChange}
          options={[
            { value: "", label: "Select" },
            { value: "Practice", label: "Practice Quiz" },
            { value: "Graded", label: "Graded Quiz" },
          ]}
        />
        <LabeledSelect
          label="Shuffle Answers"
          name="submissionFormat"
          value={submissionFormat}
          onChange={handleChange}
          options={[
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ]}
        />
        <LabeledInput
          label="Time limit"
          name="timeLimit"
          value={timeLimit}
          onChange={handleChange}
        />
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
        {/* New section for Students See Correct Answer */}
        <div className="p-2">
          <h3 className="text-gray-700 mb-1">
            Students See the Correct Answer
          </h3>
          <div className="flex items-center">
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
          {/* <LabeledInput
            label="Require an access code"
            name="accessCode"
            value={accessCode}
            onChange={handleChange}
          />
          <LabeledInput
            label="Filter IP Addresses"
            name="ipAddresses"
            value={ipAddresses}
            onChange={handleChange}
          /> */}
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

        <AssignToRadios assignTo={assignTo} handleChange={handleChange} />
        <SectionSelect section={section} handleChange={handleChange} />
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

        {/* <DateInput
          label="Until"
          name="until"
          value={until}
          handleChange={handleChange}
        /> */}
      </div>
    </div>
  );
};

export default CreateQuizForm;
