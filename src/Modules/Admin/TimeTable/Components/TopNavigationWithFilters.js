import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { Input, Select, Button, Row, Col, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

const { Option } = Select;

const TopNavigationWithFilters = ({ onFilterChange }) => {
  const dispatch = useDispatch();

  // Local filter state
  const [filters, setFilters] = useState({
    name: "",
    classId: "",
    type: "",
  });

  // Fetch classes from Redux store
  const { classes, loading, error } = useSelector((state) => state.admin.class);

  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error("Failed to load classes. Please try again.");
  }, [error]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));

    // Make real-time request for classId and type filters
    if (filterName === "classId" || filterName === "type") {
      onFilterChange({ ...filters, [filterName]: value });
    }
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      classId: "",
      type: "",
    });
    onFilterChange({}); // Trigger API request to load data without filters
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
          >
            <Option value="">All Types</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="exam">Exam</Option>
            <Option value="event">Event</Option>
            <Option value="others">Others</Option>
          </Select>
        </Col>

        {/* Action Buttons */}
        <Col>
          <Space size="middle">
            <Button
              type="primary"
              onClick={applyFilters}
              style={{ borderRadius: "6px" }}
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
