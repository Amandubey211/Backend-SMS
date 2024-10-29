import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { Input, Select, Button, Space } from "antd";
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
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Space size="large" className="flex items-center justify-between w-full">
        {/* Name Filter */}
        <Input
          placeholder="Search by Name"
          prefix={<SearchOutlined />}
          value={filters.name}
          onChange={(e) => handleFilterChange("name", e.target.value)}
          style={{ width: "30%", borderRadius: "8px" }}
          allowClear
        />

        {/* Class ID Filter */}
        <Select
          placeholder="Select Class"
          loading={loading}
          value={filters.classId}
          onChange={(value) => handleFilterChange("classId", value)}
          style={{ width: "30%", borderRadius: "8px" }}
          optionFilterProp="children"
          showSearch
        >
          {classes.map((cls) => (
            <Option key={cls._id} value={cls._id}>
              {cls.className}
            </Option>
          ))}
        </Select>

        {/* Type Filter */}
        <Select
          placeholder="Select Type"
          value={filters.type}
          onChange={(value) => handleFilterChange("type", value)}
          style={{ width: "30%", borderRadius: "8px" }}
        >
          <Option value="">All Types</Option>
          <Option value="weekly">Weekly</Option>
          <Option value="exam">Exam</Option>
          <Option value="event">Event</Option>
          <Option value="others">Others</Option>
        </Select>

        {/* Apply Filters Button */}
        <Button
          type="primary"
          onClick={applyFilters}
          style={{ borderRadius: "8px", height: "40px" }}
          className="flex items-center justify-center"
        >
          Apply Filters
        </Button>
      </Space>
    </div>
  );
};

export default TopNavigationWithFilters;
