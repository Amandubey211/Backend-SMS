import React, { useState, useEffect } from "react";

const GradeOption = ({ displayGrade, setDisplayGrade }) => {
  // Initialize as a string for proper control of radio inputs ("true" or "false")
  const [selectedOption, setSelectedOption] = useState(
    displayGrade ? "true" : "false"
  );

  const handleOptionChange = (e) => {
    const value = e.target.value; // This returns "true" or "false"
    setSelectedOption(value);
    // Convert the string value back to boolean before updating state
    setDisplayGrade(value === "true");
  };

  // Update the local state when displayGrade prop changes (e.g., during editing)
  useEffect(() => {
    setSelectedOption(displayGrade ? "true" : "false");
  }, [displayGrade]);

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Grade
      </label>
      <div className="flex items-center">
        <input
          type="radio"
          id="yes"
          name="grade"
          value="true"
          checked={selectedOption === "true"}
          onChange={handleOptionChange}
          className="form-radio h-4 w-4 text-green-500 transition duration-150 ease-in-out"
        />
        <label htmlFor="yes" className="ml-2 text-sm text-gray-700">
          Yes
        </label>
        <input
          type="radio"
          id="no"
          name="grade"
          value="false"
          checked={selectedOption === "false"}
          onChange={handleOptionChange}
          className="form-radio h-4 w-4 text-gray-500 ml-6 transition duration-150 ease-in-out"
        />
        <label htmlFor="no" className="ml-2 text-sm text-gray-700">
          No
        </label>
      </div>
    </div>
  );
};

export default GradeOption;
