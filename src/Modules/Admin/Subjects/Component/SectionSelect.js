<<<<<<< HEAD
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
=======
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useFetchSection from "../../../../Hooks/AuthHooks/Staff/Admin/Sections/useFetchSection";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";

const selectSections = createSelector(
  (store) => store.Class.sectionsList,
  (sectionsList) => sectionsList
);

const SectionSelect = ({ section, handleChange,groupId }) => {
  const { error, fetchSection, loading } = useFetchSection();
  const { cid } = useParams();
  const AllSections = useSelector(selectSections);
  const groups = section
    ? AllSections.find((sec) => sec._id === section)?.groups
    : AllSections.reduce((acc, sec) => acc.concat(sec.groups), []);

  useEffect(() => {
    if (!AllSections.length) {
      fetchSection(cid);
    }
  }, [fetchSection, AllSections, cid]);

  if (loading) {
    return <p>Loading sections...</p>;
  }

  if (error) {
    return <p>Error loading sections: {error}</p>;
  }

  return (
    <>
      <div className="mt-4">
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
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Group
        </label>
        <select
          value={groupId}
          name="groupId"
          onChange={handleChange}
          className="block w-full p-2 border border-gray-300 rounded-lg"
          disabled={loading}
        >
          <option value="">Choose Group</option>
          {groups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.groupName}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default SectionSelect;
>>>>>>> main
