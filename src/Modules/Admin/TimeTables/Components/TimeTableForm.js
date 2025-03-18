import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Button,
  Switch,
  Tooltip,
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import DaySlotFields from "./DaySlotFields";
import dayjs from "dayjs";
import moment from "moment"; // <-- Import moment for RangePicker compatibility
import {
  fetchGroupsByClass,
  fetchGroupsByClassAndSection,
  fetchSectionsNamesByClass,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchSubjects } from "../../../../Store/Slices/Admin/Class/Subject/subjectThunks";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function TimeTableForm({ editingTimetable, onSubmit, onClose }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [timetableType, setTimetableType] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  // Data from Redux
  const classList = useSelector((state) => state.admin.class.classes);
  const sectionList = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const groupsList = useSelector(
    (state) => state.admin.group_section.groupsList
  );
  const allSubjects = useSelector((state) => state.admin.subject.subjects);
  const { semesters: reduxSemesters } = useSelector(
    (state) => state.admin.semesters
  );

  useEffect(() => {
    if (editingTimetable) {
      const {
        validity,
        days,
        classId,
        sectionId,
        groupId,
        semesterId,
        status,
      } = editingTimetable;

      // Convert validity dates using moment
      const convertedValidity =
        validity?.startDate && validity?.endDate
          ? [moment(validity.startDate), moment(validity.endDate)]
          : [];

      // Convert any date fields in the days array and their slots
      const convertedDays = (days || []).map((dayItem) => {
        const newDay = { ...dayItem };
        if (newDay.date) {
          newDay.date = moment(newDay.date);
        }
        if (newDay.slots && Array.isArray(newDay.slots)) {
          newDay.slots = newDay.slots.map((slot) => {
            const newSlot = { ...slot };
            if (newSlot.startTime) {
              newSlot.startTime = moment(newSlot.startTime);
            }
            if (newSlot.endTime) {
              newSlot.endTime = moment(newSlot.endTime);
            }
            // Preload subject by extracting _id from the subjectId object if available
            if (newSlot.subjectId && typeof newSlot.subjectId === "object") {
              newSlot.subjectId = newSlot.subjectId._id;
            }
            return newSlot;
          });
        }
        return newDay;
      });

      // Preload select fields by extracting _id from nested objects if available
      form.setFieldsValue({
        name: editingTimetable.name,
        type: editingTimetable.type,
        validity: convertedValidity,
        classId: classId?._id || undefined, // Preload classId as _id
        sectionId: sectionId?.map((section) => section?._id) || [], // Preload sectionIds
        groupId: groupId?.map((group) => group?._id) || [], // Preload groupIds
        semesterId: semesterId?._id || undefined, // Preload semesterId as _id
        days: convertedDays,
        status: status === "active", // Preload the status correctly (true for active, false for inactive)
      });

      // Fetch sections, groups, and semester if classId exists
      if (classId?._id) {
        // Fetch sections, groups, and subjects based on the classId
        dispatch(fetchSectionsNamesByClass(classId._id));
        dispatch(fetchGroupsByClass(classId._id));
        dispatch(fetchSubjects(classId._id));
      }

      setTimetableType(editingTimetable.type);
    } else {
      form.resetFields();
      setTimetableType(null);
    }
  }, [editingTimetable, form, dispatch]);

  const isEdit = !!editingTimetable;

  // CLASS change handler
  const handleClassChange = (classId) => {
    form.setFieldsValue({ sectionId: [], groupId: [] });
    if (classId) {
      dispatch(fetchSectionsNamesByClass(classId));
      dispatch(fetchGroupsByClass(classId));
      dispatch(fetchSubjects(classId));
    }
  };

  // SECTION change handler
  const handleSectionChange = (sectionIds) => {
    const classId = form.getFieldValue("classId");
    form.setFieldsValue({ groupId: [] });
    if (classId && sectionIds.length > 0) {
      dispatch(fetchGroupsByClassAndSection({ classId, sectionIds }));
    }
  };

  const handleFinish = (values) => {
    const [startMoment, endMoment] = values.validity || [];
    const timetableData = {
      name: values.name,
      type: values.type,
      validity: {
        startDate: startMoment ? startMoment.toISOString() : null,
        endDate: endMoment ? endMoment.toISOString() : null,
      },
      classId: values.classId,
      sectionId: values.sectionId || [],
      groupId: values.groupId || [],
      semesterId: values.semesterId || null,
      days: values.days || [],
      status: values.status ? "active" : "inactive", // Pass the status value
    };
    setLoading(true);
    Promise.resolve(onSubmit(timetableData, isEdit)).finally(() =>
      setLoading(false)
    );
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      requiredMark={false}
    >
      {/* Timetable Name and Status toggle switch in one row */}
      <Row gutter={16} align="middle">
        <Col span={21}>
          <Form.Item
            label={
              <span>
                <BookOutlined /> Timetable Name
              </span>
            }
            name="name"
            rules={[{ required: true, message: "Timetable name is required" }]}
          >
            <Input placeholder="e.g. Midterm Exam Schedule" size="large" />
          </Form.Item>
        </Col>

        {/* Status toggle next to Timetable Name */}
        <Col span={3}>
          <Form.Item
            label={
              <Tooltip title="Toggle between Active and Inactive status">
                Status
              </Tooltip>
            }
            name="status"
            valuePropName="checked"
            initialValue={false} // default value (inactive)
          >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              size="default"
              onChange={(checked) => form.setFieldsValue({ status: checked })}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        {/* Type */}
        <Col span={12}>
          <Form.Item
            label={
              <span>
                <BookOutlined /> Type
              </span>
            }
            name="type"
            rules={[{ required: true, message: "Timetable type is required" }]}
          >
            <Select
              size="large"
              placeholder="Select Type"
              onChange={(val) => setTimetableType(val)}
            >
              <Option value="weekly">Weekly</Option>
              <Option value="exam">Exam</Option>
              <Option value="event">Event</Option>
              <Option value="others">Others</Option>
            </Select>
          </Form.Item>
        </Col>

        {/* Validity Period */}
        <Col span={12}>
          <Form.Item
            label={
              <span>
                <CalendarOutlined /> Validity Period
              </span>
            }
            name="validity"
            rules={[{ required: true, message: "Please select a date range" }]}
          >
            <RangePicker size="large" />
          </Form.Item>
        </Col>
      </Row>
      {/* Class - Section */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                <TeamOutlined /> Class
              </span>
            }
            name="classId"
            rules={[{ required: true, message: "Class is required" }]}
          >
            <Select
              size="large"
              placeholder="Select Class"
              allowClear
              onChange={handleClassChange}
            >
              {classList?.map((cls) => (
                <Option key={cls._id} value={cls._id}>
                  {cls.className || cls.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                <UsergroupAddOutlined /> Section
              </span>
            }
            name="sectionId"
          >
            <Select
              mode="multiple"
              size="large"
              placeholder="Select Sections"
              allowClear
              onChange={handleSectionChange}
            >
              {sectionList?.map((sec) => (
                <Option key={sec._id} value={sec._id}>
                  {sec.sectionName || sec.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {/* Group - Semester */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                <TeamOutlined /> Group
              </span>
            }
            name="groupId"
          >
            <Select
              mode="multiple"
              size="large"
              placeholder="Select Groups"
              allowClear
            >
              {groupsList?.map((grp) => (
                <Option key={grp._id} value={grp._id}>
                  {grp.groupName || grp.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                <ClockCircleOutlined /> Semester
              </span>
            }
            name="semesterId"
          >
            <Select size="large" placeholder="Select Semester" allowClear>
              {reduxSemesters?.map((sem) => (
                <Option key={sem._id} value={sem._id}>
                  {sem.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {/* Days + Slots sub-component wrapped with validation */}
      <Form.Item
        name="days"
        rules={[
          {
            validator: (_, value) => {
              if (
                Array.isArray(value) &&
                value.some((day) => day.slots && day.slots.length > 0)
              ) {
                return Promise.resolve();
              }
              return Promise.reject("At least one time slot is required.");
            },
          },
        ]}
      >
        <DaySlotFields
          form={form}
          timetableType={timetableType}
          allSubjects={allSubjects}
        />
      </Form.Item>
      {/* Form Footer with Cancel and Submit Buttons */}
      <div className="flex justify-between mt-6">
        <Button onClick={onClose} size="large" className="px-3 py-2">
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          disabled={loading}
          loading={loading}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold border-none hover:opacity-90 px-4 py-2"
        >
          {isEdit ? "Update Timetable" : "Create Timetable"}
        </Button>
      </div>
    </Form>
  );
}
