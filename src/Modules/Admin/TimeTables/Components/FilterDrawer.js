import React, { useState, useEffect, useCallback } from "react";
import { Drawer, Form, Select, Button, message } from "antd";
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
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Reset form when drawer is opened
  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue(filters);
      setSelectedClass(filters.class);
    }
  }, [visible, form, filters]);

  // Fetch dependent data when class changes
  const fetchDependentData = useCallback(async () => {
    if (!selectedClass) {
      form.setFieldsValue({
        sections: [],
        groups: [],
        subject: null,
        semester: null,
      });
      return;
    }

    setLoading(true);
    try {
      await Promise.all([
        dispatch(fetchSectionsNamesByClass(selectedClass)),
        dispatch(fetchGroupsByClass(selectedClass)),
        dispatch(fetchSubjects(selectedClass)),
        dispatch(fetchSemestersByClass(selectedClass)),
      ]);
    } catch (error) {
      message.error("Failed to load dependent data");
      console.error("Error fetching dependent data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedClass, dispatch, form]);

  useEffect(() => {
    if (visible && selectedClass) {
      fetchDependentData();
    }
  }, [selectedClass, visible, fetchDependentData]);

  const handleClassChange = (value) => {
    setSelectedClass(value);
    form.setFieldsValue({
      sections: [],
      groups: [],
      subject: null,
      semester: null,
    });
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newFilters = {
        class: values.class || null,
        sections: values.sections || [],
        groups: values.groups || [],
        subject: values.subject || null,
        semester: values.semester || null,
        status: values.status || null,
        type: values.type || null,
      };
      onFilterChange(newFilters);
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
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Apply Filters
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Status" name="status">
          <Select
            placeholder="Select Status"
            allowClear
            size="large"
            disabled={loading}
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Type" name="type">
          <Select
            placeholder="Select Type"
            allowClear
            size="large"
            disabled={loading}
          >
            <Option value="weekly">Weekly</Option>
            <Option value="exam">Exam</Option>
            <Option value="event">Event</Option>
            <Option value="others">Others</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Class" name="class">
          <Select
            placeholder="Select Class"
            allowClear
            size="large"
            onChange={handleClassChange}
            disabled={loading}
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
            disabled={!selectedClass || loading}
            loading={loading && !sectionList.length}
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
            disabled={!selectedClass || loading}
            loading={loading && !groupsList.length}
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
            disabled={!selectedClass || loading}
            loading={loading && !allSubjects.length}
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
            disabled={!selectedClass || loading}
            size="large"
            loading={loading && !reduxSemesters.length}
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
