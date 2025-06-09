import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
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
  Tabs,
  TimePicker,
  Space,
  Checkbox,
  Spin,
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import DaySlotFields from "./DaySlotFields";
import dayjs from "dayjs";
import {
  fetchGroupsByClass,
  fetchGroupsByClassAndSection,
  fetchSectionsNamesByClass,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchSubjects } from "../../../../Store/Slices/Admin/Class/Subject/subjectThunks";
import { fetchSemestersByClass } from "../../../../Store/Slices/Admin/Class/Semester/semesterThunks";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { createTimeTable, updateTimeTable } from "../../../../Store/Slices/Admin/asctimetable/asctimetablethunk";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const TIMETABLE_TYPES = [
  { value: "exam", label: "Exam", icon: <BookOutlined /> },
  { value: "event", label: "Event", icon: <TeamOutlined /> },
  { value: "others", label: "Others", icon: <UsergroupAddOutlined /> },
];

const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

// Utility function to format time for display
const formatTimeForDisplay = (time) => {
  if (!time) return "N/A";
  if (typeof time === "string") return time; // Prefilled data as string
  if (dayjs.isDayjs(time)) return time.format("HH:mm"); // Added items as Day.js objects
  return "N/A"; // Fallback
};



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
        return "#77DDAA";
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

  const formatDayHeader = (day) => {
    if (type === "weekly") {
      return day.day || "Weekly";
    }
    return day.date ? dayjs(day.date).format("dddd, MMMM Do YYYY") : "No Date";
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
                    {dayjs(validity.startDate).format("DD MMM YYYY")}
                    {" to "}
                    <span className="font-medium">To: </span>
                    {validity.endDate
                      ? dayjs(validity.endDate).format("DD MMM YYYY")
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
                    <Tag key={group._id} color="green">
                      {group.groupName || "No Group Name"}
                    </Tag>
                  ))
                ) : (
                  <Tag color="green">All Groups</Tag>
                )}
              </div>
            </Col>
          </Row>
        </Card>

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
                                dayjs(slot.startTime).format("h:mm A")}{" "}
                              -{" "}
                              {slot.endTime &&
                                dayjs(slot.endTime).format("h:mm A")}
                            </span>
                          </div>
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

