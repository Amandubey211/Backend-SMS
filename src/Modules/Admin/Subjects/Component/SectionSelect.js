import React from "react";
import { useSelector } from "react-redux";

const SectionSelect = ({ section, handleChange }) => {
  const AllSections = useSelector((store) => store.Class.sectionsList);

  return (
    <>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Section
      </label>

      <select
        value={section}
        name="section"
        onChange={handleChange}
        className="block w-full mb-4 p-2 border border-gray-300 rounded-lg"
      >
        <option value="">Choose Section</option>
        {AllSections.map((section) => (
          <option key={section._id} value={section._id}>
            {section.sectionName}
          </option>
        ))}
      </select>
    </>
  );
};

export default SectionSelect;
