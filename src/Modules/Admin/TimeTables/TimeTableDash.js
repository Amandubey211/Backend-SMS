import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Radio,
  Badge,
  Drawer,
  Button,
  Modal,
  Skeleton,
  Card,
  Tooltip,
  Tag,
  Divider,
} from "antd";
import { format, isWithinInterval } from "date-fns";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Doughnut } from "react-chartjs-2";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineFilter,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  CloseOutlined,
  CalendarOutlined,
  BookOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

// Chart.js core + plugin
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
// Timetable Thunks
import {
  fetchTimetableList,
  createTimetable as createTT,
  updateTimetable as updateTT,
  deleteTimetable as deleteTT,
} from "../../../Store/Slices/Admin/TimeTable/timetable.action";
// Additional Thunks
import { fetchSemestersByClass } from "../../../Store/Slices/Admin/Class/Semester/semesterThunks";
import { fetchAllClasses } from "../../../Store/Slices/Admin/Class/actions/classThunk";

// Child components
import TimeTableForm from "./Components/TimeTableForm";
dayjs.extend(isSameOrBefore);
ChartJS.register(ArcElement, ChartTooltip, Legend, ChartDataLabels);

dayjs.extend(isSameOrBefore);

// --------------------------------------------
// 1) Chart.js Register
// --------------------------------------------
ChartJS.register(ArcElement, ChartTooltip, Legend, ChartDataLabels);

// --------------------------------------------
// 2) Helper: getColorByType
// --------------------------------------------
function getColorByType(type) {
  switch (type) {
    case "weekly":
      return "#FF99CC"; // pinkish
    case "exam":
      return "#29ABE2"; // aqua
    case "event":
      return "#77DD77"; // green
    case "others":
      return "#FFD700"; // gold
    default:
      return "#D3D3D3";
  }
}

// --------------------------------------------
// 3) Helper: getIconForType
// --------------------------------------------
function getIconForType(type) {
  switch (type) {
    case "weekly":
      return <CalendarOutlined className="text-lg text-gray-800" />;
    case "exam":
      return <BookOutlined className="text-lg text-gray-800" />;
    case "event":
      return <CalendarOutlined className="text-lg text-gray-800" />;
    case "others":
      return <TeamOutlined className="text-lg text-gray-800" />;
    default:
      return null;
  }
}

// Helper to get a light background based on type
function getLightBgByType(type) {
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
}

