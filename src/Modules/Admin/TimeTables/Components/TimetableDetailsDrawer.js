import React from "react";
import { Drawer, Button, Tag, Card, Divider, Table } from "antd";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { format } from "date-fns";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarOutlined,
  BookOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const TimetableDetailsDrawer = ({
  visible,
  onClose,
  timetable,
  onEdit,
  onDelete,
}) => {
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
        return <CalendarOutlined className="text-lg" />;
      case "exam":
        return <BookOutlined className="text-lg" />;
      case "event":
        return <CalendarOutlined className="text-lg" />;
      case "others":
        return <TeamOutlined className="text-lg" />;
      default:
        return null;
    }
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
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-2xl text-gray-900">
                  {timetable?.name || "Untitled Timetable"}
                </h4>
                <div className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 flex items-center justify-center rounded mb-1"
                    style={{
                      backgroundColor: getLightBgByType(timetable?.type),
                    }}
                  >
                    <div className="text-4xl text-gray-800">
                      {getIconForType(timetable?.type)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700">
                    {timetable?.type?.toUpperCase() || "UNKNOWN"}
                  </span>
                </div>
              </div>

              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <h5 className="text-gray-600 text-sm">Status:</h5>
                  <Tag
                    color={timetable?.status === "active" ? "green" : "red"}
                    className="mt-1"
                  >
                    {timetable?.status || "inactive"}
                  </Tag>
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

                <div>
                  <h5 className="text-gray-600 text-sm">Semester:</h5>
                  <p className="text-sm text-gray-800">
                    {timetable?.semesterId?.title || "No Semester"}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Card
                    className="flex-1 border p-2 rounded"
                    style={{ backgroundColor: "#f7f7f7" }}
                  >
                    <p className="text-sm text-gray-500">Available From:</p>
                    <p className="text-sm text-gray-800 font-semibold">
                      {timetable?.validity?.startDate
                        ? format(
                            new Date(timetable?.validity?.startDate),
                            "M/d/yyyy"
                          )
                        : "N/A"}
                    </p>
                  </Card>
                  <Card
                    className="flex-1 border p-2 rounded"
                    style={{ backgroundColor: "#f7f7f7" }}
                  >
                    <p className="text-sm text-gray-500">Due Date:</p>
                    <p className="text-sm text-gray-800 font-semibold">
                      {timetable?.validity?.endDate
                        ? format(
                            new Date(timetable?.validity?.endDate),
                            "M/d/yyyy"
                          )
                        : "No End Date"}
                    </p>
                  </Card>
                </div>
              </div>

              <Divider />

              {/* Schedule Table */}
              <h5 className="font-medium text-gray-800">Schedule:</h5>
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
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sticky Footer for Edit and Delete */}
        <div className="sticky bottom-0 bg-white py-4 border-t">
          <div className="flex space-x-2 justify-center">
            <Button
              type="default"
              icon={<AiOutlineEdit />}
              style={{ borderColor: "#FF69B4", color: "#FF69B4" }}
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button danger icon={<AiOutlineDelete />} onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default TimetableDetailsDrawer;
