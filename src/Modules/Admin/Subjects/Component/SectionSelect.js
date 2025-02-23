import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";
import {
  fetchGroupsByClass,
  fetchSectionsByClass,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";

// Selector to fetch sections
const selectSections = createSelector(
  (store) => store.admin.group_section.sectionsList,
  (sectionsList) => sectionsList
);

const SectionSelect = ({ sectionId, handleChange, groupId, assignTo }) => {
  const { cid } = useParams();
  const dispatch = useDispatch();

  const AllSections = useSelector(selectSections);
  const groupsList = useSelector(
    (store) => store.admin.group_section.groupsList
  );
  const loading = useSelector((store) => store.admin.group_section.loading);

  useEffect(() => {
    if (cid) {
      dispatch(fetchSectionsByClass(cid));
      dispatch(fetchGroupsByClass(cid));
    }
  }, [dispatch, cid]);

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
            {AllSections?.length > 0 ? (
              AllSections?.map((section) => (
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
            {groupsList?.length > 0 ? (
              groupsList?.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.groupName}
                </option>
              ))
            ) : (
              <option disabled>No groups available</option>
            )}
          </select>
        </div>
      )}
    </>
  );
};

export default SectionSelect;
