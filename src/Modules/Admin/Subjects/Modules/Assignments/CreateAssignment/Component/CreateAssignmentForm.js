import React from 'react';
import GradeDropdown from './GradeDropDown';
import SubmissionTypeDropdown from './SubmissionTypeDropdown ';

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
  handleChange
}) => {
  return (
    <div className="max-w-sm mx-auto p-6 bg-white border ">
      <h3 className="text-lg font-semibold mb-4">Option</h3>

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Points
      </label>
      <input
        type="number"
        name="points"
        value={points}
        onChange={handleChange}
        className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <GradeDropdown displayGrade={displayGrade} setDisplayGrade={setDisplayGrade} />

      <SubmissionTypeDropdown submissionFormat={submissionFormat} setSubmissionFormat={setSubmissionFormat} />

      <div className="flex items-center mb-4">
        <input
          type="radio"
          name="submissionType"
          value="textEntry"
          checked={submissionType === "textEntry"}
          onChange={handleChange}
          className="mr-2 focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Text Entry</label>
        <input
          type="radio"
          name="submissionType"
          value="websiteURL"
          checked={submissionType === "websiteURL"}
          onChange={handleChange}
          className="ml-4 mr-2 focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Website URL</label>
        <input
          type="radio"
          name="submissionType"
          value="fileUpload"
          checked={submissionType === "fileUpload"}
          onChange={handleChange}
          className="ml-4 mr-2 focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">File upload</label>
      </div>

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Allowed Attempts
      </label>
      <select
        name="allowedAttempts"
        value={allowedAttempts}
        onChange={handleChange}
        className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select</option>
        <option value="limited">Limited</option>
        <option value="unlimited">Unlimited</option>
      </select>

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Number of Attempts
      </label>
      <input
        type="number"
        name="numberOfAttempts"
        value={numberOfAttempts}
        onChange={handleChange}
        className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <h3 className="text-lg font-semibold mb-4">Assign To</h3>
      <div className="flex items-center mb-4">
        <input
          type="radio"
          name="assignTo"
          value="everyone"
          checked={assignTo === "everyone"}
          onChange={handleChange}
          className="mr-2 focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Everyone</label>
        <input
          type="radio"
          name="assignTo"
          value="section"
          checked={assignTo === "section"}
          onChange={handleChange}
          className="ml-4 mr-2 focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Section</label>
        <input
          type="radio"
          name="assignTo"
          value="group"
          checked={assignTo === "group"}
          onChange={handleChange}
          className="ml-4 mr-2 focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Group</label>
      </div>

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Section
      </label>
      <select
        name="section"
        value={section}
        onChange={handleChange}
        className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Section</option>
        <option value="section1">Section 1</option>
        <option value="section2">Section 2</option>
        <option value="section3">Section 3</option>
      </select>

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Due
      </label>
      <input
        type="date"
        name="dueDate"
        value={dueDate}
        onChange={handleChange}
        className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Available from
      </label>
      <input
        type="date"
        name="availableFrom"
        value={availableFrom}
        onChange={handleChange}
        className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Until
      </label>
      <input
        type="date"
        name="until"
        value={until}
        onChange={handleChange}
        className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button className=" py-2 text-green-500 font-medium rounded-md hover:text-green-800 transition">
          + Add Assign
        </button>
    </div>
  );
};

export default CreateAssignmentForm;
