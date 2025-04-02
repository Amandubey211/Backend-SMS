import React, { useEffect, useState, useRef } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Button,
  Card,
  Divider,
  Modal,
  notification,
  ConfigProvider,
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import DaySlotFields from "./DaySlotFields";
import moment from "moment";
import {
  fetchGroupsByClass,
  fetchGroupsByClassAndSection,
  fetchSectionsNamesByClass,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchSubjects } from "../../../../Store/Slices/Admin/Class/Subject/subjectThunks";
import { fetchSemestersByClass } from "../../../../Store/Slices/Admin/Class/Semester/semesterThunks";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

export default function TimeTableForm({ editingTimetable, onSubmit, onClose }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [timetableType, setTimetableType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const formRef = useRef(null);

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
  const { loadingCreate, loadingUpdate } = useSelector(
    (state) => state.admin.timetable
  );

  useEffect(() => {
    if (editingTimetable) {
      const { validity, days, classId, sectionId, groupId, semesterId } =
        editingTimetable;

      const convertedValidity =
        validity?.startDate && validity?.endDate
          ? [moment(validity.startDate), moment(validity.endDate)]
          : [];

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
            if (newSlot.subjectId && typeof newSlot.subjectId === "object") {
              newSlot.subjectId = newSlot.subjectId._id;
            }
            return newSlot;
          });
        }
        return newDay;
      });

      form.setFieldsValue({
        name: editingTimetable.name,
        type: editingTimetable.type,
        validity: convertedValidity,
        classId: classId?._id || undefined,
        sectionId: sectionId?.map((section) => section?._id) || [],
        groupId: groupId?.map((group) => group?._id) || [],
        semesterId: semesterId?._id || undefined,
        days: convertedDays,
      });

      if (classId?._id) {
        dispatch(fetchSectionsNamesByClass(classId._id));
        dispatch(fetchGroupsByClass(classId._id));
        dispatch(fetchSubjects(classId._id));
        dispatch(fetchSemestersByClass(classId._id));
      }

      setTimetableType(editingTimetable.type);
    } else {
      form.resetFields();
      setTimetableType(null);
    }
  }, [editingTimetable, form, dispatch]);

  const handleFieldsChange = () => {
    setHasUnsavedChanges(true);
  };

  const isEdit = !!editingTimetable;

  const handleClassChange = (classId) => {
    form.setFieldsValue({ sectionId: [], groupId: [], semesterId: undefined });
    if (classId) {
      dispatch(fetchSectionsNamesByClass(classId));
      dispatch(fetchGroupsByClass(classId));
      dispatch(fetchSubjects(classId));
      dispatch(fetchSemestersByClass(classId));
    }
  };

  const handleSectionChange = (sectionIds) => {
    const classId = form.getFieldValue("classId");
    form.setFieldsValue({ groupId: [] });
    if (classId && sectionIds.length > 0) {
      dispatch(fetchGroupsByClassAndSection({ classId, sectionIds }));
    }
  };

  const scrollToField = (fieldName) => {
    const element = document.querySelector(`[name="${fieldName}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus({ preventScroll: true });
    }
  };

  const handleSubmit = async (publish = false) => {
    try {
      await form.validateFields();

      const values = form.getFieldsValue();
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
        status: publish ? "active" : "inactive",
      };

      if (publish) {
        setPublishLoading(true);
      } else {
        setLoading(true);
      }

      await onSubmit(timetableData, isEdit);
      setHasUnsavedChanges(false);

      notification.success({
        message: isEdit
          ? "Timetable updated successfully"
          : "Timetable created successfully",
        description: publish
          ? "Your timetable has been published"
          : "Your timetable has been saved as draft",
      });
    } catch (error) {
      if (error.errorFields && error.errorFields.length > 0) {
        const firstErrorField = error.errorFields[0].name[0];
        scrollToField(firstErrorField);
      }
    } finally {
      setLoading(false);
      setPublishLoading(false);
    }
  };

  const showConfirmOnClose = () => {
    if (!hasUnsavedChanges) {
      onClose();
      return;
    }

    confirm({
      title: "You have unsaved changes",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to leave without saving?",
      okText: "Leave",
      cancelText: "Stay",
      onOk() {
        onClose();
      },
    });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          colorBgContainer: "#ffffff",
          colorText: "#333",
          colorBorder: "#d9d9d9",
          borderRadius: 4,
        },
      }}
    >
      <Card
        title={
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Timetable" : "Create New Timetable"}
          </h2>
        }
        bordered={false}
        className="shadow-sm"
      >
        <Form
          layout="vertical"
          form={form}
          requiredMark={false}
          ref={formRef}
          onFieldsChange={handleFieldsChange}
        >
          {/* Basic Information Section */}
          <Divider orientation="left" orientationMargin={0}>
            <span className="text-gray-600 font-medium">Basic Information</span>
          </Divider>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Timetable Name"
                name="name"
                rules={[
                  { required: true, message: "Timetable name is required" },
                ]}
              >
                <Input placeholder="e.g. Midterm Exam Schedule" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Type"
                name="type"
                rules={[
                  { required: true, message: "Timetable type is required" },
                ]}
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
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Validity Period"
                name="validity"
                rules={[
                  { required: true, message: "Please select a date range" },
                ]}
              >
                <RangePicker size="large" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Class & Section Section */}
          <Divider orientation="left" orientationMargin={0}>
            <span className="text-gray-600 font-medium">Class & Section</span>
          </Divider>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Class"
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
            <Col xs={24} md={12}>
              <Form.Item label="Section" name="sectionId">
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

          {/* Group & Semester Section */}
          <Divider orientation="left" orientationMargin={0}>
            <span className="text-gray-600 font-medium">Group & Semester</span>
          </Divider>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Group" name="groupId">
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
            <Col xs={24} md={12}>
              <Form.Item label="Semester" name="semesterId">
                <Select
                  size="large"
                  placeholder="Select Semester"
                  allowClear
                  disabled={!form.getFieldValue("classId")}
                >
                  {reduxSemesters?.map((sem) => (
                    <Option key={sem._id} value={sem._id}>
                      {sem.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Schedule Section */}
          <Divider orientation="left" orientationMargin={0}>
            <span className="text-gray-600 font-medium">Schedule</span>
          </Divider>

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

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 mt-8">
            <Button
              onClick={showConfirmOnClose}
              size="large"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                type="default"
                size="large"
                loading={loading || loadingCreate || loadingUpdate}
                onClick={() => handleSubmit(false)}
                className="w-full sm:w-auto"
                disabled={loadingCreate || loadingUpdate}
              >
                Save as Draft
              </Button>
              <Button
                type="primary"
                size="large"
                loading={publishLoading || loadingCreate || loadingUpdate}
                onClick={() => handleSubmit(true)}
                className="w-full sm:w-auto"
                disabled={loadingCreate || loadingUpdate}
              >
                Save & Publish
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    </ConfigProvider>
  );
}
