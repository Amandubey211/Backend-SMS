import React, { useState, useMemo } from "react";
import { Input, Select, Button, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";

const { Option } = Select;

/**
 * A top navigation bar with filters for timetable searches.
 * - Label positioned above the inputs
 * - Only a "Clear Filters" button (no apply button)
 * - Left-aligned filter elements, with cleaner vertical alignment for the button
 */
const TopNavigationWithFilters = ({
  onBackendFilterChange,
  onFrontendFilterChange,
  academicYears,
}) => {
  const { t } = useTranslation("admTimeTable");

  // Local filter state
  const [filters, setFilters] = useState({
    name: "",
    type: "",
  });

  // Debounced name filter: calls the parent's onFrontendFilterChange
  const debouncedHandleNameFilter = useMemo(
    () =>
      debounce((value) => {
        onFrontendFilterChange(value);
      }, 300),
    [onFrontendFilterChange]
  );

  /**
   * Handle local filter changes:
   * - `name` (frontend filter, debounced)
   * - `type` (backend filter, immediate)
   */
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));

    if (filterName === "name") {
      // Frontend filter via debounce
      debouncedHandleNameFilter(value);
    } else if (filterName === "type") {
      // Immediately update backend filter
      onBackendFilterChange({ ...filters, [filterName]: value });
    }
  };

  /**
   * Clears all filters
   */
  const clearFilters = () => {
    setFilters({
      name: "",
      type: "",
    });
    onBackendFilterChange({}); // Reload data without any filters
    onFrontendFilterChange(""); // Reset name-based search
  };

  return (
    <div className="p-4 bg-transparent mb-5">
      <Row gutter={16} align="bottom" justify="start">
        {/* Name Filter */}
        <Col>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">
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
          </div>
        </Col>

        {/* Type Filter */}
        <Col>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">
              {t("Type")}
            </label>
            <Select
              placeholder={t("All Types")}
              value={filters.type}
              onChange={(value) => handleFilterChange("type", value)}
              style={{ width: "180px" }}
              allowClear
            >
              <Option value="">{t("All Types")}</Option>
              <Option value="weekly">{t("Weekly")}</Option>
              <Option value="exam">{t("Exam")}</Option>
              <Option value="event">{t("Event")}</Option>
              <Option value="others">{t("Others")}</Option>
            </Select>
          </div>
        </Col>

        {/* Clear Filters Button */}
        <Col>
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
        </Col>
      </Row>
    </div>
  );
};

export default TopNavigationWithFilters;
