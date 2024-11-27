// TopNavigationWithFilters.js
import React, { useEffect, useState, useMemo } from "react";
import { Input, Select, Button, Row, Col, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const TopNavigationWithFilters = ({
  onFrontendFilterChange,
  onAcademicYearFilterChange, // Added prop
  academicYears,
}) => {
  const { t } = useTranslation("admTimeTable");

  // Local filter state for frontend filtering
  const [filters, setFilters] = useState({
    name: "",
    academicYear: "",
  });

  // Debounced function to handle name filtering
  const debouncedHandleNameFilter = useMemo(
    () =>
      debounce((value) => {
        onFrontendFilterChange(value);
      }, 300),
    [onFrontendFilterChange]
  );

  // Cleanup debounce on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      debouncedHandleNameFilter.cancel();
    };
  }, [debouncedHandleNameFilter]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));

    if (filterName === "name") {
      // Trigger frontend filter change with debounce
      debouncedHandleNameFilter(value);
    }

    if (filterName === "academicYear") {
      // Trigger academic year filter change immediately
      onAcademicYearFilterChange(value);
    }
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      academicYear: "",
    });
    onFrontendFilterChange(""); // Reset frontend filter
    onAcademicYearFilterChange(""); // Reset academic year filter
  };

  return (
    <div className="p-4 bg-transparent mb-5">
      <Row gutter={16} align="middle" justify="end">
        {/* Name Filter */}
        <Col>
          <label
            className="font-medium text-gray-700"
            style={{ paddingRight: "8px" }}
          >
            {t("Name")}
          </label>
          <Input
            placeholder={t("Search by Name")}
            prefix={<SearchOutlined />}
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            allowClear
            style={{ width: "200px" }}
          />
        </Col>

        {/* Academic Year Filter */}
        <Col>
          <label
            className="font-medium text-gray-700"
            style={{ paddingRight: "8px" }}
          >
            {t("Academic Year")}
          </label>
          <Select
            placeholder={t("Select Academic Year")}
            value={filters.academicYear}
            onChange={(value) => handleFilterChange("academicYear", value)}
            style={{ width: "200px" }}
            allowClear
          >
            {/* Removed redundant Option with value="" */}
            {academicYears.map((year) => (
              <Option key={year.id} value={year.id}>
                {year.name}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Action Buttons */}
        <Col>
          <Space size="middle">
            <Button
              onClick={clearFilters}
              style={{
                borderRadius: "6px",
                color: "#1890ff",
                borderColor: "#1890ff",
              }}
            >
              {t("Clear Filters")}
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default TopNavigationWithFilters;
