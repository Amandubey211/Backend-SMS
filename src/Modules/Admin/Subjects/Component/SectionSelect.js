import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useFetchSection from "../../../../Hooks/AuthHooks/Staff/Admin/Sections/useFetchSection";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";
import useGetGroupsByClass from "../../../../Hooks/AuthHooks/Staff/Admin/Groups/useGetGroupByClass";

const selectSections = createSelector(
  (store) => store.Class.sectionsList,
  (sectionsList) => sectionsList
);

const SectionSelect = ({ sectionId, handleChange, groupId, assignTo }) => {
  const { error, fetchSection, loading } = useFetchSection();
  const {
    error: groupError,
    fetchGroupsByClass,
    loading: groupLoading,
  } = useGetGroupsByClass();
  const { cid } = useParams();
  const AllSections = useSelector(selectSections);
  const groupsList = useSelector((store) => store.Class.groupsList);

  useEffect(() => {
    fetchSection(cid);
    fetchGroupsByClass(cid);
  }, [fetchSection, fetchGroupsByClass, cid]);

  if (loading || groupLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {assignTo === "Section" && (
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Section
          </label>
          <select
            value={sectionId}
            name="sectionId"
            onChange={handleChange}
            className="block w-full mb-4 p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Choose Section</option>
            {AllSections.length > 0 ? (
              AllSections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.sectionName}
                </option>
              ))
            ) : (
              <option disabled>No Section available</option>
            )}
          </select>
        </div>
      )}
      {assignTo === "Group" && (
        <>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group
            </label>
            <select
              value={groupId}
              name="groupId"
              onChange={handleChange}
              className="block w-full p-2 border border-gray-300 rounded-lg"
              disabled={loading || groupLoading}
            >
              <option value="">Choose Group</option>
              {groupsList.length > 0 ? (
                groupsList.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.groupName}
                  </option>
                ))
              ) : (
                <option disabled>No groups available</option>
              )}
            </select>
          </div>
        </>
      )}
    </>
  );
};

export default SectionSelect;
