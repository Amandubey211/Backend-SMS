import React from "react";
import { Drawer, Divider, Card, Tag, Table } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { format } from "date-fns";

/**
 * Drawer component showing detailed timetable information
 * @param {Object} props - Component props
 */
const TimetableDetailsDrawer = ({
  visible,
  onClose,
  timetable,
  TIMETABLE_TYPES,
  t,
}) => {
  if (!timetable) return null;

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
                      backgroundColor:
                        TIMETABLE_TYPES.find((t) => t.type === timetable?.type)
                          ?.bgColor || "#f0f0f0",
                    }}
                  >
                    <div className="text-4xl text-gray-800">
                      {TIMETABLE_TYPES.find((t) => t.type === timetable?.type)
                        ?.icon || null}
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
                          {typeof section === "object"
                            ? section?.sectionName
                            : section || "No Section Name"}
                        </Tag>
                      ))
                    ) : (
                      <Tag color="purple">All Sections</Tag>
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
                columns={[
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
                ]}
                dataSource={timetable.days?.flatMap(
                  (day) =>
                    day.slots?.map((slot) => ({
                      key: `${day.day || day.date}-${slot.startTime}-${
                        slot.endTime
                      }`,
                      ...day,
                      ...slot,
                    })) || []
                )}
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
      </div>
    </Drawer>
  );
};

export default TimetableDetailsDrawer;
