// TopNavigationWithFilters.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { Input, Select, Button, Row, Col, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";

const { Option } = Select;

const TopNavigationWithFilters = ({ onBackendFilterChange, onFrontendFilterChange, academicYears }) => {
  const dispatch = useDispatch();

  // Local filter state
  const [filters, setFilters] = useState({
    name: "",
    classId: "",
    type: "",
    status: "",
    academicYear: "",
  });

  // Fetch classes from Redux store
  const { classes, loading, error } = useSelector((state) => state.admin.class);

  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error("Failed to load classes. Please try again.");
  }, [error]);

  // Debounced function to handle name filtering
  const debouncedHandleNameFilter = useMemo(
    () =>
      debounce((value) => {
        onFrontendFilterChange(value);
      }, 300),
    [onFrontendFilterChange]
  );

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));

    if (
      filterName === "classId" ||
      filterName === "type" ||
      filterName === "status" ||
      filterName === "academicYear"
    ) {
      // Trigger backend filter change
      onBackendFilterChange({ ...filters, [filterName]: value });
    }

    if (filterName === "name") {
      // Trigger frontend filter change with debounce
      debouncedHandleNameFilter(value);
    }
  };

  const applyFilters = () => {
    onBackendFilterChange(filters);
    onFrontendFilterChange(filters.name);
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      classId: "",
      type: "",
      status: "",
      academicYear: "",
    });
    onBackendFilterChange({}); // Trigger API request to load data without filters
    onFrontendFilterChange(""); // Reset frontend filter
  };

  return (
    <div className="p-4 bg-transparent mb-5">
      <Row gutter={16} align="middle" justify="end">
        {/* Name Filter */}
        <Col>
          <label className="font-medium text-gray-700" style={{ paddingRight: "8px" }}>Name</label>
          <Input
            placeholder="Search by Name"
            prefix={<SearchOutlined />}
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            allowClear
            style={{ width: "200px" }}
          />
        </Col>

        {/* Class ID Filter */}
        <Col>
          <label className="font-medium text-gray-700" style={{ paddingRight: "8px" }}>Class</label>
          <Select
            placeholder="Select Class"
            loading={loading}
            value={filters.classId}
            onChange={(value) => handleFilterChange("classId", value)}
            style={{ width: "180px" }}
            optionFilterProp="children"
            showSearch
            allowClear
          >
            <Option value="">Select Class</Option>
            {classes.map((cls) => (
              <Option key={cls._id} value={cls._id}>
                {cls.className}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Type Filter */}
        <Col>
          <label className="font-medium text-gray-700" style={{ paddingRight: "8px" }}>Type</label>
          <Select
            placeholder="All Types"
            value={filters.type}
            onChange={(value) => handleFilterChange("type", value)}
            style={{ width: "180px" }}
            allowClear
          >
            <Option value="">All Types</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="exam">Exam</Option>
            <Option value="event">Event</Option>
            <Option value="others">Others</Option>
          </Select>
        </Col>

        {/* Status Filter */}
        <Col>
          <label className="font-medium text-gray-700" style={{ paddingRight: "8px" }}>Status</label>
          <Select
            placeholder="All Statuses"
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            style={{ width: "180px" }}
            allowClear
          >
            <Option value="">All Statuses</Option>
            <Option value="active">Published</Option>
            <Option value="inactive">Drafts</Option>
          </Select>
        </Col>

        {/* Academic Year Filter
        <Col>
          <label className="font-medium text-gray-700" style={{ paddingRight: "8px" }}>Academic Year</label>
          <Select
            placeholder="Select Academic Year"
            value={filters.academicYear}
            onChange={(value) => handleFilterChange("academicYear", value)}
            style={{ width: "180px" }}
            allowClear
          >
            <Option value="">All Years</Option>
            {academicYears.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </Col> */}

        {/* Action Buttons */}
        <Col>
          <Space size="middle">
            <Button
              type="primary"
              onClick={applyFilters}
              style={{
                borderRadius: "6px",
                background: "linear-gradient(to right, #ec4899, #a855f7)",
                color: "white",
              }}
              className="hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-700"
            >
              Apply Filters
            </Button>

            <Button
              onClick={clearFilters}
              style={{
                borderRadius: "6px",
                color: "#1890ff",
                borderColor: "#1890ff",
              }}
            >
              Clear Filters
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default TopNavigationWithFilters;
