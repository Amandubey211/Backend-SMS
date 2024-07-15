import React, { useState, useEffect } from "react";

const GradeDropdown = ({ displayGrade, setDisplayGrade }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    displayGrade || "Select"
  );
  const [isChecked, setIsChecked] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setDisplayGrade(option);
    setIsOpen(false);
    setIsChecked(false);
  };

  const handleCheckboxClick = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (newValue) {
      setSelectedOption("Do not count");
      setDisplayGrade("Do not count");
    } else {
      setSelectedOption("Select");
      setDisplayGrade("Select");
    }
    setIsOpen(false); // Close the dropdown
  };

  useEffect(() => {
    setSelectedOption(displayGrade || "Select");
  }, [displayGrade]);

  return (
    <div className="relative inline-block w-full mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Display Grade as
      </label>
      <button
        onClick={toggleDropdown}
        className="w-full p-3 border border-gray-300 rounded-md bg-white text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selectedOption}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-2">
            {[
              "Percentage",
              "Complete/Incomplete",
              "Points",
              "Letter Grade",
              "GPA Scale",
              "Not Graded",
            ].map((option) => (
              <li
                key={option}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
          <div className="px-4 py-2 border-t border-gray-300">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox focus:ring-blue-500"
                checked={isChecked}
                onChange={handleCheckboxClick}
              />
              <span className="ml-2 text-sm text-gray-700">
                Do not count this assignment towards the final grade
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeDropdown;
