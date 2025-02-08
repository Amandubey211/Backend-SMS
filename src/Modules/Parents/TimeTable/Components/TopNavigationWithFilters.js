import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { Input, Select, Button, Row, Col, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const TopNavigationWithFilters = ({
  onBackendFilterChange,
  onFrontendFilterChange,
  academicYears,
}) => {
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
      // Trigger backend filter change immediately
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
    const cleared = {
      name: "",
      classId: "",
      type: "",
      status: "",
      academicYear: "",
    };
    setFilters(cleared);
    onBackendFilterChange({}); // Load data without filters
    onFrontendFilterChange(""); // Reset frontend filter
  };

  return (
    <div className="p-4 bg-transparent mb-5">
      <Row gutter={16} align="middle" justify="start">
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

        {/* Class ID Filter - Exclude for Parent/Student */}
        {role !== "parent" && role !== "student" && (
          <Col>
            <label
              className="font-medium text-gray-700"
              style={{ paddingRight: "8px" }}
            >
              {t("Class")}
            </label>
            <Select
              placeholder={t("Select Class")}
              loading={loading}
              value={filters.classId}
              onChange={(value) => handleFilterChange("classId", value)}
              style={{ width: "180px" }}
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
          </Col>
        )}

        {/* Type Filter */}
        <Col>
          <label
            className="font-medium text-gray-700"
            style={{ paddingRight: "8px" }}
          >
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
        </Col>

        {/* Status Filter - Exclude for Parent/Student */}
        {role !== "parent" && role !== "student" && (
          <Col>
            <label
              className="font-medium text-gray-700"
              style={{ paddingRight: "8px" }}
            >
              {t("Status")}
            </label>
            <Select
              placeholder={t("All Statuses")}
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              style={{ width: "180px" }}
              allowClear
            >
              <Option value="">{t("All Statuses")}</Option>
              <Option value="active">{t("Published")}</Option>
              <Option value="inactive">{t("Drafts")}</Option>
            </Select>
          </Col>
        )}

        {/* Academic Year Filter */}
        {/* <Col>
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
            style={{ width: "180px" }}
            allowClear
          >
            <Option value="">{t("Select Academic Year")}</Option>
            {academicYears?.map((year, index) => (
              <Option key={index} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </Col> */}

        {/* Action Buttons */}
        <Col>
          <Space size="middle">
            {/* <Button
              type="primary"
              onClick={applyFilters}
              style={{
                borderRadius: "6px",
                background: "linear-gradient(to right, #ec4899, #a855f7)",
                color: "white",
              }}
              className="hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-700"
            >
              {t("Apply Filters")}
            </Button> */}

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
