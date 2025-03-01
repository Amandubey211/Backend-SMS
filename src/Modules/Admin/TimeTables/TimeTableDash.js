import React, { useState } from "react";
import {
  Calendar,
  Radio,
  Badge,
  Drawer,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Modal,
} from "antd";
import { format } from "date-fns";
import { Doughnut } from "react-chartjs-2";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

ChartJS.register(ArcElement, Tooltip, Legend);
dayjs.extend(isSameOrBefore);

const { Option } = Select;
const { RangePicker } = DatePicker;

// DEMO: Some initial timetables stored as ISO date strings
const initialTimetables = [
  {
    _id: "1",
    name: "Weekly Timetable",
    type: "weekly",
    days: [
      { day: "Monday", slots: [{ startTime: "09:00", endTime: "10:00" }] },
      { day: "Wednesday", slots: [{ startTime: "11:00", endTime: "12:00" }] },
    ],
    validity: {
      startDate: "2025-01-01T00:00:00.000Z",
      endDate: "2025-06-01T00:00:00.000Z",
    },
  },
  {
    _id: "2",
    name: "Exam Timetable",
    type: "exam",
    days: [
      {
        date: "2025-03-09T00:00:00.000Z",
        slots: [{ startTime: "09:00", endTime: "11:00", subjectId: "Physics" }],
      },
      {
        date: "2025-03-15T00:00:00.000Z",
        slots: [{ startTime: "10:00", endTime: "12:00", subjectId: "Math" }],
      },
    ],
    validity: {
      startDate: "2025-03-01T00:00:00.000Z",
      endDate: "2025-03-31T00:00:00.000Z",
    },
  },
  {
    _id: "3",
    name: "Cultural Event",
    type: "event",
    days: [
      {
        date: "2025-04-10T00:00:00.000Z",
        slots: [
          { startTime: "13:00", endTime: "15:00", eventName: "Music Fest" },
        ],
      },
    ],
    validity: {
      startDate: "2025-04-05T00:00:00.000Z",
      endDate: "2025-04-10T00:00:00.000Z",
    },
  },
];

