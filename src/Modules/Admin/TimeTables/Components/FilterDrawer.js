import React, { useState, useEffect } from "react";
import { Drawer, Form, Select, Button } from "antd";
import { useDispatch } from "react-redux";
import {
  fetchGroupsByClass,
  fetchSectionsNamesByClass,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchSubjects } from "../../../../Store/Slices/Admin/Class/Subject/subjectThunks";
import { fetchSemestersByClass } from "../../../../Store/Slices/Admin/Class/Semester/semesterThunks";

const { Option } = Select;

export default function FilterDrawer({
  visible,
  filters,
  onFilterChange,
  onClearFilters,
  onClose,
  classList,
  sectionList,
  groupsList,
  allSubjects,
  reduxSemesters,
}) {
  const [form] = Form.useForm();
  const [selectedClass, setSelectedClass] = useState(null);
  const dispatch = useDispatch();

  // Reset form when drawer is opened or filters change
  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue(filters);
      setSelectedClass(filters.class);
    }
  }, [visible, filters, form]);

  // Fetch dependent data when class changes
  useEffect(() => {
    if (selectedClass) {
      // Fetch all dependent data in parallel
      Promise.all([
        dispatch(fetchSectionsNamesByClass(selectedClass)),
        dispatch(fetchGroupsByClass(selectedClass)),
        dispatch(fetchSubjects(selectedClass)),
        dispatch(fetchSemestersByClass(selectedClass)),
      ]);
    } else {
      // Clear dependent data when no class is selected
      form.setFieldsValue({
        sections: [],
        groups: [],
        subject: null,
        semester: null,
      });
    }
  }, [selectedClass, dispatch, form]);

  const handleClassChange = (value) => {
    setSelectedClass(value);
    // Reset dependent fields immediately
    form.setFieldsValue({
      sections: [],
      groups: [],
      subject: null,
      semester: null,
    });
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // Update all filters at once to prevent multiple re-renders
      const newFilters = {
        class: values.class || null,
        sections: values.sections || [],
        groups: values.groups || [],
        subject: values.subject || null,
        semester: values.semester || null,
      };

      // Call onFilterChange for each filter
      Object.entries(newFilters).forEach(([key, value]) => {
        onFilterChange(key, value);
      });

      onClose();
    });
  };

  return (
    <Drawer
      title="Filter Timetables"
      placement="right"
      width={500}
      open={visible}
      onClose={onClose}
      footer={
        <div className="flex justify-between">
          <Button onClick={onClearFilters}>Clear All</Button>
          <Button type="primary" onClick={handleSubmit}>
            Apply Filters
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Class" name="class">
          <Select
            placeholder="Select Class"
            allowClear
            size="large"
            onChange={handleClassChange}
          >
            {classList?.map((cls) => (
              <Option key={cls._id} value={cls._id}>
                {cls.className}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Sections" name="sections">
          <Select
            mode="multiple"
            placeholder="Select Sections"
            allowClear
            size="large"
            disabled={!selectedClass}
            loading={!sectionList.length && !!selectedClass}
          >
            {sectionList?.map((section) => (
              <Option key={section._id} value={section._id}>
                {section.sectionName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Groups" name="groups">
          <Select
            mode="multiple"
            size="large"
            placeholder="Select Groups"
            allowClear
            disabled={!selectedClass}
            loading={!groupsList.length && !!selectedClass}
          >
            {groupsList.map((group) => (
              <Option key={group._id} value={group._id}>
                {group.groupName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Subject" name="subject">
          <Select
            placeholder="Select Subject"
            allowClear
            size="large"
            disabled={!selectedClass}
            loading={!allSubjects.length && !!selectedClass}
          >
            {allSubjects?.map((subject) => (
              <Option key={subject.subjectId} value={subject.subjectId}>
                {subject.subjectName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Semester" name="semester">
          <Select
            placeholder="Select Semester"
            allowClear
            disabled={!selectedClass}
            size="large"
            loading={!reduxSemesters.length && !!selectedClass}
          >
            {reduxSemesters?.map((semester) => (
              <Option key={semester._id} value={semester._id}>
                {semester.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
