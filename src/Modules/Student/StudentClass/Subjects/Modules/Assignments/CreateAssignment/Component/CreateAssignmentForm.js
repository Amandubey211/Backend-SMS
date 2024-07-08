import React from "react";
import GradeDropdown from "./GradeDropDown";
import SubmissionTypeDropdown from "./SubmissionTypeDropdown ";
import PointsInput from "./PointsInput";
import SubmissionTypeRadios from "./SubmissionTypeRadios";
import AllowedAttemptsSelect from "./AllowedAttemptsSelect";
import NumberOfAttemptsInput from "./NumberOfAttemptsInput";
import AssignToRadios from "../../../../Component/AssignToRadios";
import SectionSelect from "../../../../Component/SectionSelect";
import DateInput from "../../../../Component/DateInput";

const CreateAssignmentForm = ({
  points,
  displayGrade,
  setDisplayGrade,
  submissionType,
  submissionFormat,
  setSubmissionFormat,
  allowedAttempts,
  numberOfAttempts,
  assignTo,
  section,
  dueDate,
  availableFrom,
  until,
  handleChange,
}) => {
  return (
    <div className="max-w-sm mx-auto p-6 bg-white border">
      <h3 className="text-lg font-semibold mb-4">Option</h3>

      <PointsInput points={points} handleChange={handleChange} />
      <GradeDropdown
        displayGrade={displayGrade}
        setDisplayGrade={setDisplayGrade}
      />
      <SubmissionTypeDropdown
        submissionFormat={submissionFormat}
        setSubmissionFormat={setSubmissionFormat}
      />
      <SubmissionTypeRadios
        submissionType={submissionType}
        handleChange={handleChange}
      />
      <AllowedAttemptsSelect
        allowedAttempts={allowedAttempts}
        handleChange={handleChange}
      />
      <NumberOfAttemptsInput
        numberOfAttempts={numberOfAttempts}
        handleChange={handleChange}
      />

      <h3 className="text-lg font-semibold mb-4">Assign To</h3>
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

      <button className="py-2 text-green-500 font-medium rounded-md hover:text-green-800 transition">
        + Add Assign
      </button>
    </div>
  );
};

export default CreateAssignmentForm;
