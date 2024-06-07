import React from 'react';

const SectionSelect = ({ section, handleChange }) => (
  <>
    <label className="block mb-2 text-sm font-medium text-gray-700">Section</label>
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
  </>
);

export default SectionSelect;