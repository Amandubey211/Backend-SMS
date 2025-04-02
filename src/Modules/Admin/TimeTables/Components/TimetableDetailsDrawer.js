import React, { useState, useEffect } from "react";
import { Drawer, Button, Tag, Divider, Table, Tabs } from "antd";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { format } from "date-fns";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarOutlined,
  BookOutlined,
  TeamOutlined,
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import DayView from "../Views/DayView";
import WeekView from "../Views/WeekView";

const TimetableDetailsDrawer = ({
  visible,
  onClose,
  timetable,
  onEdit,
  onDelete,
}) => {
  const [viewMode, setViewMode] = useState("details");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (timetable?.validity?.startDate) {
      const startDate = new Date(timetable.validity.startDate);
      if (!isNaN(startDate.getTime())) {
        setSelectedDate(startDate);
      }
    }
  }, [timetable]);

  if (!timetable) return null;

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

  const getLightBgByType = (type) => {
    switch (type) {
      case "weekly":
        return "rgba(255,153,204,0.2)";
      case "exam":
        return "rgba(41,171,226,0.2)";
      case "event":
        return "rgba(119,221,119,0.2)";
      case "others":
        return "rgba(255,215,0,0.2)";
      default:
        return "#f0f0f0";
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "weekly":
        return <CalendarOutlined className="text-2lg" />;
      case "exam":
        return <BookOutlined className="text-2lg" />;
      case "event":
        return <CalendarOutlined className="text-l2g" />;
      case "others":
        return <TeamOutlined className="text-2lg" />;
      default:
        return null;
    }
  };

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const columns = [
    {
      title: "Day/Date",
      dataIndex: "dayDate",
      key: "dayDate",
      render: (_, record) =>
        record.date
          ? format(new Date(record.date), "dd MMM yyyy")
          : record.day || "Weekly",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (_, record) =>
        `${dayjs(record.startTime).format("HH:mm")} - ${dayjs(
          record.endTime
        ).format("HH:mm")}`,
    },
    {
      title: "Subject/Event",
      dataIndex: "subject",
      key: "subject",
      render: (_, record) =>
        record.subjectId?.name || record.eventName || "N/A",
    },
    {
      title: "Teacher",
      dataIndex: "teacher",
      key: "teacher",
      render: (_, record) => record.teacherId?.name || "N/A",
    },
  ];

  const dataSource = timetable.days?.flatMap(
    (day) =>
      day.slots?.map((slot) => ({
        key: `${day.day || day.date}-${slot.startTime}-${slot.endTime}`,
        ...day,
        ...slot,
      })) || []
  );

  const filteredTimetables = [timetable].filter((tt) => {
    if (!tt.validity) return true;
    const currentDate = selectedDate;
    const { startDate, endDate } = tt.validity;
    if (!startDate || !endDate) return true;
    return (
      currentDate >= new Date(startDate) && currentDate <= new Date(endDate)
    );
  });

  const isPreviousDayAvailable = () => {
    if (!timetable?.validity?.startDate) return true;
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    return prevDate >= new Date(timetable.validity.startDate);
  };

  const isNextDayAvailable = () => {
    if (!timetable?.validity?.endDate) return true;
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate <= new Date(timetable.validity.endDate);
  };

  return (
    <Drawer
      title="Timetable Details"
      placement="right"
      width={"90%"}
      open={visible}
      onClose={onClose}
      zIndex={1000}
    >
      <div className="h-full flex flex-col capitalize">
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence>
            <motion.div
              key="detailsDrawer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Header Section */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-2xl text-gray-900 mb-1">
                    {timetable?.name || "Untitled Timetable"}
                  </h4>
                  <div className="text-sm text-gray-600 mb-2">
                    {timetable?.validity?.startDate && (
                      <>
                        <span className="font-medium">From: </span>
                        {format(
                          new Date(timetable.validity.startDate),
                          "dd MMM yyyy"
                        )}
                        {" to "}
                        <span className="font-medium">To: </span>
                        {timetable.validity.endDate
                          ? format(
                              new Date(timetable.validity.endDate),
                              "dd MMM yyyy"
                            )
                          : "No End Date"}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* <Tag color={timetable?.status === "active" ? "green" : "red"}>
                    {timetable?.status === "active"
                      ? "Published"
                      : "Unpublished"}
                  </Tag> */}
                  <div
                    className="w-28 h-28 flex items-center justify-center flex-col rounded"
                    style={{
                      backgroundColor: getLightBgByType(timetable?.type),
                    }}
                  >
                    <div className="text-4xl text-gray-800">
                      {getIconForType(timetable?.type)}
                    </div>
                    <div>
                      <span> {timetable?.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Mode Tabs */}
              <Tabs
                activeKey={viewMode}
                onChange={setViewMode}
                items={[
                  {
                    key: "details",
                    label: (
                      <span>
                        <EyeOutlined /> Details
                      </span>
                    ),
                  },
                  {
                    key: "day",
                    label: (
                      <span>
                        <CalendarOutlined /> Day View
                      </span>
                    ),
                  },
                  {
                    key: "week",
                    label: (
                      <span>
                        <CalendarOutlined /> Week View
                      </span>
                    ),
                  },
                ]}
              />

              {/* Day View Navigation */}
              {viewMode === "day" && (
                <div className="flex justify-between items-center mb-4">
                  <Button
                    icon={<LeftOutlined />}
                    onClick={() => handleDateChange(-1)}
                    disabled={!isPreviousDayAvailable()}
                  />
                  <div className="font-medium">
                    {format(selectedDate, "EEEE, dd MMM yyyy")}
                  </div>
                  <Button
                    icon={<RightOutlined />}
                    onClick={() => handleDateChange(1)}
                    disabled={!isNextDayAvailable()}
                  />
                </div>
              )}

              {/* Content based on view mode */}
              {viewMode === "details" && (
                <>
                  {/* Basic Info Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h5 className="text-gray-600 text-sm">Class:</h5>
                      <div className="mt-1">
                        {timetable?.classId ? (
                          <Tag color="blue">
                            {timetable?.classId?.className || "No Class Name"}
                          </Tag>
                        ) : (
                          <Tag color="blue">No Class</Tag>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-gray-600 text-sm">Semester:</h5>
                      <p className="text-sm text-gray-800">
                        {timetable?.semesterId?.title || "No Semester"}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-gray-600 text-sm">Sections:</h5>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {timetable?.sectionId?.length > 0 ? (
                          timetable?.sectionId.map((section) => (
                            <Tag key={section?._id} color="purple">
                              {section?.sectionName || "No Section Name"}
                            </Tag>
                          ))
                        ) : (
                          <Tag color="purple">No Sections</Tag>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-gray-600 text-sm">Groups:</h5>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {timetable?.groupId?.length > 0 ? (
                          timetable?.groupId.map((group) => (
                            <Tag key={group?._id} color="cyan">
                              {group?.groupName || "No Group Name"}
                            </Tag>
                          ))
                        ) : (
                          <Tag color="cyan">No Groups</Tag>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Schedule Table */}
                  <h5 className="font-medium text-gray-800 mb-2">Schedule:</h5>
                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    size="small"
                    scroll={{ x: true }}
                    className="mt-2"
                    locale={{
                      emptyText: "No schedule data available",
                    }}
                  />
                </>
              )}

              {viewMode === "day" && (
                <DayView
                  selectedDate={selectedDate}
                  filteredTimetables={filteredTimetables}
                  onEventClick={() => {}}
                  onDateChange={setSelectedDate}
                />
              )}

              {viewMode === "week" && (
                <WeekView
                  selectedDate={selectedDate}
                  filteredTimetables={filteredTimetables}
                  onEventClick={() => {}}
                  onDateChange={setSelectedDate}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sticky Footer for Edit and Delete */}
        <div className="sticky bottom-0 bg-white py-4 border-t">
          <div className="flex justify-end gap-2">
            <Button
              type="default"
              icon={<AiOutlineEdit />}
              style={{ borderColor: "#FF69B4", color: "#FF69B4" }}
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              danger
              icon={<AiOutlineDelete />}
              onClick={() => onDelete(timetable._id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default TimetableDetailsDrawer;
