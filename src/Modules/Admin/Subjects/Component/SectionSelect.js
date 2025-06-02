import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";
import { Select } from "antd";

import {
  fetchGroupsByClass,
  fetchSectionsByClass,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";

const { Option } = Select;

const selectSections = createSelector(
  (store) => store.admin.group_section.sectionsList,
  (sectionsList) => sectionsList
);

const SectionSelect = ({
  sectionValue = [],
  groupValue = [],
  assignTo,
  handleChange,
  formErrors = {},
  multiSelect = false,
  fieldSection = "sectionIds",
  fieldGroup = "groupIds",
}) => {
  const { cid } = useParams();
  const dispatch = useDispatch();

  const allSections = useSelector(selectSections);
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

  const selectMode = multiSelect ? "multiple" : undefined;

  const handleSelectChange = (value, fieldName) => {
    handleChange({ target: { name: fieldName, value } });
  };

  return (
    <>
      {assignTo === "Section" && (
        <div>
          <div className="custom-ant-select">
            <Select
              mode={selectMode}
              size="large"
              style={{ width: "100%" }}
              className="mb-3"
              placeholder="Select Sections"
              value={sectionValue}
              onChange={(val) => handleSelectChange(val, fieldSection)}
              loading={loading}
              allowClear
            >
              {allSections && allSections.length > 0 ? (
                allSections.map((sec) => (
                  <Option key={sec._id} value={sec._id}>
                    {sec.sectionName}
                  </Option>
                ))
              ) : (
                <Option disabled>No Section available</Option>
              )}
            </Select>
          </div>
          {formErrors[fieldSection] && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors[fieldSection]}
            </p>
          )}
        </div>
      )}
      {assignTo === "Group" && (
        <div>
          <div className="custom-ant-select">
            <Select
              mode={selectMode}
              style={{ width: "100%", height: "2.6rem" }}
              placeholder="Select Groups"
              value={groupValue}
              className="mb-3"
              onChange={(val) => handleSelectChange(val, fieldGroup)}
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
          {formErrors[fieldGroup] && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors[fieldGroup]}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default SectionSelect;
