import React from "react";
import { Input, Select, Space, Button, Tag } from "antd";
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
}) => {
  return (
    <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
      <Space size={8} align="center">
        <Search
          placeholder="Search timetables..."
          value={searchTerm}
          onChange={handleSearchChange}
          // If you want an immediate fetch on Enter, add an onSearch:
          onSearch={(value) => {
            // This ensures pressing Enter triggers fetch instantly
            if (!value.trim()) {
              handleClearSearch();
            } else {
              // Or call a function that sets page=1 and fetches
              handleSearchChange({ target: { value } });
            }
          }}
          allowClear
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
          <Option value="active">Published</Option>
          <Option value="inactive">Unpublished</Option>
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

      {/* Display active filters */}
      {filterTags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {filterTags.map((filter) => (
            <Tag
              key={filter.key}
              closable
              onClose={() =>
                handleFilterChange({
                  [filter.key]: Array.isArray(filters[filter.key]) ? [] : null,
                })
              }
            >
              {filter.key}: {filter.display}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};
