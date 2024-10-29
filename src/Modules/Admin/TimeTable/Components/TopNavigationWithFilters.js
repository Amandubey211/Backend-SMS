import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { Input, Select, Button, Row, Col } from "antd";
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
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Row gutter={16} align="middle" justify="center">
        {/* Name Filter */}
        <Col span={6}>
          <label className="font-medium text-gray-700">Name</label>
          <Input
            placeholder="Search by Name"
            prefix={<SearchOutlined />}
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            allowClear
            style={{ borderRadius: "6px", marginTop: "4px" }}
          />
        </Col>

        {/* Class ID Filter */}
        <Col span={6}>
          <label className="font-medium text-gray-700">Class</label>
          <Select
            placeholder="Select Class"
            loading={loading}
            value={filters.classId}
            onChange={(value) => handleFilterChange("classId", value)}
            style={{ width: "100%", borderRadius: "6px", marginTop: "4px" }}
            optionFilterProp="children"
            showSearch
          >
            {classes.map((cls) => (
              <Option key={cls._id} value={cls._id}>
                {cls.className}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Type Filter */}
        <Col span={6}>
          <label className="font-medium text-gray-700">Type</label>
          <Select
            placeholder="Select Type"
            value={filters.type}
            onChange={(value) => handleFilterChange("type", value)}
            style={{ width: "100%", borderRadius: "6px", marginTop: "4px" }}
          >
            <Option value="">All Types</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="exam">Exam</Option>
            <Option value="event">Event</Option>
            <Option value="others">Others</Option>
          </Select>
        </Col>

        {/* Apply Filters Button */}
        <Col span={4}>
          <Button
            type="primary"
            onClick={applyFilters}
            style={{ width: "100%", borderRadius: "6px", marginTop: "24px" }}
          >
            Apply Filters
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default TopNavigationWithFilters;
