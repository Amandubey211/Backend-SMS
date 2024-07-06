import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useFetchSection from "../../../../Hooks/AuthHooks/Staff/Admin/Sections/useFetchSection";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";

const selectSections = createSelector(
  (store) => store.Class.sectionsList,
  (sectionsList) => sectionsList
);

const SectionSelect = ({ section, handleChange }) => {
  const { error, fetchSection, loading } = useFetchSection();
  const { cid } = useParams();
  const AllSections = useSelector(selectSections);

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
