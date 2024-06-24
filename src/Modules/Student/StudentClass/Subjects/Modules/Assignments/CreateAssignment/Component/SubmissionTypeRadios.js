import React from 'react';

const SubmissionTypeRadios = ({ submissionType, handleChange }) => (
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
);

export default SubmissionTypeRadios;