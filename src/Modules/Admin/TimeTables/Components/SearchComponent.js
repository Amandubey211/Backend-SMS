// src/Modules/Admin/TimeTables/Components/SearchComponent.js
import React from "react";
import { Input, Select, Space, Button } from "antd";
import {
  FilterOutlined,
  CalendarOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { AiOutlineFilter } from "react-icons/ai";

const { Search } = Input;

const { Option } = Select;

export const SearchComponent = ({
  searchTerm,
  handleSearchChange,
  handleClearSearch,
  filters,
  handleFilterChange,
  setShowFilterDrawer,
  filterTags,
  clearAllFilters,
  fetchTimetables,
}) => {
  return (
    <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
      <Space size={8} align="center">
        <Search
          placeholder="Search timetables..."
          value={searchTerm}
          onChange={handleSearchChange}
          allowClear
          onClear={handleClearSearch}
          onSearch={() => fetchTimetables()}
          enterButton
          style={{ width: 250 }}
        />

        <Select
          style={{ width: 120 }}
          allowClear
          placeholder={
            <span>
              <FilterOutlined style={{ marginRight: 8 }} />
              Status
            </span>
          }
          value={filters.status}
          onChange={(value) => handleFilterChange({ status: value })}
          dropdownMatchSelectWidth={false}
        >
          <Option value="active">Publish</Option>
          <Option value="inactive">Unpublish</Option>
        </Select>

        <Select
          style={{ width: 120 }}
          allowClear
          placeholder={
            <span>
              <CalendarOutlined style={{ marginRight: 8 }} />
              Type
            </span>
          }
          value={filters.type}
          onChange={(value) => handleFilterChange({ type: value })}
          dropdownMatchSelectWidth={false}
        >
          <Option value="weekly">Weekly</Option>
          <Option value="exam">Exam</Option>
          <Option value="event">Event</Option>
          <Option value="others">Others</Option>
        </Select>

        <Button
          icon={<AiOutlineFilter />}
          onClick={() => setShowFilterDrawer(true)}
        >
          Advanced
          {filterTags.length > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-sm font-bold text-white bg-blue-500 rounded-full">
              {filterTags.length}
            </span>
          )}
        </Button>

        {(filterTags.length > 0 || searchTerm) && (
          <Button danger icon={<CloseOutlined />} onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </Space>
    </div>
  );
};