const TimeTableForm = ({ editingTimetable, onSubmit, onClose, Type }) => {
  const [normalForm] = Form.useForm();
  const [autoForm] = Form.useForm();
  const dispatch = useDispatch();
  const [timetableType, setTimetableType] = useState(null);
  const [submitType, setSubmitType] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("normal");
  const [subjectsData, setSubjectsData] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customStartTime, setCustomStartTime] = useState(null);
  const [customEndTime, setCustomEndTime] = useState(null);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState(null);
  const [publishAuto, setPublishAuto] = useState(true);
  const firstInputRef = useRef(null);

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
  const role = useSelector((store) => store.common.auth.role);

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

  const memoizedDayOptions = useMemo(
    () =>
      DAYS_OF_WEEK.map((day) => (
        <Option key={day.value} value={day.value}>
          {day.label}
        </Option>
      )),
    []
  );

  const validateDateRange = useCallback((_, value) => {
    if (value && value[0] && value[1] && value[0].isAfter(value[1])) {
      return Promise.reject("End date must be after start date");
    }
    return Promise.resolve();
  }, []);

  const handleTimeChange = (index, field, value) => {
    const updatedItems = [...customItems];
    updatedItems[index][field] = value ? dayjs(value, "HH:mm") : null;
    setCustomItems(updatedItems);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (editingTimetable) {
        try {
          const {
            validity,
            days,
            classId,
            sectionId,
            groupId,
            semesterId,
            showCalendar,
            customTiming,
          } = editingTimetable;

          const convertedValidity =
            validity?.startDate && validity?.endDate
              ? [dayjs(validity.startDate), dayjs(validity.endDate)]
              : [];

          const convertedDays = (days || []).map((dayItem) => {
            const newDay = { ...dayItem };
            if (newDay.date) {
              newDay.date = dayjs(newDay.date);
            }
            if (newDay.slots && Array.isArray(newDay.slots)) {
              newDay.slots = newDay.slots.map((slot) => {
                const newSlot = { ...slot };
                if (newSlot.startTime) {
                  newSlot.startTime = dayjs(newSlot.startTime);
                }
                if (newSlot.endTime) {
                  newSlot.endTime = dayjs(newSlot.endTime);
                }
                if (newSlot.subjectId && typeof newSlot.subjectId === "object") {
                  newSlot.subjectId = newSlot.subjectId._id;
                }
                return newSlot;
              });
            }
            return newDay;
          });

          // Convert customTiming strings to Day.js objects
          const normalizedCustomTiming = (customTiming || []).map((item) => ({
            ...item,
            startTime: item.startTime ? dayjs(item.startTime, "HH:mm") : null,
            endTime: item.endTime ? dayjs(item.endTime, "HH:mm") : null,
          }));

          if (Type === "automatic") {
            setActiveTab("automatic");
            await dispatch(fetchSubjects(editingTimetable.classId)).unwrap();
            editingTimetable?.subjectsTiming?.map((sub) => {
              handleSubjectSelect(sub.subjectId);
              handleMinutesChange(sub.subjectId, sub.time);
            });

            autoForm.setFieldsValue({
              classId: editingTimetable.classId,
              sectionId: editingTimetable.sectionId,
              days: editingTimetable.days || [],
              startTime: editingTimetable.startTime
                ? dayjs(editingTimetable.startTime, "HH:mm")
                : null,
              endTime: editingTimetable.endTime
                ? dayjs(editingTimetable.endTime, "HH:mm")
                : null,
              publish: publishAuto,
            });
            if (editingTimetable?.classId) {
              const classId = editingTimetable.classId;
              await dispatch(fetchSectionsNamesByClass(classId))
                .unwrap()
                .catch(() => {});
            }
            setCustomItems(normalizedCustomTiming);
            setSelectedDays(editingTimetable.days);
          } else {
            setActiveTab("normal");
            normalForm.setFieldsValue({
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
          }

          if (classId?._id) {
            try {
              await dispatch(fetchSubjects(classId._id)).unwrap();
            } catch (error) {
              setErrorMessage("Failed to fetch subjects. Please try again.");
              setErrorModalVisible(true);
            }

            await Promise.all([
              dispatch(fetchSectionsNamesByClass(classId._id))
                .unwrap()
                .catch(() => {}),
              dispatch(fetchGroupsByClass(classId._id))
                .unwrap()
                .catch(() => {}),
              dispatch(fetchSemestersByClass(classId._id))
                .unwrap()
                .catch(() => {}),
            ]);
          }

          setTimetableType(editingTimetable.type);

          setTimeout(() => {
            firstInputRef.current?.focus();
          }, 100);
        } catch (error) {
          console.error("Error in fetchData:", error);
        }
      } else {
        normalForm.resetFields();
        autoForm.resetFields();
        setTimetableType(null);
        setCustomItems([]);
      }
    };

    fetchData();
  }, [editingTimetable, dispatch, normalForm, autoForm, publishAuto]);

  useEffect(() => {
    if (allSubjects && activeTab === "automatic") {
      setIsSubjectsLoading(true);
      setSubjectsError(null);

      try {
        const subjects = allSubjects.map((subject) => ({
          subjectId: String(subject.subjectId),
          subjectName: subject.subjectName,
          minutes: 0,
        }));
        setSubjectsData(subjects);
        setSelectedSubjects({});
        setSelectedDays([]);
        setIsSubjectsLoading(false);
      } catch (error) {
        setSubjectsError("Failed to process subjects data.");
        setIsSubjectsLoading(false);
      }
    }
  }, [allSubjects, activeTab]);

  const handleFieldsChange = () => {
    setHasUnsavedChanges(true);
  };

  const isEdit = !!editingTimetable;

  const handleClassChange = async (classId, formInstance) => {
    formInstance.setFieldsValue({
      sectionId: [],
      groupId: [],
      semesterId: undefined,
    });
    if (classId) {
      setIsSubjectsLoading(true);
      setSubjectsError(null);

      try {
        await dispatch(fetchSubjects(classId)).unwrap();
      } catch (error) {
        setSubjectsError("Failed to fetch subjects. Please try again.");
        setErrorMessage("Failed to fetch subjects. Please try again.");
        setErrorModalVisible(true);
      } finally {
        setIsSubjectsLoading(false);
      }

      await Promise.all([
        dispatch(fetchSectionsNamesByClass(classId))
          .unwrap()
          .catch(() => {}),
        dispatch(fetchGroupsByClass(classId))
          .unwrap()
          .catch(() => {}),
        dispatch(fetchSemestersByClass(classId))
          .unwrap()
          .catch(() => {}),
      ]);
    } else {
      setSubjectsData([]);
      setSelectedSubjects({});
      setSelectedDays([]);
      setIsSubjectsLoading(false);
      setSubjectsError(null);
    }
  };

  const handleSectionChange = async (sectionId, formInstance) => {
    const classId = formInstance.getFieldValue("classId");

    await dispatch(
      fetchGroupsByClassAndSection({ classId, sectionId: sectionId })
    )
      .unwrap()
      .catch(() => {});
  };

  const handleSubjectSelect = (subjectId) => {
    const idString = String(subjectId);
    setSelectedSubjects((prev) => ({
      ...prev,
      [idString]: !prev[idString],
    }));
  };

  const scrollToField = (fieldName) => {
    const element = document.querySelector(`[name="${fieldName}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus({ preventScroll: true });
    }
  };

  const getPreviewData = () => {
    const values = normalForm.getFieldsValue();
    return {
      ...values,
      classId: classList?.find((cls) => cls._id === values.classId),
      sectionId: sectionList?.filter((sec) => values.sectionId?.includes(sec._id)),
      groupId: groupsList?.filter((grp) => values.groupId?.includes(grp._id)),
      semesterId: reduxSemesters?.find((sem) => sem._id === values.semesterId),
      validity: {
        startDate: values.validity?.[0]?.toISOString(),
        endDate: values.validity?.[1]?.toISOString(),
      },
      days: values.days || [],
    };
  };

  const handleNormalSubmit = async (publish = false) => {
    try {
      setSubmitType(publish ? "publish" : "draft");
      await normalForm.validateFields();

      const values = normalForm.getFieldsValue();
      const [startDayjs, endDayjs] = values.validity || [];

      const timetableData = {
        name: values.name,
        type: values.type,
        showCalendar: values.showCalendar !== false,
        validity: {
          startDate: startDayjs ? startDayjs.toISOString() : null,
          endDate: endDayjs ? endDayjs.toISOString() : null,
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

      resetAll();
    } catch (error) {
      if (error.errorFields && error.errorFields.length > 0) {
        const firstErrorField = error.errorFields[0].name[0];
        scrollToField(firstErrorField);
        setErrorMessage(error.errorFields[0].errors[0]);
        setErrorModalVisible(true);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
        setErrorModalVisible(true);
      }
    } finally {
      setSubmitType(null);
    }
  };

  const handleMinutesChange = (subjectId, value) => {
    const idString = String(subjectId);
    setSubjectsData((prev) =>
      prev.map((item) =>
        item.subjectId === idString
          ? { ...item, minutes: parseInt(value) || 0 }
          : item
      )
    );
  };

  const calculateCustomItemsTotalDuration = () => {
    if (!customItems || customItems.length === 0) {
      return 0;
    }

    return customItems.reduce((total, item) => {
      if (!item.startTime || !item.endTime || !item.startTime.isValid() || !item.endTime.isValid()) {
        return total;
      }

      const startMinutes = item.startTime.hour() * 60 + item.startTime.minute();
      const endMinutes = item.endTime.hour() * 60 + item.endTime.minute();
      const duration = endMinutes > startMinutes ? endMinutes - startMinutes : 0;
      return total + duration;
    }, 0);
  };

  const handleAddCustom = () => {
    const timetableStartTime = autoForm.getFieldValue("startTime");
    const timetableEndTime = autoForm.getFieldValue("endTime");

    if (!customName) {
      setErrorMessage("Please provide a name for the custom item.");
      setErrorModalVisible(true);
      return;
    }
    if (
      !customStartTime ||
      !customEndTime ||
      !customStartTime.isValid() ||
      !customEndTime.isValid()
    ) {
      setErrorMessage("Please provide valid start and end times for the custom item.");
      setErrorModalVisible(true);
      return;
    }
    if (!timetableStartTime || !timetableEndTime) {
      setErrorMessage("Please set the timetable start and end times first.");
      setErrorModalVisible(true);
      return;
    }

    if (
      customStartTime.isBefore(timetableStartTime) ||
      customStartTime.isAfter(timetableEndTime)
    ) {
      setErrorMessage(
        `Custom start time must be between ${timetableStartTime.format(
          "HH:mm"
        )} and ${timetableEndTime.format("HH:mm")}.`
      );
      setErrorModalVisible(true);
      return;
    }
    if (
      customEndTime.isBefore(timetableStartTime) ||
      customEndTime.isAfter(timetableEndTime)
    ) {
      setErrorMessage(
        `Custom end time must be between ${timetableStartTime.format(
          "HH:mm"
        )} and ${timetableEndTime.format("HH:mm")}.`
      );
      setErrorModalVisible(true);
      return;
    }
    if (customEndTime.isSameOrBefore(customStartTime)) {
      setErrorMessage("Custom end time must be after start time.");
      setErrorModalVisible(true);
      return;
    }

    setCustomItems([
      ...customItems,
      {
        name: customName,
        startTime: customStartTime,
        endTime: customEndTime,
      },
    ]);
    setCustomName("");
    setCustomStartTime(null);
    setCustomEndTime(null);
    setCustomModalVisible(false);
  };

  const handleRemoveCustom = (index) => {
    setCustomItems((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotalMinutes = () => {
    const subjectMinutes = subjectsData
      .filter((item) => selectedSubjects[item.subjectId])
      .reduce((total, item) => total + item.minutes, 0);

    const customMinutes = calculateCustomItemsTotalDuration();
    return subjectMinutes + customMinutes;
  };

  const calculateAllowedMinutes = () => {
    const values = autoForm.getFieldsValue();
    const { startTime, endTime } = values;
    if (!startTime || !endTime || !startTime.isValid() || !endTime.isValid()) {
      return 0;
    }
    const startMinutes = startTime.hour() * 60 + startTime.minute();
    const endMinutes = endTime.hour() * 60 + endTime.minute();
    if (endMinutes <= startMinutes) {
      return 0;
    }
    return endMinutes - startMinutes;
  };

  const handleAutoSubmit = async () => {
    try {
      setSubmitType("submit");
      await autoForm.validateFields();

      const selectedSubjectCount = Object.values(selectedSubjects).filter(
        Boolean
      ).length;
      if (selectedSubjectCount === 0) {
        setErrorMessage("Please select at least one subject.");
        setErrorModalVisible(true);
        return;
      }

      const actualDuration = calculateTotalMinutes();
      const allowedDuration = calculateAllowedMinutes();

      if (allowedDuration === 0) {
        setErrorMessage(
          "Invalid start or end time. Please ensure the end time is after the start time."
        );
        setErrorModalVisible(true);
        return;
      }

      if (actualDuration > allowedDuration) {
        const startTimeFormatted = autoForm.getFieldValue("startTime").format("h:mm A");
        const endTimeFormatted = autoForm.getFieldValue("endTime").format("h:mm A");
        setErrorMessage(
          `The actual duration (${actualDuration} minutes) exceeds the allowed duration (${allowedDuration} minutes) between ${startTimeFormatted} and ${endTimeFormatted}.`
        );
        setErrorModalVisible(true);
        return;
      }
      if (actualDuration === 0) {
        setErrorMessage(
          "Please allocate at least some minutes to selected subjects."
        );
        setErrorModalVisible(true);
        return;
      }
      if (selectedDays.length === 0) {
        setErrorMessage("Please select at least one day for the timetable.");
        setErrorModalVisible(true);
        return;
      }

      const values = autoForm.getFieldsValue();
      const startTime = values.startTime;
      const endTime = values.endTime;
      let currentTime = startTime;

      const subjectsTime = [];
      const customTime = [];
      subjectsData
        .filter((item) => selectedSubjects[item.subjectId] && item.minutes > 0)
        .forEach((item) => {
          const slotEndTime = currentTime.add(item.minutes, "minutes");
          subjectsTime.push({
            subjectId: item.subjectId,
            time: item.minutes,
          });
          currentTime = slotEndTime;
        });

      // Format customItems as strings for submission
      customItems.forEach((item) => {
        customTime.push({
          name: item.name,
          startTime: formatTimeForDisplay(item.startTime),
          endTime: formatTimeForDisplay(item.endTime),
          _id: item._id,
        });
      });

      const timetableData = {
        classId: values.classId,
        sectionId: values.sectionId,
        startTime: startTime.format("HH:mm"),
        endTime: endTime.format("HH:mm"),
        days: selectedDays,
        subjectsTiming: subjectsTime,
        customTiming: customTime,
        publish: publishAuto ? true : false,
      };
      const response = editingTimetable
        ? await dispatch(updateTimeTable({ id: editingTimetable?._id, timetableData })).unwrap()
        : await dispatch(createTimeTable(timetableData)).unwrap();
      console.log("Response from create/update:", response);
      if (response.success) {
        notification.success({
          message: editingTimetable
            ? "Automatic TimeTable Updated Successfully"
            : "Automatic Timetable created successfully",
          description: editingTimetable
            ? "Your Automatic TimeTable has been updated successfully"
            : "Your automatic timetable has been created successfully.",
        });
        autoForm.resetFields();
        setSubjectsData(subjectsData.map((item) => ({ ...item, minutes: 0 })));
        setSelectedSubjects({});
        setSelectedDays([]);
        setCustomItems([]);
        setPublishAuto(true);
      } else {
        setErrorMessage(
          response.message || "Failed to create Automatic Timetable. Please try again."
        );
        setErrorModalVisible(true);
      }
    } catch (error) {
      if (error.errorFields && error.errorFields.length > 0) {
        const firstErrorField = error.errorFields[0].name[0];
        scrollToField(firstErrorField);
        setErrorMessage(error.errorFields[0].errors[0]);
        setErrorModalVisible(true);
      } else {
        setErrorMessage(
          error.message || "An unexpected error occurred. Please try again."
        );
        setErrorModalVisible(true);
      }
    } finally {
      setSubmitType(null);
    }
  };

  const resetAll = () => {
    normalForm.resetFields();
    autoForm.resetFields();
    setTimetableType(null);
    setHasUnsavedChanges(false);
    setPreviewVisible(false);
    setSubjectsData([]);
    setSelectedSubjects({});
    setSelectedDays([]);
    setCustomItems([]);
    setCustomModalVisible(false);
    setCustomName("");
    setCustomStartTime(null);
    setCustomEndTime(null);
    setErrorModalVisible(false);
    setErrorMessage("");
    setIsSubjectsLoading(false);
    setSubjectsError(null);
    setPublishAuto(true);
  };

  const handleReset = () => {
    autoForm.resetFields();
    setSubjectsData(subjectsData.map((item) => ({ ...item, minutes: 0 })));
    setSelectedSubjects({});
    setSelectedDays([]);
    setCustomItems([]);
    setPublishAuto(true);
    setHasUnsavedChanges(false);
  };

  const showConfirmOnClose = () => {
    if (!hasUnsavedChanges) {
      resetAll();
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
        resetAll();
        onClose();
      },
    });
  };

  const isLoading = loadingCreate || loadingUpdate || submitType !== null;

  // Determine which tabs to show based on edit mode
  const showNormalTab = !editingTimetable || editingTimetable.type !== "automatic";
  const showAutomaticTab = !editingTimetable || editingTimetable.type === "automatic";

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
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {showNormalTab && (
          <TabPane tab="Normal Timetable" key="normal">
            <Form
              layout="vertical"
              form={normalForm}
              requiredMark={false}
              onFieldsChange={handleFieldsChange}
            >
              <div className="flex justify-end mb-4">
                <Button
                  type="default"
                  icon={<EyeOutlined />}
                  onClick={() => setPreviewVisible(true)}
                  disabled={!normalForm.getFieldValue("type")}
                >
                  Preview Timetable
                </Button>
              </div>

              <Divider orientation="left" orientationMargin={0}>
                <span className="text-gray-600 font-medium">Basic Information</span>
              </Divider>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Timetable Name"
                    name="name"
                    rules={[{ required: true, message: "Timetable name is required" }]}
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
                    rules={[{ required: true, message: "Timetable type is required" }]}
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
                      onChange={(value) => handleClassChange(value, normalForm)}
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
                      onChange={(value) => handleSectionChange(value, normalForm)}
                      aria-label="Section selection"
                    >
                      {memoizedSectionOptions}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

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
                      disabled={!normalForm.getFieldValue("classId")}
                      aria-label="Semester selection"
                    >
                      {memoizedSemesterOptions}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

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
                  form={normalForm}
                  timetableType={timetableType}
                  allSubjects={allSubjects}
                />
              </Form.Item>

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
                      onClick={() => handleNormalSubmit(false)}
                      className="w-full sm:w-auto"
                      disabled={isLoading}
                      aria-label="Save as draft"
                    >
                      Save as Draft
                    </Button>
                    <Button
                      type="primary"
                      loading={submitType === "publish"}
                      onClick={() => handleNormalSubmit(true)}
                      className="w-full sm:w-auto"
                      disabled={isLoading}
                      aria-label="Save and publish"
                    >
                      Save & Publish
                    </Button>
                  </div>
                </div>
              </div>

              <TimetablePreviewModal
                visible={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                timetableData={getPreviewData()}
                allSubjects={allSubjects}
              />
            </Form>
          </TabPane>
        )}

        {showAutomaticTab && role === 'admin' && (
          <TabPane tab="Automatic Timetable" key="automatic">
            <Form layout="vertical" form={autoForm} requiredMark={false}>
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
                      onChange={(value) => handleClassChange(value, autoForm)}
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
                      size="large"
                      placeholder="Select Sections"
                      allowClear
                      onChange={(value) => handleSectionChange(value, autoForm)}
                      aria-label="Section selection"
                    >
                      {memoizedSectionOptions}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Days"
                    name="days"
                    rules={[{ required: true, message: "Please select at least one day" }]}
                  >
                    <Select
                      mode="multiple"
                      size="large"
                      placeholder="Select Days"
                      allowClear
                      onChange={(value) => setSelectedDays(value)}
                      aria-label="Days selection"
                    >
                      {memoizedDayOptions}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Start Time"
                    name="startTime"
                    rules={[{ required: true, message: "Start time is required" }]}
                  >
                    <TimePicker
                      size="large"
                      format="HH:mm"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="End Time"
                    name="endTime"
                    rules={[
                      { required: true, message: "End time is required" },
                      ({ getFieldValue }) => ({
                        validator: (_, value) => {
                          const startTime = getFieldValue("startTime");
                          if (!startTime || !value) {
                            return Promise.resolve();
                          }
                          if (value.isSameOrBefore(startTime)) {
                            return Promise.reject("End time must be after start time");
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <TimePicker
                      size="large"
                      format="HH:mm"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {autoForm.getFieldValue("classId") && (
                <>
                  <Divider orientation="left" orientationMargin={0}>
                    <span className="text-gray-600 font-medium">Subjects</span>
                  </Divider>

                  {isSubjectsLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <Spin tip="Loading subjects..." />
                    </div>
                  ) : subjectsError ? (
                    <div className="text-center text-red-500 py-4">
                      {subjectsError}
                    </div>
                  ) : allSubjects.length === 0 ? (
                    <NoDataFound />
                  ) : (
                    <div className="space-y-4">
                      {allSubjects.map((subject) => (
                        <Row
                          key={subject.subjectId}
                          gutter={[16, 16]}
                          align="middle"
                        >
                          <Col span={12}>
                            <Checkbox
                              checked={!!selectedSubjects[String(subject.subjectId)]}
                              onChange={() => handleSubjectSelect(subject.subjectId)}
                            >
                              {subject.subjectName}
                            </Checkbox>
                          </Col>
                          <Col span={12}>
                            <Input
                              type="number"
                              placeholder="Duration"
                              style={{ width: "150px" }}
                              min={0}
                              value={
                                subjectsData.find(
                                  (item) => item.subjectId === String(subject.subjectId)
                                )?.minutes || 0
                              }
                              disabled={!selectedSubjects[String(subject.subjectId)]}
                              onChange={(e) =>
                                handleMinutesChange(subject.subjectId, e.target.value)
                              }
                              addonAfter="min"
                            />
                          </Col>
                        </Row>
                      ))}
                    </div>
                  )}
                </>
              )}

              <Divider orientation="left" orientationMargin={0}>
                <span className="text-gray-600 font-medium">Custom Items</span>
              </Divider>

              <div className="mb-4 flex items-center gap-4">
                <Button onClick={() => setCustomModalVisible(true)}>
                  Add Custom
                </Button>
                <div>
                  <span className="mr-2">Publish Timetable:</span>
                  <Switch
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    checked={publishAuto}
                    onChange={(checked) => setPublishAuto(checked)}
                    aria-label="Publish timetable"
                  />
                </div>
              </div>

              {customItems.length > 0 && (
                <div className="space-y-2 mb-4">
                  {customItems.map((item, index) => (
                    <div key={item._id} className="flex items-center gap-2">
                      <Tag color="orange">{item.name}</Tag>
                      <Input
                        type="time"
                        value={formatTimeForDisplay(item.startTime)}
                        onChange={(e) =>
                          handleTimeChange(index, "startTime", e.target.value)
                        }
                        className="w-24"
                      />
                      <Input
                        type="time"
                        value={formatTimeForDisplay(item.endTime)}
                        onChange={(e) =>
                          handleTimeChange(index, "endTime", e.target.value)
                        }
                        className="w-24"
                      />
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveCustom(index)}
                        aria-label="Remove custom item"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-pink-50 py-2 border-t sticky -bottom-2 rounded-md z-10 mt-4">
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 px-6">
                  <Button
                    onClick={handleReset}
                    className="w-full sm:w-auto"
                    disabled={isLoading}
                    aria-label="Reset form"
                  >
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    loading={submitType === "submit"}
                    onClick={handleAutoSubmit}
                    className="w-full sm:w-auto"
                    disabled={isLoading}
                    aria-label="Submit form"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Form>
          </TabPane>
        )}
      </Tabs>

      <Modal
        title="Error"
        visible={errorModalVisible}
        onOk={() => setErrorModalVisible(false)}
        onCancel={() => setErrorModalVisible(false)}
        okText="OK"
      >
        <p>{errorMessage}</p>
      </Modal>

      <Modal
        title="Add Custom Item"
        visible={customModalVisible}
        onOk={handleAddCustom}
        onCancel={() => {
          setCustomName("");
          setCustomStartTime(null);
          setCustomEndTime(null);
          setCustomModalVisible(false);
        }}
        okText="Add"
      >
        <div className="space-y-4">
          <div>
            <label>Name</label>
            <Input
              placeholder="e.g., Lunch Timing"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          </div>
          <div>
            <label>Start Time</label>
            <TimePicker
              size="large"
              format="HH:mm"
              value={customStartTime}
              onChange={(time) => setCustomStartTime(time)}
              style={{ width: "100%" }}
              disabledHours={() => {
                const startTime = autoForm.getFieldValue("startTime");
                const endTime = autoForm.getFieldValue("endTime");
                if (!startTime || !endTime) return [];

                const startHour = startTime.hour();
                const endHour = endTime.hour();
                const hours = [];
                for (let i = 0; i < 24; i++) {
                  if (i < startHour || i > endHour) {
                    hours.push(i);
                  }
                }
                return hours;
              }}
              disabledMinutes={(selectedHour) => {
                const startTime = autoForm.getFieldValue("startTime");
                const endTime = autoForm.getFieldValue("endTime");
                if (!startTime || !endTime) return [];

                const startHour = startTime.hour();
                const endHour = endTime.hour();
                const startMinute = startTime.minute();
                const endMinute = endTime.minute();

                if (selectedHour === startHour) {
                  const minutes = [];
                  for (let i = 0; i < startMinute; i++) {
                    minutes.push(i);
                  }
                  return minutes;
                }
                if (selectedHour === endHour) {
                  const minutes = [];
                  for (let i = endMinute + 1; i < 60; i++) {
                    minutes.push(i);
                  }
                  return minutes;
                }
                return [];
              }}
            />
          </div>
          <div>
            <label>End Time</label>
            <TimePicker
              size="large"
              format="HH:mm"
              value={customEndTime}
              onChange={(time) => setCustomEndTime(time)}
              style={{ width: "100%" }}
              disabledHours={() => {
                const startTime = autoForm.getFieldValue("startTime");
                const endTime = autoForm.getFieldValue("endTime");
                if (!startTime || !endTime) return [];

                const startHour = startTime.hour();
                const endHour = endTime.hour();
                const hours = [];
                for (let i = 0; i < 24; i++) {
                  if (i < startHour || i > endHour) {
                    hours.push(i);
                  }
                }
                return hours;
              }}
              disabledMinutes={(selectedHour) => {
                const startTime = autoForm.getFieldValue("startTime");
                const endTime = autoForm.getFieldValue("endTime");
                const customStart = customStartTime;
                if (!startTime || !endTime) return [];

                const startHour = startTime.hour();
                const endHour = endTime.hour();
                const startMinute = startTime.minute();
                const endMinute = endTime.minute();
                const customStartHour = customStart ? customStart.hour() : null;
                const customStartMinute = customStart ? customStart.minute() : null;

                if (selectedHour === startHour && selectedHour === customStartHour) {
                  const minutes = [];
                  for (let i = 0; i <= (customStartMinute || startMinute); i++) {
                    minutes.push(i);
                  }
                  return minutes;
                }
                if (selectedHour === endHour) {
                  const minutes = [];
                  for (let i = endMinute + 1; i < 60; i++) {
                    minutes.push(i);
                  }
                  return minutes;
                }
                if (selectedHour === customStartHour && customStart) {
                  const minutes = [];
                  for (let i = 0; i <= customStartMinute; i++) {
                    minutes.push(i);
                  }
                  return minutes;
                }
                return [];
              }}
            />
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default TimeTableForm;