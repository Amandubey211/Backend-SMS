// GradeOption.jsx
import React, { useState, useEffect } from "react";

const GradeOption = ({ displayGrade, setDisplayGrade }) => {
  const [selectedOption, setSelectedOption] = useState(
    displayGrade ? "true" : "false"
  );

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    setDisplayGrade(value === "true");
  };

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
          id="gradeYes"
          name="grade"
          value="true"
          checked={selectedOption === "true"}
          onChange={handleOptionChange}
          className="mr-2 focus:ring-blue-500"
        />
        <label htmlFor="gradeYes" className="text-sm text-gray-700 mr-4">
          Yes
        </label>
        <input
          type="radio"
          id="gradeNo"
          name="grade"
          value="false"
          checked={selectedOption === "false"}
          onChange={handleOptionChange}
          className="mr-2 focus:ring-blue-500"
        />
        <label htmlFor="gradeNo" className="text-sm text-gray-700">
          No
        </label>
      </div>
    </div>
  );
};

export default GradeOption;
