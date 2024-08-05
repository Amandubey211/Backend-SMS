import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useFetchSection from "../../../../Hooks/AuthHooks/Staff/Admin/Sections/useFetchSection";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";

const selectSections = createSelector(
  (store) => store.Class.sectionsList,
  (sectionsList) => sectionsList
);

const SectionSelect = ({ section, handleChange, group, assignTo }) => {
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
  }, [fetchSection]);

  if (loading) {
    return <p>Loading sections...</p>;
  }

  if (error) {
    return <p>Error loading sections: {error}</p>;
  }

  return (
    <>
      {assignTo === "Section" && (
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Section
          </label>
          <select
            value={section}
            name="sectionId"
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
      )}
      {assignTo === "Group" && (
        // if section needs to be removed , just remove it from below
        <>
          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Section
            </label>
            <select
              value={section}
              name="sectionId"
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
              value={group}
              name="group"
              onChange={handleChange}
              className="block w-full p-2 border border-gray-300 rounded-lg"
              disabled={loading}
            >
              <option value="">Choose Group</option>
              {groups.map((group) => (
                <option key={group} value={group}>
                  {group}
                  {/* {group.name} */}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </>
  );
};

export default SectionSelect;
