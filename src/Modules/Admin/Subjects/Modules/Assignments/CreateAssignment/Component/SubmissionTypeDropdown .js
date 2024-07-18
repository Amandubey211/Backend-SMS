import React, { useState, useEffect } from 'react';

const SubmissionTypeDropdown = ({ submissionFormat, setSubmissionFormat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(submissionFormat || 'Select');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setSubmissionFormat(option);
    setIsOpen(false);
  };

  useEffect(() => {
    setSelectedOption(submissionFormat || 'Select');
  }, [submissionFormat]);

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
            {['No Submission', 'Online', 'On Paper', 'External Tool'].map((option) => (
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
    </div>
  );
};

export default SubmissionTypeDropdown;
