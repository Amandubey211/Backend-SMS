import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";

import {
  fetchGroupsByClass,
  fetchSectionsByClass,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";

const selectSections = createSelector(
  (store) => store.admin.group_section.sectionsList,
  (sectionsList) => sectionsList
);

const SectionSelect = ({
  sectionId,
  handleChange,
  groupId,
  assignTo,
  formErrors = {},
}) => {
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
            Section <span className="text-red-500">*</span>
          </label>
          <select
            id="sectionId"
            value={sectionId || ""}
            name="sectionId"
            onChange={handleChange}
            className={`block w-full mb-4 p-2 border rounded-lg ${
              formErrors.sectionId
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          >
            <option value="">Choose Section</option>
            {AllSections?.length > 0 ? (
              AllSections.map((sec) => (
                <option key={sec._id} value={sec._id}>
                  {sec.sectionName}
                </option>
              ))
            ) : (
              <option disabled>No Section available</option>
            )}
          </select>
          {formErrors.sectionId && (
            <p className="text-red-500 text-sm mt-1">{formErrors.sectionId}</p>
          )}
        </div>
      )}

      {assignTo === "Group" && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group <span className="text-red-500">*</span>
          </label>
          <select
            id="groupId"
            value={groupId || ""}
            name="groupId"
            onChange={handleChange}
            className={`block w-full p-2 border rounded-lg ${
              formErrors.groupId
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            disabled={loading}
          >
            <option value="">All Groups</option>
            {groupsList?.length > 0 ? (
              groupsList.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.groupName}
                </option>
              ))
            ) : (
              <option disabled>No groups available</option>
            )}
          </select>
          {formErrors.groupId && (
            <p className="text-red-500 text-sm mt-1">{formErrors.groupId}</p>
          )}
        </div>
      )}
    </>
  );
};

export default SectionSelect;
