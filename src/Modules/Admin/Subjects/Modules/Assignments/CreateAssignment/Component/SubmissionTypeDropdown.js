import React, { useState, useEffect } from 'react';

const SubmissionTypeDropdown = ({ submissionType, handleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Select');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option !== 'Online') {
      handleChange({ target: { name: 'submissionType', value: option } });
    }
    setIsOpen(false);
  };

  const handleRadioChange = (e) => {
    const value = `Online-${e.target.value}`;
    handleChange({ target: { name: 'submissionType', value } });
  };

  useEffect(() => {
    setSelectedOption(submissionType.includes('Online') ? 'Online' : submissionType || 'Select');
  }, [submissionType]);

  return (
    <div className="relative inline-block w-full mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">Submission Type</label>
      <button
        onClick={toggleDropdown}
        className="w-full p-3 border border-gray-300 rounded-md bg-white text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selectedOption}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-2">
            {['NO submission', 'Online', 'On paper'].map((option) => (
              <li
                key={option}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedOption === 'Online' && (
        <div className="flex items-center mt-4">
          <input
            type="radio"
            name="submissionTypeDetail"
            value="textEntry"
            checked={submissionType === 'Online-textEntry'}
            onChange={handleRadioChange}
            className="mr-2 focus:ring-blue-500"
          />
          <label className="text-sm font-medium text-gray-700">Text Entry</label>
          <input
            type="radio"
            name="submissionTypeDetail"
            value="websiteURL"
            checked={submissionType === 'Online-websiteURL'}
            onChange={handleRadioChange}
            className="ml-4 mr-2 focus:ring-blue-500"
          />
          <label className="text-sm font-medium text-gray-700">Website URL</label>
          <input
            type="radio"
            name="submissionTypeDetail"
            value="fileUpload"
            checked={submissionType === 'Online-fileUpload'}
            onChange={handleRadioChange}
            className="ml-4 mr-2 focus:ring-blue-500"
          />
          <label className="text-sm font-medium text-gray-700">File Upload</label>
        </div>
      )}
    </div>
  );
};

export default SubmissionTypeDropdown;
