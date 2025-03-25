import React, { useState } from "react";
import { Drawer, Form, Select, Button } from "antd";

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

  // Reset form when drawer is opened
  React.useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue(filters);
      setSelectedClass(filters.class);
    }
  }, [visible, filters, form]);

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
      onFilterChange("class", values.class || null);
      onFilterChange("sections", values.sections || []);
      onFilterChange("groups", values.groups || []);
      onFilterChange("subject", values.subject || null);
      onFilterChange("semester", values.semester || null);
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
            {classList.map((cls) => (
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
          >
            {sectionList.map((section) => (
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
          >
            {allSubjects.map((subject) => (
              <Option key={subject._id} value={subject._id}>
                {subject.name}
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
          >
            {reduxSemesters.map((semester) => (
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
