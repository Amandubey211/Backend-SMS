// src/components/StaffSelect.js

import React, { useEffect, useMemo } from "react";
import { Select, Spin, Typography, Tag } from "antd";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { UserOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  fetchTeachingStaff,
  fetchNonTeachingStaff, // Ensure you have this action
} from "../../../../../../Store/Slices/Finance/Expenses/expensesThunks";

const { Option } = Select;
const { Text } = Typography;

const StaffSelect = ({
  name,
  label,
  setFieldValue,
  value,
  staffType, // New prop to determine staff type
}) => {
  const dispatch = useDispatch();

  // Select the appropriate staff list and loading/error states based on staffType
  const {
    teachingStaff,
    teachingStaffLoading,
    teachingStaffError,
    nonTeachingStaff,
    nonTeachingStaffLoading,
    nonTeachingStaffError,
  } = useSelector((state) => state.admin.expenses);

  // Determine which staff list to use
  const currentStaff =
    staffType === "non-teaching" ? nonTeachingStaff : teachingStaff;
  const currentLoading =
    staffType === "non-teaching"
      ? nonTeachingStaffLoading
      : teachingStaffLoading;
  const currentError =
    staffType === "non-teaching" ? nonTeachingStaffError : teachingStaffError;

  const [searchTerm, setSearchTerm] = React.useState("");

  useEffect(() => {
    if (staffType === "non-teaching" && nonTeachingStaff.length === 0) {
      dispatch(fetchNonTeachingStaff());
    } else if (staffType === "teaching" && teachingStaff.length === 0) {
      dispatch(fetchTeachingStaff());
    }
  }, [dispatch, staffType, teachingStaff.length, nonTeachingStaff.length]);

  const handleChange = (selectedId) => {
    setFieldValue(name, selectedId);
  };

  const handleSearch = (value) => {
    setSearchTerm(value.trim().toLowerCase());
  };

  // Memoize the filtered list for performance optimization
  const filteredStaff = useMemo(() => {
    if (!searchTerm) return currentStaff;
    return currentStaff.filter(
      (staff) =>
        staff.name.toLowerCase().startsWith(searchTerm) ||
        staff.role.some((role) => role.toLowerCase().includes(searchTerm))
    );
  }, [currentStaff, searchTerm]);

  // Function to highlight the matching part of the staff name
  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const index = text.toLowerCase().indexOf(highlight);
    if (index === -1) return text;
    const before = text.slice(0, index);
    const match = text.slice(index, index + highlight.length);
    const after = text.slice(index + highlight.length);
    return (
      <>
        {before}
        <span style={{ backgroundColor: "#ffc069", fontWeight: "bold" }}>
          {match}
        </span>
        {after}
      </>
    );
  };

  return (
    <div style={{ marginBottom: 24, padding: "0 16px" }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: "block",
            marginBottom: 8,
            fontWeight: "bold",
          }}
        >
          {label}
        </label>
      )}
      <Select
        showSearch
        size="large" // Increased size for more vertical padding
        placeholder={`Select a ${
          staffType === "non-teaching" ? "non-teaching" : "teaching"
        } staff`}
        value={value}
        onChange={handleChange}
        onSearch={handleSearch}
        loading={currentLoading}
        notFoundContent={
          currentLoading ? <Spin size="small" /> : "No staff found"
        }
        optionFilterProp="children" // Using 'children' since we're handling custom rendering
        filterOption={false} // Disable default filtering to use custom logic
        allowClear // Enables the clear (×) icon
        clearIcon={<CloseCircleOutlined />} // Appropriate clear icon
        style={{ width: "100%" }}
      >
        {filteredStaff.map((staff) => (
          <Option key={staff._id} value={staff._id}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "4px 0",
              }}
            >
              <UserOutlined style={{ marginRight: 8, fontSize: 16 }} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "nowrap",
                }}
              >
                <Text style={{ marginRight: 8 }}>
                  {highlightText(staff.name, searchTerm)}
                </Text>
                <div style={{ display: "flex" }}>
                  {staff.role.map((role, index) => (
                    <Tag color="blue" key={index} style={{ marginRight: 4 }}>
                      {role}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </Option>
        ))}
      </Select>
      {currentError && (
        <Text type="danger" style={{ marginTop: 8, display: "block" }}>
          {currentError}
        </Text>
      )}
    </div>
  );
};

StaffSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  setFieldValue: PropTypes.func.isRequired,
  value: PropTypes.string,
  staffType: PropTypes.oneOf(["teaching", "non-teaching"]).isRequired, // New prop
};

StaffSelect.defaultProps = {
  label: "",
  value: undefined,
};

export default StaffSelect;
