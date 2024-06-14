import React from "react";

const AssignToRadios = ({ assignTo, handleChange, title }) => (
  <fieldset className="mb-4">
    <legend className="text-lg font-semibold text-gray-700 mb-2">
      {title || "Assign To"}
    </legend>
    <div className="flex items-center gap-2 justify-evenly">
      <div className="flex items-center mr-4 text-md">
        <input
          type="radio"
          id="everyone"
          name="assignTo"
          value="everyone"
          checked={assignTo === "everyone"}
          onChange={handleChange}
          className="mr-2 focus:ring-blue-500"
        />
        <label htmlFor="everyone" className="text-sm font-medium text-gray-700">
          Everyone
        </label>
      </div>
      <div className="flex items-center mr-4">
        <input
          type="radio"
          id="section"
          name="assignTo"
          value="section"
          checked={assignTo === "section"}
          onChange={handleChange}
          className="mr-2 focus:ring-blue-500"
        />
        <label htmlFor="section" className="text-sm font-medium text-gray-700">
          Section
        </label>
      </div>
      <div className="flex items-center">
        <input
          type="radio"
          id="group"
          name="assignTo"
          value="group"
          checked={assignTo === "group"}
          onChange={handleChange}
          className="mr-2 focus:ring-blue-500"
        />
        <label htmlFor="group" className="text-sm font-medium text-gray-700">
          Group
        </label>
      </div>
    </div>
  </fieldset>
);

export default AssignToRadios;
