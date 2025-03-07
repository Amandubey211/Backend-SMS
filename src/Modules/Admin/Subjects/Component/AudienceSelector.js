// AudienceSelector.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Select } from "antd";
import { createSelector } from "reselect";
import {
  fetchSectionsByClass,
  fetchGroupsByClass,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";

const { Option } = Select;

const selectSections = createSelector(
  (store) => store.admin.group_section.sectionsList,
  (sectionsList) => sectionsList
);

const AudienceSelector = ({ value, onChange }) => {
  // value: { groupIds: [], sectionIds: [] }
  const { cid } = useParams();
  const dispatch = useDispatch();

  // Fetch groups and sections from Redux store
  const sectionsList = useSelector(selectSections);
  const groupsList = useSelector(
    (store) => store.admin.group_section.groupsList
  );
  const loading = useSelector((store) => store.admin.group_section.loading);

  // Fetch data when component mounts or cid changes
  useEffect(() => {
    if (cid) {
      dispatch(fetchSectionsByClass(cid));
      dispatch(fetchGroupsByClass(cid));
    }
  }, [dispatch, cid]);

  const handleGroupChange = (newGroupIds) => {
    onChange({ ...value, groupIds: newGroupIds });
  };

  const handleSectionChange = (newSectionIds) => {
    onChange({ ...value, sectionIds: newSectionIds });
  };

  return (
    <div className="my-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Select Groups{" "}
          <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <Select
          mode="multiple"
          style={{ width: "100%", height: "2.5rem" }}
          placeholder="Select Groups"
          value={value.groupIds}
          onChange={handleGroupChange}
          loading={loading}
          allowClear
        >
          {groupsList && groupsList.length > 0 ? (
            groupsList.map((group) => (
              <Option key={group._id} value={group._id}>
                {group.groupName}
              </Option>
            ))
          ) : (
            <Option disabled>No Group available</Option>
          )}
        </Select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Select Sections{" "}
          <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <Select
          mode="multiple"
          style={{ width: "100%", height: "2.5rem" }}
          placeholder="Select Sections"
          value={value.sectionIds}
          onChange={handleSectionChange}
          loading={loading}
          allowClear
        >
          {sectionsList && sectionsList.length > 0 ? (
            sectionsList.map((sec) => (
              <Option key={sec._id} value={sec._id}>
                {sec.sectionName}
              </Option>
            ))
          ) : (
            <Option disabled>No Section available</Option>
          )}
        </Select>
      </div>
    </div>
  );
};

export default AudienceSelector;
