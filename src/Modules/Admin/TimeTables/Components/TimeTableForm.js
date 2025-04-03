import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
  Switch,
  Collapse,
  Tag,
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
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

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;
const { Panel } = Collapse;

// Constants for timetable types
const TIMETABLE_TYPES = [
  { value: "weekly", label: "Weekly", icon: <CalendarOutlined /> },
  { value: "exam", label: "Exam", icon: <BookOutlined /> },
  { value: "event", label: "Event", icon: <TeamOutlined /> },
  { value: "others", label: "Others", icon: <UsergroupAddOutlined /> },
];

// Preview Component - Extracted for better organization
const TimetablePreviewModal = ({
  visible,
  onCancel,
  timetableData,
  allSubjects,
}) => {
  if (!timetableData) return null;

  const {
    name,
    type,
    validity,
    classId,
    sectionId = [],
    groupId = [],
    semesterId,
    days = [],
    showCalendar,
  } = timetableData;

  const getColorByType = (type) => {
    switch (type) {
      case "weekly":
        return "#FF99CC";
      case "exam":
        return "#29ABE2";
      case "event":
        return "#77DD77";
      case "others":
        return "#FFD700";
      default:
        return "#D3D3D3";
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "weekly":
        return <CalendarOutlined />;
      case "exam":
        return <BookOutlined />;
      case "event":
        return <TeamOutlined />;
      default:
        return null;
    }
  };

  const getSubjectName = (subjectId) => {
    if (!subjectId) return "No Subject";
    const subject = allSubjects?.find((sub) => sub._id === subjectId);
    return subject ? subject.subjectName : "No Subject";
  };

  // Format day header based on timetable type
  const formatDayHeader = (day) => {
    if (type === "weekly") {
      return day.day || "Weekly";
    }
    return day.date ? moment(day.date).format("dddd, MMMM Do YYYY") : "No Date";
  };

  return (
    <Modal
      title="Timetable Preview"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
    >
      <div className="space-y-4">
        {/* Header Section */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-xl mb-1">
                {name || "Untitled Timetable"}
              </h4>
              <div className="text-sm text-gray-600 mb-2">
                {validity?.startDate && (
                  <>
                    <span className="font-medium">From: </span>
                    {moment(validity.startDate).format("DD MMM YYYY")}
                    {" to "}
                    <span className="font-medium">To: </span>
                    {validity.endDate
                      ? moment(validity.endDate).format("DD MMM YYYY")
                      : "No End Date"}
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Tag color={getColorByType(type)}>
                  {getIconForType(type)} {type}
                </Tag>
                {showCalendar && <Tag color="green">Visible on Calendar</Tag>}
                {!showCalendar && <Tag color="orange">Hidden on Calendar</Tag>}
              </div>
            </div>
          </div>
        </Card>

        {/* Class Info Section */}
        <Card>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <div className="text-gray-600 text-sm">Class:</div>
              <div className="mt-1">
                {classId ? (
                  <Tag color="blue">{classId.className || "No Class Name"}</Tag>
                ) : (
                  <Tag color="blue">No Class</Tag>
                )}
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-gray-600 text-sm">Sections:</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {sectionId && sectionId.length > 0 ? (
                  sectionId.map((section) => (
                    <Tag key={section._id} color="purple">
                      {section.sectionName || "No Section Name"}
                    </Tag>
                  ))
                ) : (
                  <Tag color="purple">All Sections</Tag>
                )}
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-gray-600 text-sm">Groups:</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {groupId && groupId.length > 0 ? (
                  groupId.map((group) => (
                    <Tag key={group._id} color="cyan">
                      {group.groupName || "No Group Name"}
                    </Tag>
                  ))
                ) : (
                  <Tag color="cyan">All Groups</Tag>
                )}
              </div>
            </Col>
          </Row>
        </Card>

        {/* Schedule Section */}
        <Card>
          <h4 className="font-medium mb-4">Schedule Details</h4>
          <Collapse accordion>
            {days
              .filter((day) => day && day.slots && day.slots.length > 0)
              .map((day, dayIndex) => (
                <Panel
                  key={dayIndex}
                  header={
                    <div className="flex items-center">
                      <CalendarOutlined className="mr-2" />
                      {formatDayHeader(day)}
                    </div>
                  }
                >
                  <div className="space-y-3">
                    {day.slots.map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="p-3 border rounded hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div className="flex items-center">
                            <ClockCircleOutlined className="mr-2 text-gray-500" />
                            <span className="font-medium">
                              {slot.startTime &&
                                moment(slot.startTime).format("h:mm A")}{" "}
                              -{" "}
                              {slot.endTime &&
                                moment(slot.endTime).format("h:mm A")}
                            </span>
                          </div>
                          <Tag color="blue" className="ml-2">
                            {getSubjectName(slot.subjectId)}
                          </Tag>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {slot.teacher && (
                            <Tag color="purple">
                              <span className="font-medium">Teacher:</span>{" "}
                              {slot.teacher}
                            </Tag>
                          )}
                          {slot.room && (
                            <Tag color="green">
                              <span className="font-medium">Room:</span>{" "}
                              {slot.room}
                            </Tag>
                          )}
                          {slot.description && (
                            <div className="w-full mt-2 text-sm text-gray-600">
                              {slot.description}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              ))}
          </Collapse>
        </Card>
      </div>
    </Modal>
  );
};

// Main Form Component
const TimeTableForm = ({ editingTimetable, onSubmit, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [timetableType, setTimetableType] = useState(null);
  const [submitType, setSubmitType] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const firstInputRef = useRef(null);

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

  // Memoized options for better performance
  const memoizedClassOptions = useMemo(
    () =>
      classList?.map((cls) => (
        <Option key={cls._id} value={cls._id}>
          {cls.className || cls.name}
        </Option>
      )),
    [classList]
  );

  const memoizedSectionOptions = useMemo(
    () =>
      sectionList?.map((sec) => (
        <Option key={sec._id} value={sec._id}>
          {sec.sectionName || sec.name}
        </Option>
      )),
    [sectionList]
  );

  const memoizedGroupOptions = useMemo(
    () =>
      groupsList?.map((grp) => (
        <Option key={grp._id} value={grp._id}>
          {grp.groupName || grp.name}
        </Option>
      )),
    [groupsList]
  );

  const memoizedSemesterOptions = useMemo(
    () =>
      reduxSemesters?.map((sem) => (
        <Option key={sem._id} value={sem._id}>
          {sem.title}
        </Option>
      )),
    [reduxSemesters]
  );

  // Date validation
  const validateDateRange = useCallback((_, value) => {
    if (value && value[0] && value[1] && value[0].isAfter(value[1])) {
      return Promise.reject("End date must be after start date");
    }
    return Promise.resolve();
  }, []);

  // Initialize form with editing data
  useEffect(() => {
    if (editingTimetable) {
      const {
        validity,
        days,
        classId,
        sectionId,
        groupId,
        semesterId,
        showCalendar,
      } = editingTimetable;

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
        showCalendar: showCalendar !== false,
      });

      if (classId?._id) {
        dispatch(fetchSectionsNamesByClass(classId._id));
        dispatch(fetchGroupsByClass(classId._id));
        dispatch(fetchSubjects(classId._id));
        dispatch(fetchSemestersByClass(classId._id));
      }

      setTimetableType(editingTimetable.type);

      // Focus first field after a small delay
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
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

  const getPreviewData = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      classId: classList?.find((cls) => cls._id === values.classId),
      sectionId: sectionList?.filter((sec) =>
        values.sectionId?.includes(sec._id)
      ),
      groupId: groupsList?.filter((grp) => values.groupId?.includes(grp._id)),
      semesterId: reduxSemesters?.find((sem) => sem._id === values.semesterId),
      validity: {
        startDate: values.validity?.[0]?.toISOString(),
        endDate: values.validity?.[1]?.toISOString(),
      },
      days: values.days || [],
    };
  };

  const handleSubmit = async (publish = false) => {
    try {
      setSubmitType(publish ? "publish" : "draft");
      await form.validateFields();

      const values = form.getFieldsValue();
      const [startMoment, endMoment] = values.validity || [];

      const timetableData = {
        name: values.name,
        type: values.type,
        showCalendar: values.showCalendar !== false,
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
      setSubmitType(null);
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

  const isLoading = loadingCreate || loadingUpdate || submitType !== null;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ff65a3",
          colorBgContainer: "#ffffff",
          colorText: "#333",
          colorBorder: "#d9d9d9",
        },
      }}
    >
      <Form
        layout="vertical"
        form={form}
        requiredMark={false}
        onFieldsChange={handleFieldsChange}
      >
        {/* Preview Button */}
        <div className="flex justify-end mb-4">
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => setPreviewVisible(true)}
            disabled={!form.getFieldValue("type")}
          >
            Preview Timetable
          </Button>
        </div>

        {/* Basic Information Section */}
        <Divider orientation="left" orientationMargin={0}>
          <span className="text-gray-600 font-medium">Basic Information</span>
        </Divider>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Timetable Name"
              name="name"
              rules={[
                { required: true, message: "Timetable name is required" },
              ]}
            >
              <Input
                ref={firstInputRef}
                placeholder="e.g. Midterm Exam Schedule"
                size="large"
                aria-label="Timetable name"
              />
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
                aria-label="Timetable type"
              >
                {TIMETABLE_TYPES.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Validity Period"
              name="validity"
              rules={[
                { required: true, message: "Please select a date range" },
                { validator: validateDateRange },
              ]}
            >
              <RangePicker
                size="large"
                style={{ width: "100%" }}
                aria-label="Validity period"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Show on Calendar"
              name="showCalendar"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Yes"
                unCheckedChildren="No"
                defaultChecked={editingTimetable?.showCalendar ?? true}
                aria-label="Show on calendar"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Class & Section Section */}
        <Divider orientation="left" orientationMargin={0}>
          <span className="text-gray-600 font-medium">Class & Section</span>
        </Divider>

        <Row gutter={[16, 16]}>
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
                aria-label="Class selection"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {memoizedClassOptions}
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
                aria-label="Section selection"
              >
                {memoizedSectionOptions}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Group & Semester Section */}
        <Divider orientation="left" orientationMargin={0}>
          <span className="text-gray-600 font-medium">Group & Semester</span>
        </Divider>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item label="Group" name="groupId">
              <Select
                mode="multiple"
                size="large"
                placeholder="Select Groups"
                allowClear
                aria-label="Group selection"
              >
                {memoizedGroupOptions}
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
                aria-label="Semester selection"
              >
                {memoizedSemesterOptions}
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
                  value.some((day) => day?.slots && day.slots.length > 0)
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

        {/* Footer Buttons */}
        <div className="bg-pink-50 py-2 border-t sticky -bottom-2 rounded-md z-10">
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 px-6">
            <Button
              onClick={showConfirmOnClose}
              className="w-full sm:w-auto"
              disabled={isLoading}
              aria-label="Cancel form"
            >
              Cancel
            </Button>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                type="default"
                loading={submitType === "draft"}
                onClick={() => handleSubmit(false)}
                className="w-full sm:w-auto"
                disabled={isLoading}
                aria-label="Save as draft"
              >
                Save as Draft
              </Button>
              <Button
                type="primary"
                loading={submitType === "publish"}
                onClick={() => handleSubmit(true)}
                className="w-full sm:w-auto"
                disabled={isLoading}
                aria-label="Save and publish"
              >
                Save & Publish
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        <TimetablePreviewModal
          visible={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          timetableData={getPreviewData()}
          allSubjects={allSubjects}
        />
      </Form>
    </ConfigProvider>
  );
};

export default TimeTableForm;