export default function TimeTableDash() {
  // ----------------------------------------------------------------
  // 1. LOCAL STATE
  // ----------------------------------------------------------------
  // We store timetables as plain objects/strings
  const [timetables, setTimetables] = useState(initialTimetables);

  // Store a JS Date for the “selected date”
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Active view: "day" | "week" | "month"
  const [viewMode, setViewMode] = useState("month");

  // ----------------------------------------------------------------
  // 2. CREATE/EDIT DRAWER STATE
  // ----------------------------------------------------------------
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [form] = Form.useForm();

  // ----------------------------------------------------------------
  // 3. DETAILS DRAWER STATE
  // ----------------------------------------------------------------
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [detailsTimetable, setDetailsTimetable] = useState(null);

  // ----------------------------------------------------------------
  // 4. DELETE MODAL STATE
  // ----------------------------------------------------------------
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // ----------------------------------------------------------------
  // 5. OPEN/CLOSE CREATE-EDIT DRAWER
  // ----------------------------------------------------------------
  const openDrawer = (timetable = null) => {
    setEditingTimetable(timetable);

    if (timetable) {
      // Convert stored ISO strings into Day.js objects for RangePicker
      const { startDate, endDate } = timetable.validity;
      form.setFieldsValue({
        name: timetable.name,
        type: timetable.type,
        validity: [dayjs(startDate), dayjs(endDate)],
      });
    } else {
      form.resetFields();
    }
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setEditingTimetable(null);
    setDrawerVisible(false);
  };

  // ----------------------------------------------------------------
  // 6. FORM SUBMIT (CREATE OR UPDATE)
  // ----------------------------------------------------------------
  const onFinish = (values) => {
    // values.validity => array of Day.js objects
    const [startDayjs, endDayjs] = values.validity || [];

    const newItem = {
      _id: editingTimetable?._id || String(Date.now()),
      name: values.name,
      type: values.type,
      validity: {
        startDate: startDayjs?.toISOString() || null,
        endDate: endDayjs?.toISOString() || null,
      },
      // Keep existing days if editing; empty array for new entries
      days: editingTimetable?.days || [],
    };

    if (editingTimetable) {
      // Update existing timetable
      setTimetables((prev) =>
        prev.map((itm) => (itm._id === editingTimetable._id ? newItem : itm))
      );
    } else {
      // Create new timetable
      setTimetables((prev) => [...prev, newItem]);
    }

    closeDrawer();
  };

  // ----------------------------------------------------------------
  // 7. EVENT DETAILS HANDLER
  // ----------------------------------------------------------------
  const onEventClick = (timetable) => {
    // Show timetable details in a drawer
    setDetailsTimetable(timetable);
    setDetailsDrawerVisible(true);
  };

  const closeDetailsDrawer = () => {
    setDetailsDrawerVisible(false);
    setDetailsTimetable(null);
  };

  // ----------------------------------------------------------------
  // 8. DELETE HANDLER
  // ----------------------------------------------------------------
  const onDeleteClick = (timetable) => {
    setEditingTimetable(timetable);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (editingTimetable) {
      setTimetables((prev) =>
        prev.filter((tt) => tt._id !== editingTimetable._id)
      );
    }
    setEditingTimetable(null);
    setDeleteModalVisible(false);
    closeDetailsDrawer();
    closeDrawer();
  };

  // ----------------------------------------------------------------
  // 9. MONTH VIEW: dateCellRender
  // ----------------------------------------------------------------
  const dateCellRender = (currentDayjs) => {
    // Convert Day.js to JS Date for date-fns
    const jsDate = currentDayjs.toDate();
    const dateString = format(jsDate, "yyyy-MM-dd");

    // Gather timetables that match this date
    const matched = timetables.flatMap((tt) => {
      if (tt.type !== "weekly") {
        // For exam/event, match date
        return tt.days
          ?.filter((d) => {
            if (!d.date) return false;
            const dayDateString = format(new Date(d.date), "yyyy-MM-dd");
            return dayDateString === dateString;
          })
          .map(() => tt);
      } else {
        // For weekly, match day of week (e.g., "Monday")
        const dayName = format(jsDate, "EEEE");
        const found = tt.days.find((d) => d.day === dayName);
        return found ? [tt] : [];
      }
    });

    const valid = matched.filter(Boolean);
    if (valid.length === 0) return null;

    return (
      <>
        {valid.map((evt) => (
          <div
            key={evt._id}
            className="my-1 cursor-pointer"
            onClick={() => onEventClick(evt)}
          >
            <Badge color={getColorByType(evt.type)} text={evt.name} />
          </div>
        ))}
      </>
    );
  };

  // ----------------------------------------------------------------
  // 10. DAY VIEW RENDER
  // ----------------------------------------------------------------
  const renderDayView = () => {
    const dayName = format(selectedDate, "EEEE");
    const dateString = format(selectedDate, "yyyy-MM-dd");

    // For weekly timetables, match by day name
    const weekly = timetables
      .filter((t) => t.type === "weekly")
      .flatMap((t) => {
        const found = t.days.find((d) => d.day === dayName);
        return found ? [t] : [];
      });

    // For exam/event timetables, match by date
    const others = timetables
      .filter((t) => t.type !== "weekly")
      .flatMap((t) => {
        const found = t.days.find((d) => {
          if (!d.date) return false;
          return format(new Date(d.date), "yyyy-MM-dd") === dateString;
        });
        return found ? [t] : [];
      });

    const allEvents = [...weekly, ...others];

    return (
      <div className="p-4">
        <h3 className="text-xl font-bold text-pink-600 mb-4">
          Day View — {format(selectedDate, "dd MMM yyyy")}
        </h3>
        {allEvents.length === 0 ? (
          <p className="text-gray-500">No events for this day.</p>
        ) : (
          allEvents.map((evt) => (
            <div
              key={evt._id}
              className="bg-white p-3 rounded shadow-sm mb-3 flex items-center justify-between cursor-pointer border-l-4"
              style={{ borderColor: getColorByType(evt.type) }}
              onClick={() => onEventClick(evt)}
            >
              <span className="font-medium">{evt.name}</span>
              <AiOutlineEdit className="text-gray-400" />
            </div>
          ))
        )}
      </div>
    );
  };

  // ----------------------------------------------------------------
  // 11. WEEK VIEW RENDER
  // ----------------------------------------------------------------
  const renderWeekView = () => {
    // Calculate Monday of the week from selectedDate
    const dayOfWeek = +format(selectedDate, "i"); // Monday = 1 in date-fns
    const monday = new Date(selectedDate);
    monday.setDate(monday.getDate() - (dayOfWeek - 1));

    // Create an array for the 7 days (Monday to Sunday)
    const daysInWeek = [...Array(7)].map((_, i) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      return day;
    });

    // For each day, gather events
    const getEventsForDate = (dateObj) => {
      const dayName = format(dateObj, "EEEE");
      const dateStr = format(dateObj, "yyyy-MM-dd");

      const weeklyList = timetables
        .filter((t) => t.type === "weekly")
        .flatMap((t) => {
          const found = t.days.find((d) => d.day === dayName);
          return found ? [t] : [];
        });

      const others = timetables
        .filter((t) => t.type !== "weekly")
        .flatMap((t) => {
          const found = t.days.find((d) => {
            if (!d.date) return false;
            return format(new Date(d.date), "yyyy-MM-dd") === dateStr;
          });
          return found ? [t] : [];
        });

      return [...weeklyList, ...others];
    };

    return (
      <div className="p-4">
        <h3 className="text-xl font-bold text-pink-600 mb-4">
          Week View ({format(daysInWeek[0], "dd MMM")} -{" "}
          {format(daysInWeek[6], "dd MMM")})
        </h3>
        <div className="grid grid-cols-7 gap-4">
          {daysInWeek.map((day) => {
            const events = getEventsForDate(day);
            return (
              <div
                key={day.toString()}
                className="bg-white rounded shadow-sm p-2"
              >
                <h4 className="font-semibold border-b pb-1 mb-2 text-gray-600">
                  {format(day, "EEE dd")}
                </h4>
                {events.length === 0 ? (
                  <p className="text-xs text-gray-400">No Timetable</p>
                ) : (
                  events.map((evt) => (
                    <div
                      key={evt._id}
                      className="bg-gray-50 p-2 mb-2 rounded cursor-pointer border-l-4"
                      style={{ borderColor: getColorByType(evt.type) }}
                      onClick={() => onEventClick(evt)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{evt.name}</span>
                        <AiOutlineEdit className="text-gray-400" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ----------------------------------------------------------------
  // 12. DOUGHNUT CHART DATA
  // ----------------------------------------------------------------
  const chartData = {
    labels: ["Weekly", "Exam", "Event", "Others"],
    datasets: [
      {
        data: [
          timetables.filter((t) => t.type === "weekly").length,
          timetables.filter((t) => t.type === "exam").length,
          timetables.filter((t) => t.type === "event").length,
          timetables.filter((t) => t.type === "others").length,
        ],
        backgroundColor: ["#FF99CC", "#29ABE2", "#77DD77", "#FFD700"],
        hoverBackgroundColor: ["#FF80B3", "#19A0D9", "#44CF44", "#FFC300"],
      },
    ],
  };

  // ----------------------------------------------------------------
  // 13. RENDER
  // ----------------------------------------------------------------
  return (
    <div className="w-full min-h-screen flex bg-gray-100">
      {/* MAIN SECTION */}
      <div className="flex-1 p-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-pink-600">
            Timetable Calendar
          </h2>
          <div className="space-x-2">
            <Radio.Group
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="mr-3"
            >
              <Radio.Button value="day">Day</Radio.Button>
              <Radio.Button value="week">Week</Radio.Button>
              <Radio.Button value="month">Month</Radio.Button>
            </Radio.Group>
            <Button
              type="primary"
              style={{ backgroundColor: "#FF69B4", borderColor: "#FF69B4" }}
              onClick={() => openDrawer(null)}
            >
              + Add Timetable
            </Button>
          </div>
        </div>

        {/* BODY */}
        {viewMode === "day" && (
          <div>
            <DayPicker
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            {renderDayView()}
          </div>
        )}
        {viewMode === "week" && (
          <div>
            <WeekPicker
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            {renderWeekView()}
          </div>
        )}
        {viewMode === "month" && (
          <Calendar
            value={dayjs(selectedDate)}
            onSelect={(dayjsObj) => setSelectedDate(dayjsObj.toDate())}
            dateCellRender={dateCellRender}
            className="bg-white shadow-sm border rounded-lg"
          />
        )}
      </div>

      {/* RIGHT SIDEBAR (STATS) */}
      <div className="w-72 border-l p-4 bg-white flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-pink-700 mb-3">
            Stats & Tasks
          </h3>
          {/* Quick Stats */}
          <div className="space-y-2 mb-6">
            <div className="bg-gray-100 rounded p-2 flex items-center justify-between">
              <span className="text-gray-700">Lectures</span>
              <Badge
                count={timetables.filter((t) => t.type === "weekly").length}
              />
            </div>
            <div className="bg-gray-100 rounded p-2 flex items-center justify-between">
              <span className="text-gray-700">Exams</span>
              <Badge
                count={timetables.filter((t) => t.type === "exam").length}
              />
            </div>
            <div className="bg-gray-100 rounded p-2 flex items-center justify-between">
              <span className="text-gray-700">Events</span>
              <Badge
                count={timetables.filter((t) => t.type === "event").length}
              />
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="bg-gray-100 rounded p-4 mb-4">
            <h4 className="text-pink-600 font-semibold mb-2 text-center">
              Timetable Types
            </h4>
            <Doughnut data={chartData} />
          </div>

          {/* Placeholder for daily goals */}
          <div className="bg-gray-100 rounded p-4">
            <h4 className="text-pink-600 font-semibold">Daily Goal</h4>
            <p className="text-sm text-gray-500">30% Done</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs mt-4">
          <p>&copy; 2025 Your LMS</p>
        </div>
      </div>

      {/* CREATE/EDIT DRAWER */}
      <Drawer
        title={editingTimetable ? "Edit Timetable" : "Create Timetable"}
        placement="right"
        width={400}
        visible={drawerVisible}
        onClose={closeDrawer}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input placeholder="e.g. Monday Lectures" />
          </Form.Item>

          <Form.Item label="Type" name="type">
            <Select>
              <Option value="weekly">Weekly</Option>
              <Option value="exam">Exam</Option>
              <Option value="event">Event</Option>
              <Option value="others">Others</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Validity (Start / End)"
            name="validity"
            rules={[{ required: true, message: "Please select a date range" }]}
          >
            <RangePicker />
          </Form.Item>

          <div className="flex justify-between mt-4">
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#FF69B4", borderColor: "#FF69B4" }}
            >
              {editingTimetable ? "Update" : "Save"}
            </Button>
            {editingTimetable && (
              <Button danger onClick={() => onDeleteClick(editingTimetable)}>
                <AiOutlineDelete className="mr-1" />
                Delete
              </Button>
            )}
          </div>
        </Form>
      </Drawer>

      {/* TIMETABLE DETAILS DRAWER */}
      <Drawer
        title="Timetable Details"
        placement="right"
        width={320}
        visible={detailsDrawerVisible}
        onClose={closeDetailsDrawer}
      >
        {detailsTimetable && (
          <>
            <div className="mb-4">
              <h4 className="font-semibold">Name:</h4>
              <p>{detailsTimetable.name}</p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold">Type:</h4>
              <p>{detailsTimetable.type}</p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold">Validity:</h4>
              <p>
                {detailsTimetable.validity.startDate} -{" "}
                {detailsTimetable.validity.endDate}
              </p>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button
                type="default"
                icon={<AiOutlineEdit />}
                style={{ borderColor: "#FF69B4", color: "#FF69B4" }}
                onClick={() => {
                  closeDetailsDrawer();
                  openDrawer(detailsTimetable);
                }}
              >
                Edit
              </Button>
              <Button
                danger
                icon={<AiOutlineDelete />}
                onClick={() => onDeleteClick(detailsTimetable)}
              >
                Delete
              </Button>
            </div>
          </>
        )}
      </Drawer>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        title="Confirm Deletion"
        visible={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okButtonProps={{ danger: true }}
        okText="Delete"
      >
        <p>Are you sure you want to delete this timetable?</p>
      </Modal>
    </div>
  );
}

// --------------------------------------------------------------------
// HELPER COMPONENTS
// --------------------------------------------------------------------
function DayPicker({ selectedDate, setSelectedDate }) {
  // Provide a mini date picker for user to select a day
  return (
    <div className="mb-2 flex items-center space-x-2">
      <span className="text-gray-600">Select Day:</span>
      <DatePicker
        value={dayjs(selectedDate)}
        onChange={(val) => {
          if (val) setSelectedDate(val.toDate());
        }}
        placeholder="Pick a day"
      />
      <Button onClick={() => setSelectedDate(new Date())}>Today</Button>
    </div>
  );
}

function WeekPicker({ selectedDate, setSelectedDate }) {
  // Provide a mini date picker to select any date within the desired week
  return (
    <div className="mb-2 flex items-center space-x-2">
      <span className="text-gray-600">Select Week:</span>
      <DatePicker
        value={dayjs(selectedDate)}
        onChange={(val) => {
          if (val) setSelectedDate(val.toDate());
        }}
        placeholder={`Week of ${format(selectedDate, "dd MMM yyyy")}`}
      />
      <Button onClick={() => setSelectedDate(new Date())}>This Week</Button>
    </div>
  );
}

function getColorByType(type) {
  switch (type) {
    case "weekly":
      return "#FF99CC"; // pinkish
    case "exam":
      return "#29ABE2"; // blue
    case "event":
      return "#77DD77"; // green
    case "others":
      return "#FFD700"; // gold
    default:
      return "#D3D3D3"; // default gray
  }
}