// --------------------------------------------
// MAIN COMPONENT
// --------------------------------------------
export default function TimeTableDash() {
  const dispatch = useDispatch();

  // Redux store: Timetables
  const { timetables = [], loadingFetch } = useSelector(
    (store) => store?.admin?.timetable || {}
  );

  // On mount, fetch data
  useEffect(() => {
    dispatch(fetchTimetableList());
    dispatch(fetchAllClasses());
    dispatch(fetchSemestersByClass());
  }, [dispatch]);

  // Local state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [filterType, setFilterType] = useState(null);
  // Drawer states for create/edit
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);

  // For viewing details
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [detailsTimetable, setDetailsTimetable] = useState(null);

  // Deletion confirm
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // --------------------------------------------
  // 4) Open/Close Drawer for Create/Edit
  // --------------------------------------------
  const openDrawer = (timetable = null) => {
    setEditingTimetable(timetable);
    setDrawerVisible(true);
  };
  const closeDrawer = () => {
    setEditingTimetable(null);
    setDrawerVisible(false);
  };
  // Filter timetables based on selected type
  const filteredTimetables = useMemo(() => {
    if (!filterType) return timetables;
    return timetables.filter((tt) => tt.type === filterType);
  }, [timetables, filterType]);

  // Check if event is within validity period for weekly types
  const isWithinValidity = (timetable, currentDate) => {
    if (!timetable.validity) return true;
    const { startDate, endDate } = timetable.validity;
    if (!startDate || !endDate) return true;

    return isWithinInterval(currentDate, {
      start: new Date(startDate),
      end: new Date(endDate),
    });
  };
  // --------------------------------------------
  // 5) CREATE or UPDATE Timetable
  // --------------------------------------------
  const handleFormSubmit = (values, isEdit) => {
    if (isEdit && editingTimetable?._id) {
      dispatch(updateTT({ id: editingTimetable?._id, data: values })).then(
        () => {
          closeDrawer();
        }
      );
    } else {
      dispatch(createTT(values)).then(() => {
        closeDrawer();
      });
    }
  };

  // --------------------------------------------
  // 6) Show Timetable Details
  // --------------------------------------------
  const onEventClick = (timetable) => {
    setDetailsTimetable(timetable);
    setDetailsDrawerVisible(true);
  };
  const closeDetailsDrawer = () => {
    setDetailsDrawerVisible(false);
    setDetailsTimetable(null);
  };

  // --------------------------------------------
  // 7) Deletion
  // --------------------------------------------
  const onDeleteClick = (timetable) => {
    setEditingTimetable(timetable);
    setDeleteModalVisible(true);
  };
  const confirmDelete = () => {
    if (editingTimetable) {
      dispatch(deleteTT(editingTimetable?._id));
    }
    setEditingTimetable(null);
    setDeleteModalVisible(false);
    closeDetailsDrawer();
    closeDrawer();
  };

  // --------------------------------------------
  // 8) Month View: dateCellRender
  // --------------------------------------------

  const dateCellRender = (currentDayjs) => {
    const currentDate = currentDayjs.toDate();
    const dateString = currentDayjs.format("YYYY-MM-DD");

    const matched = filteredTimetables.flatMap((tt) => {
      if (tt.type === "weekly") {
        // Only show weekly timetables within their validity period
        if (!isWithinValidity(tt, currentDate)) return [];

        const dayName = currentDayjs.format("dddd");
        return tt.days?.find((d) => d.day === dayName) ? [tt] : [];
      } else {
        return tt.days?.find((d) => {
          if (!d.date) return false;
          const dStr = dayjs(d.date).format("YYYY-MM-DD");
          return dStr === dateString;
        })
          ? [tt]
          : [];
      }
    });

    if (matched.length === 0) return null;

    return (
      <div className="space-y-1">
        {matched.map((evt) => (
          <Tooltip
            key={evt._id}
            title={`${evt.name} (${evt.type})`}
            color={getColorByType(evt.type)}
            placement="bottom"
          >
            <div
              className="px-2 py-1 rounded text-white text-xs cursor-pointer truncate"
              style={{ backgroundColor: getColorByType(evt.type) }}
              onClick={() => onEventClick(evt)}
            >
              {evt.name}
            </div>
          </Tooltip>
        ))}
      </div>
    );
  };

  // --------------------------------------------
  // 9) Day View: Add Timeline
  // --------------------------------------------
  const renderDayView = () => {
    const dayName = format(selectedDate, "EEEE");
    const dateString = format(selectedDate, "yyyy-MM-dd");

    const events = timetables.filter((t) =>
      t?.days?.some(
        (d) => d?.date && format(new Date(d?.date), "yyyy-MM-dd") === dateString
      )
    );

    const slots = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      events: events.filter((e) =>
        e?.days.some((d) => {
          if (!d?.date) return false;
          const dateMatch =
            format(new Date(d?.date), "yyyy-MM-dd") === dateString;
          const slotMatch = d?.slots?.some((slot) => {
            const slotHour = new Date(slot.startTime).getHours();
            return slotHour === i;
          });
          return dateMatch && slotMatch;
        })
      ),
    }));

    return (
      <motion.div
        key="dayView"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
        className="p-4"
      >
        <h3 className="text-xl font-bold mb-4">
          Day View — {format(selectedDate, "dd MMM yyyy")}
        </h3>
        <div className="grid grid-cols-24 gap-2">
          {slots.map((slot) => (
            <div
              key={slot.hour}
              className="flex flex-col items-center p-2 border-t"
            >
              <div className="text-xs text-gray-500">{`${slot.hour}:00`}</div>
              {slot.events.length > 0 ? (
                slot.events.map((evt) => (
                  <div
                    key={evt?._id}
                    className="bg-blue-200 p-1 rounded mt-2 text-center"
                    style={{
                      backgroundColor: getColorByType(evt?.type),
                    }}
                    onClick={() => onEventClick(evt)}
                  >
                    {evt?.name}
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400">No events</div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  // --------------------------------------------
  // 10) Week View: Add Timeline
  // --------------------------------------------
  const renderWeekView = () => {
    const dayOfWeek = +format(selectedDate, "i");
    const monday = new Date(selectedDate);
    monday.setDate(monday.getDate() - (dayOfWeek - 1));

    const daysInWeek = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });

    // Generate time slots from 8 AM to 8 PM
    const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);

    return (
      <motion.div
        key="weekView"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        className="p-4"
      >
        <h3 className="text-xl font-bold mb-4">
          Week View ({format(daysInWeek[0], "dd MMM")} -{" "}
          {format(daysInWeek[6], "dd MMM")})
        </h3>

        <div className="flex">
          {/* Timeline Column */}
          <div className="w-16 mr-2">
            <div className="h-10 border-b"></div>
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b flex items-start justify-end pr-2 text-xs text-gray-500"
              >
                {`${hour}:00`}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex-1 grid grid-cols-7 gap-1">
            {/* Day headers */}
            {daysInWeek.map((day) => (
              <div
                key={day.toString()}
                className="text-center font-medium p-2 border-b"
              >
                {format(day, "EEE dd")}
              </div>
            ))}

            {/* Time slots */}
            {timeSlots.map((hour) => (
              <>
                {daysInWeek.map((day) => {
                  const dayString = format(day, "yyyy-MM-dd");
                  const events = filteredTimetables.filter((tt) => {
                    // For weekly timetables, check validity and day match
                    if (tt.type === "weekly") {
                      if (!isWithinValidity(tt, day)) return false;
                      return tt.days?.some(
                        (d) =>
                          d.day === format(day, "EEEE") &&
                          d.slots?.some(
                            (slot) =>
                              new Date(slot.startTime).getHours() === hour
                          )
                      );
                    }
                    // For dated events
                    return tt.days?.some(
                      (d) =>
                        d.date &&
                        format(new Date(d.date), "yyyy-MM-dd") === dayString &&
                        d.slots?.some(
                          (slot) => new Date(slot.startTime).getHours() === hour
                        )
                    );
                  });

                  return (
                    <div
                      key={`${dayString}-${hour}`}
                      className="h-16 border-b relative"
                    >
                      {events.map((evt) => (
                        <div
                          key={evt._id}
                          className="absolute top-0 left-0 right-0 bottom-0 m-1 rounded cursor-pointer flex items-center justify-center text-xs text-white text-center p-1"
                          style={{
                            backgroundColor: getColorByType(evt.type),
                            zIndex: 1,
                          }}
                          onClick={() => onEventClick(evt)}
                        >
                          {evt.name}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };
  // Updated Stats Section with clickable cards
  const renderStatsSection = () => {
    const stats = [
      { type: "weekly", label: "Weekly Timetables", color: "#FF99CC" },
      { type: "exam", label: "Exams", color: "#29ABE2" },
      { type: "event", label: "Events", color: "#77DD77" },
      { type: "others", label: "Others", color: "#FFD700" },
    ];

    return (
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Filter by Type:</h4>
          {filterType && (
            <Button
              size="small"
              icon={<AiOutlineFilter />}
              onClick={() => setFilterType(null)}
            >
              Clear Filter
            </Button>
          )}
        </div>

        {stats.map((stat) => (
          <Card
            key={stat.type}
            className={`p-2 cursor-pointer transition-all ${
              filterType === stat.type ? "ring-2 ring-offset-2" : ""
            }`}
            style={{
              borderLeft: `6px solid ${stat.color}`,
              transform: filterType === stat.type ? "scale(1.02)" : "scale(1)",
            }}
            onClick={() => setFilterType(stat.type)}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{stat.label}</span>
              <Badge
                count={timetables.filter((t) => t.type === stat.type).length}
                style={{ backgroundColor: stat.color }}
              />
            </div>
          </Card>
        ))}
      </div>
    );
  };
  // --------------------------------------------
  // 11) Doughnut Chart
  // --------------------------------------------
  const chartData = {
    labels: ["Weekly", "Exam", "Event", "Others"],
    datasets: [
      {
        data: [
          timetables.filter((t) => t?.type === "weekly").length,
          timetables.filter((t) => t?.type === "exam").length,
          timetables.filter((t) => t?.type === "event").length,
          timetables.filter((t) => t?.type === "others").length,
        ],
        backgroundColor: ["#FF99CC", "#29ABE2", "#77DD77", "#FFD700"],
        borderColor: "#fff",
        borderWidth: 4,
        hoverOffset: 20,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    cutout: "50%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
      datalabels: {
        color: "#fff",
        display: false,
      },
    },
  };

  // --------------------------------------------
  // 12) Render
  // --------------------------------------------
  return (
    <div className="w-full min-h-screen flex ">
      {/* MAIN SECTION */}
      <div className="flex-1 p-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Timetable Calendar
          </h2>
          <div className="space-x-2 flex items-center">
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
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold border-none hover:opacity-90"
              onClick={() => openDrawer(null)}
            >
              + Add Timetable
            </Button>
          </div>
        </div>

        {/* BODY with Skeleton for loading */}
        {loadingFetch ? (
          <Skeleton active paragraph={{ rows: 12 }} />
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "day" && (
              <>
                <DayPicker
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
                {renderDayView()}
              </>
            )}
            {viewMode === "week" && (
              <>
                <WeekPicker
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
                {renderWeekView()}
              </>
            )}
            {viewMode === "month" && (
              <motion.div
                key="monthView"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <Calendar
                  value={dayjs(selectedDate)}
                  onSelect={(dayjsObj) => setSelectedDate(dayjsObj?.toDate())}
                  dateCellRender={dateCellRender}
                  className="bg-white shadow-sm border rounded-lg px-2"
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
      {/* RIGHT SIDEBAR (STATS) */}
      <div className="w-72 border-l p-4 bg-white flex flex-col justify-between">
        {loadingFetch ? (
          <Skeleton active title paragraph={{ rows: 4 }} />
        ) : (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-3">Stats & Filters</h3>
              {renderStatsSection()}
              <Divider />
              <div className="border rounded p-4 mb-4">
                <h4 className="font-semibold mb-2 text-center">
                  Timetable Types
                </h4>
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            </div>
          </>
        )}
      </div>
      {/* CREATE/EDIT DRAWER FORM */}
      <Drawer
        title={
          <div className="flex items-center justify-between w-full">
            <span className="text-xl font-semibold">
              {editingTimetable ? "Edit Timetable" : "Create Timetable"}
            </span>
            <Button
              type="text"
              onClick={closeDrawer}
              icon={<CloseOutlined style={{ fontSize: "16px" }} />}
            />
          </div>
        }
        placement="right"
        closable={false}
        width={"90%"}
        open={drawerVisible}
        onClose={closeDrawer}
        zIndex={1000}
      >
        {drawerVisible && (
          <motion.div
            key="timetableForm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TimeTableForm
              editingTimetable={editingTimetable}
              onSubmit={handleFormSubmit}
              onClose={closeDrawer}
            />
          </motion.div>
        )}
      </Drawer>
      {/* TIMETABLE DETAILS DRAWER */}
      <Drawer
        title="Timetable Details"
        placement="right"
        width={"90%"}
        open={detailsDrawerVisible}
        onClose={closeDetailsDrawer}
        zIndex={1000}
      >
        <div className="h-full flex flex-col capitalize">
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence>
              {detailsTimetable && (
                <motion.div
                  key="detailsDrawer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Title and Big Icon container in body */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-2xl text-gray-900">
                      {detailsTimetable?.name || "Untitled Timetable"}
                    </h4>
                    <div className="flex flex-col items-center">
                      <div
                        className="w-16 h-16 flex items-center justify-center rounded mb-1"
                        style={{
                          backgroundColor: getLightBgByType(
                            detailsTimetable?.type
                          ),
                        }}
                      >
                        <div className="text-4xl text-gray-800">
                          {getIconForType(detailsTimetable?.type)}
                        </div>
                      </div>
                      <span className="text-sm text-gray-700">
                        {detailsTimetable?.type?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </div>
                  </div>

                  {/* Class Section - Group Organization */}
                  <div>
                    {/* Class */}
                    <h5 className="text-gray-600 text-sm">Class:</h5>
                    <div className="mt-1 space-x-1">
                      {detailsTimetable?.classId ? (
                        <Tag color="blue">
                          {detailsTimetable?.classId?.className ||
                            "No Class Name"}
                        </Tag>
                      ) : (
                        <Tag color="blue">No Class</Tag>
                      )}
                    </div>

                    {/* Sections */}
                    <h5 className="text-gray-600 text-sm mt-4">Sections:</h5>
                    <div className="mt-1 space-x-1">
                      {detailsTimetable?.sectionId?.length > 0 ? (
                        detailsTimetable?.sectionId.map((section) => (
                          <Tag key={section?._id} color="purple">
                            {section?.sectionName || "No Section Name"}
                          </Tag>
                        ))
                      ) : (
                        <Tag color="purple">No Sections</Tag>
                      )}
                    </div>

                    {/* Groups */}
                    <h5 className="text-gray-600 text-sm mt-4">Groups:</h5>
                    <div className="mt-1 space-x-1">
                      {detailsTimetable?.groupId?.length > 0 ? (
                        detailsTimetable?.groupId.map((group) => (
                          <Tag key={group?._id} color="cyan">
                            {group?.groupName || "No Group Name"}
                          </Tag>
                        ))
                      ) : (
                        <Tag color="cyan">No Groups</Tag>
                      )}
                    </div>
                  </div>

                  {/* Status Tag */}
                  <div>
                    <h5 className="text-gray-600 text-sm">Status:</h5>
                    <Tag
                      color={
                        detailsTimetable?.status === "active" ? "green" : "red"
                      }
                      className="mt-1"
                    >
                      {detailsTimetable?.status || "inactive"}
                    </Tag>
                  </div>

                  {/* Semester */}
                  <div>
                    <h5 className="text-gray-600 text-sm">Semester:</h5>
                    <p className="text-sm text-gray-800">
                      {detailsTimetable?.semesterId?.title || "No Semester"}
                    </p>
                  </div>

                  {/* Schedule - Rendered as a table */}
                  {detailsTimetable?.days &&
                    detailsTimetable?.days?.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-800 mt-4">
                          Schedule:
                        </h5>
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                Day
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                Time
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                Subject
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {detailsTimetable?.days?.map((dayItem) =>
                              dayItem?.slots && dayItem?.slots?.length > 0 ? (
                                dayItem?.slots?.map((slot) => (
                                  <tr key={slot?._id}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                      {dayItem?.date
                                        ? format(
                                            new Date(dayItem?.date),
                                            "dd MMM yyyy"
                                          )
                                        : dayItem?.day || "Day Not Specified"}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                      {dayjs(slot?.startTime).format("HH:mm")} -{" "}
                                      {dayjs(slot?.endTime).format("HH:mm")}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                      {slot?.subjectId
                                        ? slot?.subjectId?.name || "No Subject"
                                        : slot?.eventName || "No Event Name"}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr key={dayItem?._id}>
                                  <td
                                    className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"
                                    colSpan={3}
                                  >
                                    {dayItem?.date
                                      ? format(
                                          new Date(dayItem?.date),
                                          "dd MMM yyyy"
                                        )
                                      : dayItem?.day ||
                                        "Day Not Specified"}{" "}
                                    - No slots available.
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                  {/* "Available From" & "Due Date" */}
                  <div className="flex items-center space-x-2">
                    <Card
                      className="flex-1 border p-2 rounded"
                      style={{ backgroundColor: "#f7f7f7" }}
                    >
                      <p className="text-sm text-gray-500">Available From :</p>
                      <p className="text-sm text-gray-800 font-semibold">
                        {detailsTimetable?.validity?.startDate
                          ? format(
                              new Date(detailsTimetable?.validity?.startDate),
                              "M/d/yyyy"
                            )
                          : "N/A"}
                      </p>
                    </Card>
                    <Card
                      className="flex-1 border p-2 rounded"
                      style={{ backgroundColor: "#f7f7f7" }}
                    >
                      <p className="text-sm text-gray-500">Due Date :</p>
                      <p className="text-sm text-gray-800 font-semibold">
                        {detailsTimetable?.validity?.endDate
                          ? format(
                              new Date(detailsTimetable?.validity?.endDate),
                              "M/d/yyyy"
                            )
                          : "No End Date"}
                      </p>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Sticky Footer for Edit and Delete */}
          <div className="sticky bottom-0 bg-white py-4 border-t">
            <div className="flex space-x-2 justify-center">
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
          </div>
        </div>
      </Drawer>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        title="Confirm Deletion"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okButtonProps={{ danger: true }}
        okText="Delete"
        zIndex={2000}
      >
        <p>Are you sure you want to delete this timetable?</p>
      </Modal>
    </div>
  );
}

// --------------------------------------------------------------------
// HELPER COMPONENTS: DayPicker & WeekPicker
// --------------------------------------------------------------------
function DayPicker({ selectedDate, setSelectedDate }) {
  return (
    <div className="mb-2 flex items-center space-x-2">
      <span className="text-gray-600">Select Day:</span>
      <input
        type="date"
        className="border rounded px-2 py-1"
        value={format(selectedDate, "yyyy-MM-dd")}
        onChange={(e) => {
          const newDate = e.target.value
            ? new Date(e.target.value)
            : new Date();
          setSelectedDate(newDate);
        }}
      />
      <Button onClick={() => setSelectedDate(new Date())}>Today</Button>
    </div>
  );
}

function WeekPicker({ selectedDate, setSelectedDate }) {
  return (
    <div className="mb-2 flex items-center space-x-2">
      <span className="text-gray-600">Select Week:</span>
      <input
        type="date"
        className="border rounded px-2 py-1"
        value={format(selectedDate, "yyyy-MM-dd")}
        onChange={(e) => {
          const newDate = e.target.value
            ? new Date(e.target.value)
            : new Date();
          setSelectedDate(newDate);
        }}
      />
      <Button onClick={() => setSelectedDate(new Date())}>This Week</Button>
    </div>
  );
}
