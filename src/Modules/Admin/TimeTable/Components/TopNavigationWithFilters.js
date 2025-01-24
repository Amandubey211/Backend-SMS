import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { Input, Select, Button, Row, Col, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const TopNavigationWithFilters = ({ onBackendFilterChange, onFrontendFilterChange, academicYears }) => {
  const { t } = useTranslation("admTimeTable");
  const dispatch = useDispatch();

  // Get role from Redux store
  const role = useSelector((store) => store.common.auth.role);

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
    if (role !== "parent" && role !== "student") {
      dispatch(fetchAllClasses());
    }
  }, [dispatch, role]);
  
  useEffect(() => {
    if (error && role !== "parent" && role !== "student") {
      // Handle the error silently or log it, as toast is removed
      console.error("Failed to load classes:", error);
    }
  }, [error, role]);
  

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
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* Name Filter */}
    <div>
      <label className="font-medium text-gray-700">{t("Name")}</label>
      <Input
        placeholder={t("Search by Name")}
        prefix={<SearchOutlined />}
        value={filters.name}
        onChange={(e) => handleFilterChange("name", e.target.value)}
        allowClear
        className="w-full"
      />
    </div>

    {/* Class ID Filter - Exclude for Parent/Student */}
    {role !== "parent" && role !== "student" && (
      <div>
        <label className="font-medium text-gray-700">{t("Class")}</label>
        <Select
          placeholder={t("Select Class")}
          loading={loading}
          value={filters.classId}
          onChange={(value) => handleFilterChange("classId", value)}
          className="w-full"
          optionFilterProp="children"
          showSearch
          allowClear
        >
          <Option value="">{t("Select Class")}</Option>
          {classes?.map((cls) => (
            <Option key={cls._id} value={cls._id}>
              {cls.className}
            </Option>
          ))}
        </Select>
      </div>
    )}

    {/* Type Filter */}
    <div>
      <label className="font-medium text-gray-700">{t("Type")}</label>
      <Select
        placeholder={t("All Types")}
        value={filters.type}
        onChange={(value) => handleFilterChange("type", value)}
        className="w-full"
        allowClear
      >
        <Option value="">{t("All Types")}</Option>
        <Option value="weekly">{t("Weekly")}</Option>
        <Option value="exam">{t("Exam")}</Option>
        <Option value="event">{t("Event")}</Option>
        <Option value="others">{t("Others")}</Option>
      </Select>
    </div>

    {/* Status Filter - Exclude for Parent/Student */}
    {role !== "parent" && role !== "student" && (
      <div>
        <label className="font-medium text-gray-700">{t("Status")}</label>
        <Select
          placeholder={t("All Statuses")}
          value={filters.status}
          onChange={(value) => handleFilterChange("status", value)}
          className="w-full"
          allowClear
        >
          <Option value="">{t("All Statuses")}</Option>
          <Option value="active">{t("Published")}</Option>
          <Option value="inactive">{t("Drafts")}</Option>
        </Select>
      </div>
    )}

    {/* Action Buttons */}
    <div className="flex items-end justify-end md:justify-start md:flex-row flex-col gap-4">
      <Button
        type="primary"
        onClick={applyFilters}
        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-md px-4 py-2"
      >
        {t("Apply Filters")}
      </Button>

      <Button
        onClick={clearFilters}
        className="text-blue-500 border border-blue-500 rounded-md px-4 py-2"
      >
        {t("Clear Filters")}
      </Button>
    </div>
  </div>
</div>
  );
};

export default TopNavigationWithFilters;
