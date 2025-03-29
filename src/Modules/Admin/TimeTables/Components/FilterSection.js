import React from "react";
import { Select, Button } from "antd";

export default function FilterSection({
  filters,
  classList,
  sectionList,
  groupsList,
  allSubjects,
  reduxSemesters,
  handleFilterChange,
  clearAllFilters,
}) {
  return (
    <>
      <Select
        placeholder="Select Class"
        style={{ width: 120 }}
        value={filters.class}
        onChange={(value) => handleFilterChange("class", value)}
        options={classList.map((c) => ({
          value: c._id,
          label: c.className,
        }))}
        allowClear
      />

      <Select
        placeholder="Select Section"
        style={{ width: 120 }}
        value={filters.section}
        onChange={(value) => handleFilterChange("section", value)}
        options={sectionList.map((s) => ({
          value: s._id,
          label: s.sectionName,
        }))}
        disabled={!filters.class}
        allowClear
      />

      <Select
        placeholder="Select Group"
        style={{ width: 120 }}
        value={filters.group}
        onChange={(value) => handleFilterChange("group", value)}
        options={groupsList.map((g) => ({
          value: g._id,
          label: g.groupName,
        }))}
        disabled={!filters.class}
        allowClear
      />

      <Select
        placeholder="Select Subject"
        style={{ width: 150 }}
        mode="multiple"
        value={filters.subject}
        onChange={(value) => handleFilterChange("subject", value)}
        options={allSubjects.map((s) => ({
          value: s._id,
          label: s.subjectName,
        }))}
        disabled={!filters.class}
        allowClear
      />

      <Select
        placeholder="Select Semester"
        style={{ width: 120 }}
        value={filters.semester}
        onChange={(value) => handleFilterChange("semester", value)}
        options={reduxSemesters.map((s) => ({
          value: s._id,
          label: s.title,
        }))}
        allowClear
      />

      <Button
        type="text"
        danger
        onClick={clearAllFilters}
        disabled={
          !filters.class &&
          !filters.section &&
          !filters.group &&
          !filters.subject &&
          !filters.semester
        }
      >
        Clear Filters
      </Button>
    </>
  );
}
