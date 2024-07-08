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
}) => {
  return (
    <div className="max-w-md  mx-auto p-4  bg-white  space-y-2">
      <h2 className="text-xl font-semibold">Option</h2>
      <div className="space-y-4">
        <LabeledSelect
          label="Quiz type"
          name="submissionType"
          value={submissionType}
          onChange={handleChange}
          options={[
            { value: '', label: 'Select' },
            { value: 'Type 1', label: 'Type 1' },
            { value: 'Type 2', label: 'Type 2' }
          ]}
        />
        <LabeledSelect
          label="Shuffle Answers"
          name="submissionFormat"
          value={submissionFormat}
          onChange={handleChange}
          options={[
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' }
          ]}
        />
        <LabeledInput
          label="Time limit"
          name="timeLimit"
          value={timeLimit}
          onChange={handleChange}
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            name="allwoMultiple"
          value={allowMultiple}
            onChange={handleChange}
            className="mr-2 p-3"
          />
          <label className="text-gray-700">Allow Multiple Attempt</label>
        </div>
        <LabeledSelect
          label="Quiz Score to Keep"
          name="displayGrade"
          value={displayGrade}
          onChange={(e) => setDisplayGrade(e.target.value)}
          options={[
            { value: '', label: 'Choose One' },
            { value: 'Highest', label: 'Highest' },
            { value: 'Latest', label: 'Latest' },
            { value: 'Average', label: 'Average' }
          ]}
        />
        <LabeledInput
          label="Allowed Attempts"
          name="numberOfAttempts"
          type="number"
          value={numberOfAttempts}
          onChange={handleChange}
        />
         
            <h2 className="text-xl font-semibold mt-6 border-t">Quiz Restrictions</h2>
      <div className="space-y-4">
        <LabeledInput
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
        />
        <LabeledSelect
          label="Show one question at a time"
          name="showOneQuestionAtATime"
          value={showOneQuestionAtATime}
          onChange={handleChange}
          options={[
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' }
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
          <label className="text-gray-700">Lock questions after answering</label>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-4 border-t">Assign To</h3>
        <AssignToRadios assignTo={assignTo} handleChange={handleChange} />
        <SectionSelect section={section} handleChange={handleChange} />
        <DateInput
          label="Due"
          name="dueDate"
          value={dueDate}
          handleChange={handleChange}
        />
        <DateInput
          label="Available from"
          name="availableFrom"
          value={availableFrom}
          handleChange={handleChange}
        />
        <DateInput
          label="Until"
          name="until"
          value={until}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CreateQuizForm;
