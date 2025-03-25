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
  Popover,
  Space,
  Row,
  Col,
  Select,
} from "antd";
import { format, isWithinInterval, addDays, subDays, parseISO } from "date-fns";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Doughnut } from "react-chartjs-2";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineFilter,
  AiOutlinePrinter,
  AiOutlineFilePdf,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  CloseOutlined,
  CalendarOutlined,
  BookOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
import {
  fetchGroupsByClass,
  fetchGroupsByClassAndSection,
  fetchSectionsNamesByClass,
} from "../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchSubjects } from "../../../Store/Slices/Admin/Class/Subject/subjectThunks";
// Child components
import TimeTableForm from "./Components/TimeTableForm";

dayjs.extend(isSameOrBefore);
ChartJS.register(ArcElement, ChartTooltip, Legend, ChartDataLabels);

// --------------------------------------------
// 1) Helper: getColorByType
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
// 2) Helper: getIconForType
// --------------------------------------------
function getIconForType(type) {
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

  // Local state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [filterType, setFilterType] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Drawer states for create/edit
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [filters, setFilters] = useState({
    class: null,
    section: null,
    group: null,
    subject: null,
    semester: null,
  });
  // For viewing details
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [detailsTimetable, setDetailsTimetable] = useState(null);

  // Deletion confirm
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // --------------------------------------------
  // 3) Navigation helpers
  // --------------------------------------------
  const navigateToToday = () => setSelectedDate(new Date());

  const navigateToPrevious = () => {
    if (viewMode === "day") {
      setSelectedDate(subDays(selectedDate, 1));
    } else if (viewMode === "week") {
      setSelectedDate(subDays(selectedDate, 7));
    } else {
      setSelectedDate(subDays(selectedDate, 30));
    }
  };

  const navigateToNext = () => {
    if (viewMode === "day") {
      setSelectedDate(addDays(selectedDate, 1));
    } else if (viewMode === "week") {
      setSelectedDate(addDays(selectedDate, 7));
    } else {
      setSelectedDate(addDays(selectedDate, 30));
    }
  };

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
  // 8) Export Functions
  // --------------------------------------------
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Timetable Report", 105, 15, { align: "center" });

    // Add date range
    doc.setFontSize(12);
    doc.text(`Date: ${format(new Date(), "MMMM dd, yyyy")}`, 14, 25);

    // Prepare data for the table
    const tableData = timetables.flatMap((timetable) =>
      timetable.days.flatMap(
        (day) =>
          day.slots?.map((slot) => ({
            type: timetable.type,
            name: timetable.name,
            day:
              day.day ||
              (day.date ? format(new Date(day.date), "EEEE") : "Weekly"),
            date: day.date
              ? format(new Date(day.date), "dd MMM yyyy")
              : "Weekly",
            time: `${
              dayjs(slot.startTime).isValid()
                ? dayjs(slot.startTime).format("HH:mm")
                : "N/A"
            } - ${
              dayjs(slot.endTime).isValid()
                ? dayjs(slot.endTime).format("HH:mm")
                : "N/A"
            }`,
            subject: slot.subjectId?.name || slot.eventName || "N/A",
            teacher: slot.teacherId?.name || "N/A",
          })) || []
      )
    );

    // Add table
    doc.autoTable({
      head: [["Type", "Name", "Day", "Date", "Time", "Subject", "Teacher"]],
      body: tableData.map((item) => [
        item.type,
        item.name,
        item.day,
        item.date,
        item.time,
        item.subject,
        item.teacher,
      ]),
      startY: 30,
      styles: {
        cellPadding: 2,
        fontSize: 8,
        valign: "middle",
      },
      headStyles: {
        fillColor: [41, 171, 226],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 30 },
        6: { cellWidth: 30 },
      },
    });

    doc.save("timetable-report.pdf");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    // Prepare the table rows
    const tableRows = timetables
      .flatMap((timetable) =>
        timetable.days.flatMap(
          (day) =>
            day.slots?.map((slot) => {
              const startTime = dayjs(slot.startTime).isValid()
                ? dayjs(slot.startTime).format("HH:mm")
                : "N/A";
              const endTime = dayjs(slot.endTime).isValid()
                ? dayjs(slot.endTime).format("HH:mm")
                : "N/A";

              return `
              <tr>
                <td>${timetable.type}</td>
                <td>${timetable.name}</td>
                <td>${
                  day.day ||
                  (day.date ? format(new Date(day.date), "EEEE") : "Weekly")
                }</td>
                <td>${
                  day.date
                    ? format(new Date(day.date), "dd MMM yyyy")
                    : "Weekly"
                }</td>
                <td>${startTime} - ${endTime}</td>
                <td>${slot.subjectId?.name || slot.eventName || "N/A"}</td>
                <td>${slot.teacherId?.name || "N/A"}</td>
              </tr>
            `;
            }) || []
        )
      )
      .join("");

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Timetable Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; margin-bottom: 20px; }
            .report-date { text-align: right; margin-bottom: 20px; font-size: 14px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #29ABE2; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Timetable Report</h1>
          <div class="report-date">Generated on: ${format(
            new Date(),
            "MMMM dd, yyyy"
          )}</div>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Day</th>
                <th>Date</th>
                <th>Time</th>
                <th>Subject</th>
                <th>Teacher</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 8px 16px; background-color: #29ABE2; color: white; border: none; border-radius: 4px; cursor: pointer;">Print</button>
            <button onclick="window.close()" style="padding: 8px 16px; margin-left: 10px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
          </div>
          <script>
            // Auto-print when window loads
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 200);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };
  // Fetch data on mount and when filters change
  useEffect(() => {
    dispatch(fetchTimetableList());
    dispatch(fetchAllClasses());
  }, [dispatch]);
  // Fetch sections,subjects,semesters when class is selected
  useEffect(() => {
    if (filters.class) {
      console.log(filters, "filtersfilters");
      dispatch(fetchSectionsNamesByClass(filters.class));
      dispatch(fetchSemestersByClass(filters.class));
      dispatch(fetchSubjects(filters.class));
    } else {
      dispatch(fetchSectionsNamesByClass(null));
      dispatch(fetchSemestersByClass(null));
      dispatch(fetchSubjects(null));
    }
  }, [dispatch, filters.class]);

  // Fetch groups when class or section changes
  useEffect(() => {
    if (filters.class && filters.section) {
      dispatch(fetchGroupsByClassAndSection(filters.class, filters.section));
    } else if (filters.class) {
      dispatch(fetchGroupsByClass(filters.class));
    } else {
      dispatch(fetchGroupsByClass(null));
    }
  }, [dispatch, filters.class, filters.section]);
  // Filter timetables based on selected filters
  const filteredTimetables = useMemo(() => {
    let result = timetables;

    // Filter by type if selected
    if (filterType) {
      result = result.filter((tt) => tt.type === filterType);
    }

    // Apply other filters
    if (filters.class) {
      result = result.filter((tt) => tt.classId?._id === filters.class);
    }
    if (filters.section) {
      result = result.filter((tt) =>
        tt.sectionId?.some((section) => section._id === filters.section)
      );
    }
    if (filters.group) {
      result = result.filter((tt) =>
        tt.groupId?.some((group) => group._id === filters.group)
      );
    }
    if (filters.subject) {
      result = result.filter((tt) =>
        tt.days?.some((day) =>
          day.slots?.some((slot) => slot.subjectId?._id === filters.subject)
        )
      );
    }
    if (filters.semester) {
      result = result.filter((tt) => tt.semesterId?._id === filters.semester);
    }

    return result;
  }, [timetables, filterType, filters]);
  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [filterName]: value };

      // Reset dependent filters when parent filter changes
      if (filterName === "class") {
        newFilters.section = null;
        newFilters.group = null;
      } else if (filterName === "section") {
        newFilters.group = null;
      }

      return newFilters;
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      class: null,
      section: null,
      group: null,
      subject: null,
      semester: null,
    });
    setFilterType(null);
  };
  // --------------------------------------------
  // 9) Month View: dateCellRender
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

    // Calculate event density for color intensity
    const density = Math.min(matched.length / 3, 1);
    const bgColor = `rgba(66, 153, 225, ${0.2 + density * 0.3})`;

    return (
      <div className="space-y-1">
        <div
          className="absolute top-1 right-1 w-2 h-2 rounded-full"
          style={{ backgroundColor: bgColor }}
        />
        {matched.slice(0, 3).map((evt) => {
          const firstSlot = evt.days?.find(
            (d) =>
              d.day === currentDayjs.format("dddd") ||
              (d.date && dayjs(d.date).format("YYYY-MM-DD") === dateString)
                ?.slots?.[0]
          );
          const displayText =
            firstSlot?.subjectId?.name || firstSlot?.eventName || evt.name;

          return (
            <Tooltip
              key={evt._id}
              title={`${displayText} (${evt.type})`}
              color={getColorByType(evt.type)}
              placement="bottom"
            >
              <div
                className="px-2 py-1 rounded text-white text-xs cursor-pointer truncate"
                style={{
                  backgroundColor: getColorByType(evt.type),
                  fontSize: "10px",
                  lineHeight: "1.2",
                  padding: "2px 4px",
                  marginBottom: "2px",
                }}
                onClick={() => onEventClick(evt)}
              >
                {displayText}
              </div>
            </Tooltip>
          );
        })}
        {matched.length > 3 && (
          <Badge
            count={`+${matched.length - 3}`}
            style={{
              backgroundColor: "#666",
              fontSize: "10px",
              padding: "0 4px",
              lineHeight: "16px",
              height: "16px",
            }}
          />
        )}
      </div>
    );
  };

  // --------------------------------------------
  // 10) Day View: Add Timeline
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
        className="p-4 overflow-x-auto"
      >
        <h3 className="text-xl font-bold mb-4">
          {format(selectedDate, "EEEE, dd MMM yyyy")}
        </h3>
        <div className="flex">
          {/* Timeline Column */}
          <div className="w-16 flex-shrink-0">
            {slots.map((slot) => (
              <div
                key={slot.hour}
                className="h-16 border-b flex items-center justify-end pr-2 text-sm text-gray-500"
              >
                {`${slot.hour}:00`}
              </div>
            ))}
          </div>

          {/* Events Column */}
          <div className="flex-1 min-w-0">
            {slots.map((slot) => (
              <div key={slot.hour} className="h-16 border-b relative">
                {slot.events.map((evt) => {
                  const dayData = evt.days.find(
                    (d) =>
                      d.date &&
                      format(new Date(d.date), "yyyy-MM-dd") === dateString
                  );
                  const slotData = dayData?.slots?.find(
                    (s) => new Date(s.startTime).getHours() === slot.hour
                  );

                  const displayText =
                    slotData?.subjectId?.name ||
                    slotData?.eventName ||
                    evt.name;

                  return (
                    <div
                      key={evt?._id}
                      className="absolute top-1 left-1 right-1 bottom-1 p-1 rounded cursor-pointer flex flex-col"
                      style={{
                        backgroundColor: getColorByType(evt?.type),
                      }}
                      onClick={() => onEventClick(evt)}
                    >
                      <div className="text-white text-xs font-medium truncate">
                        {displayText}
                      </div>
                      <div className="text-white text-xxs mt-auto">
                        {dayjs(slotData?.startTime).isValid()
                          ? dayjs(slotData?.startTime).format("HH:mm")
                          : "N/A"}{" "}
                        -{" "}
                        {dayjs(slotData?.endTime).isValid()
                          ? dayjs(slotData?.endTime).format("HH:mm")
                          : "N/A"}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // --------------------------------------------
  // 11) Week View: Add Timeline
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
        className="p-4 overflow-x-auto"
      >
        <h3 className="text-xl font-bold mb-4">
          Week of {format(daysInWeek[0], "dd MMM")} -{" "}
          {format(daysInWeek[6], "dd MMM")}
        </h3>

        <div className="flex min-w-max">
          {/* Timeline Column */}
          <div className="w-16 mr-2 flex-shrink-0">
            <div className="h-10 border-b"></div>
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b flex items-start justify-end pr-2 text-sm text-gray-500"
              >
                {`${hour}:00`}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex-1 grid grid-cols-7 gap-1 min-w-max">
            {/* Day headers */}
            {daysInWeek.map((day) => {
              const dayEvents = filteredTimetables.filter((tt) => {
                const dayString = format(day, "yyyy-MM-dd");
                if (tt.type === "weekly") {
                  if (!isWithinValidity(tt, day)) return false;
                  return tt.days?.some((d) => d.day === format(day, "EEEE"));
                }
                return tt.days?.some(
                  (d) =>
                    d.date &&
                    format(new Date(d.date), "yyyy-MM-dd") === dayString
                );
              });

              // Calculate event density for the day
              const density = Math.min(dayEvents.length / 5, 1);
              const bgColor = `rgba(66, 153, 225, ${0.2 + density * 0.3})`;

              return (
                <div
                  key={day.toString()}
                  className="text-center font-medium p-2 border-b relative"
                >
                  <div
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: bgColor }}
                  />
                  {format(day, "EEE dd")}
                </div>
              );
            })}

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
                      {events.map((evt) => {
                        const dayData = evt.days.find(
                          (d) =>
                            d.day === format(day, "EEEE") ||
                            (d.date &&
                              format(new Date(d.date), "yyyy-MM-dd") ===
                                dayString)
                        );
                        const slotData = dayData?.slots?.find(
                          (s) => new Date(s.startTime).getHours() === hour
                        );

                        const displayText =
                          slotData?.subjectId?.name ||
                          slotData?.eventName ||
                          evt.name;

                        return (
                          <div
                            key={evt._id}
                            className="absolute top-1 left-1 right-1 bottom-1 rounded cursor-pointer flex flex-col p-1"
                            style={{
                              backgroundColor: getColorByType(evt.type),
                              zIndex: 1,
                            }}
                            onClick={() => onEventClick(evt)}
                          >
                            <div className="text-white text-xs font-medium truncate">
                              {displayText}
                            </div>
                            <div className="text-white text-xxs mt-auto">
                              {slotData &&
                                `${
                                  dayjs(slotData.startTime).isValid()
                                    ? dayjs(slotData.startTime).format("HH:mm")
                                    : "N/A"
                                } - ${
                                  dayjs(slotData.endTime).isValid()
                                    ? dayjs(slotData.endTime).format("HH:mm")
                                    : "N/A"
                                }`}
                            </div>
                          </div>
                        );
                      })}
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

  // --------------------------------------------
  // 12) Stats Section with compact cards
  // --------------------------------------------
  const renderStatsSection = () => {
    const stats = [
      {
        type: "weekly",
        label: "Weekly",
        icon: <CalendarOutlined />,
        color: "#FF99CC",
      },
      {
        type: "exam",
        label: "Exams",
        icon: <BookOutlined />,
        color: "#29ABE2",
      },
      {
        type: "event",
        label: "Events",
        icon: <CalendarOutlined />,
        color: "#77DD77",
      },
      {
        type: "others",
        label: "Others",
        icon: <TeamOutlined />,
        color: "#FFD700",
      },
    ];

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-normal text-sm">Filter by Type:</h4>
          {filterType && (
            <Button
              size="small"
              icon={<AiOutlineFilter />}
              onClick={() => setFilterType(null)}
              style={{ padding: "0 8px" }}
            >
              Clear
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {stats.map((stat) => {
            const count = timetables.filter((t) => t.type === stat.type).length;
            return (
              <Card
                key={stat.type}
                className={`cursor-pointer transition-all ${
                  filterType === stat.type ? "ring-2 ring-offset-4" : ""
                }`}
                style={{
                  borderLeft: `4px solid ${stat.color}`,
                  transform:
                    filterType === stat.type ? "scale(1.02)" : "scale(1)",
                  height: "60px", // Reduced height
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                onClick={() => setFilterType(stat.type)}
                bodyStyle={{ padding: "8px" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded mr-2" // Smaller icon container
                      style={{ backgroundColor: getLightBgByType(stat.type) }}
                    >
                      {React.cloneElement(stat.icon, { className: "text-sm" })}{" "}
                    </div>
                    <span className="text-xs">{stat.label}</span>
                  </div>
                  <Badge
                    count={count}
                    style={{
                      backgroundColor: stat.color,
                      fontSize: "17px", // Smaller font
                      height: "25px", // Smaller badge
                      minWidth: "25px",
                      lineHeight: "24px",
                    }}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // --------------------------------------------
  // 13) Doughnut Chart
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
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
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
  // 14) Legend Component
  // --------------------------------------------
  const renderLegend = () => {
    const types = [
      { type: "weekly", label: "Weekly Timetables", color: "#FF99CC" },
      { type: "exam", label: "Exams", color: "#29ABE2" },
      { type: "event", label: "Events", color: "#77DD77" },
      { type: "others", label: "Others", color: "#FFD700" },
    ];

    return (
      <div className="mb-4">
        <h4 className="font-medium mb-2">Legend</h4>
        <div className="grid grid-cols-2 gap-2">
          {types.map((item) => (
            <div
              key={item.type}
              className="flex items-center cursor-pointer"
              onClick={() => setFilterType(item.type)}
            >
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --------------------------------------------
  // 15) Navigation Controls
  // --------------------------------------------
  const renderNavigationControls = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <Button icon={<ArrowLeftOutlined />} onClick={navigateToPrevious} />

        <Button type="text" onClick={navigateToToday}>
          Today
        </Button>

        <Button icon={<ArrowRightOutlined />} onClick={navigateToNext} />
      </div>
    );
  };

  // --------------------------------------------
  // 16) Empty State
  // --------------------------------------------
  const renderEmptyState = () => {
    if (timetables.length > 0) return null;

    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">No timetables found</div>
        <Button
          type="primary"
          onClick={() => openDrawer(null)}
          className="bg-blue-500"
        >
          Create Your First Timetable
        </Button>
      </div>
    );
  };

  // --------------------------------------------
  // 17) Render
  // --------------------------------------------
  return (
    <div className="w-full min-h-screen flex">
      {/* MAIN SECTION */}
      <div
        className={`flex-1 p-4 transition-all ${
          sidebarCollapsed ? "mr-0" : "mr-72"
        }`}
      >
        {/* HEADER */}
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                type="default"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="md:hidden"
                icon={<AiOutlineFilter />}
              >
                {sidebarCollapsed ? "Show Stats" : "Hide Stats"}
              </Button>

              <Radio.Group
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="mr-3"
                buttonStyle="solid"
              >
                <Radio.Button value="day">Day</Radio.Button>
                <Radio.Button value="week">Week</Radio.Button>
                <Radio.Button value="month">Month</Radio.Button>
              </Radio.Group>

              <Space>
                <Popover
                  content={
                    <div className="flex flex-col">
                      <Button
                        icon={<AiOutlineFilePdf />}
                        onClick={handleExportPDF}
                        className="mb-2"
                      >
                        Export as PDF
                      </Button>
                      <Button icon={<AiOutlinePrinter />} onClick={handlePrint}>
                        Print
                      </Button>
                    </div>
                  }
                  trigger="click"
                  placement="bottomRight"
                >
                  <Button>Export</Button>
                </Popover>
                <Button
                  type="primary"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold border-none hover:opacity-90"
                  onClick={() => openDrawer(null)}
                >
                  + Add Timetable
                </Button>
              </Space>
            </div>
          </div>

          {/* FILTER ROW */}
          <div className="flex flex-wrap gap-2 items-center">
            <Select
              placeholder="Select Class"
              style={{ width: 180 }}
              value={filters.class}
              onChange={(value) => handleFilterChange("class", value)}
              options={classList.map((c) => ({
                value: c._id,
                label: c.className,
              }))}
              allowClear
            />

            <Select
              placeholder="Select Section"
              style={{ width: 180 }}
              value={filters.section}
              onChange={(value) => handleFilterChange("section", value)}
              options={sectionList.map((s) => ({
                value: s._id,
                label: s.sectionName,
              }))}
              disabled={!filters.class}
              allowClear
            />

            <Select
              placeholder="Select Group"
              style={{ width: 180 }}
              value={filters.group}
              onChange={(value) => handleFilterChange("group", value)}
              options={groupsList.map((g) => ({
                value: g._id,
                label: g.groupName,
              }))}
              disabled={!filters.class}
              allowClear
            />

            <Select
              placeholder="Select Subject"
              style={{ width: 180 }}
              value={filters.subjectName}
              onChange={(value) => handleFilterChange("subjectName", value)}
              options={allSubjects.map((s) => ({
                value: s._id,
                label: s.subjectName,
              }))}
              allowClear
            />

            <Select
              placeholder="Select Semester"
              style={{ width: 180 }}
              value={filters.semester}
              onChange={(value) => handleFilterChange("semester", value)}
              options={reduxSemesters.map((s) => ({
                value: s._id,
                label: s.title,
              }))}
              allowClear
            />

            <Button
              type="text"
              danger
              onClick={clearAllFilters}
              disabled={
                !filters.class &&
                !filters.section &&
                !filters.group &&
                !filters.subject &&
                !filters.semester &&
                !filterType
              }
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Navigation Controls */}
        {renderNavigationControls()}

        {/* BODY with Skeleton for loading */}
        {loadingFetch ? (
          <Skeleton active paragraph={{ rows: 12 }} />
        ) : (
          <>
            {renderEmptyState()}
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
          </>
        )}
      </div>

      {/* RIGHT SIDEBAR (STATS) */}
      {!sidebarCollapsed && (
        <div className="w-72 border-l p-4 bg-white flex flex-col justify-between fixed right-0 h-full overflow-y-auto">
          {loadingFetch ? (
            <Skeleton active title paragraph={{ rows: 4 }} />
          ) : (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Stats & Filters</h3>
                {/* {renderLegend()} */}
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
      )}

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
                                      {dayjs(slot?.startTime).isValid()
                                        ? dayjs(slot?.startTime).format("HH:mm")
                                        : "N/A"}{" "}
                                      -{" "}
                                      {dayjs(slot?.endTime).isValid()
                                        ? dayjs(slot?.endTime).format("HH:mm")
                                        : "N/A"}
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
        className="border rounded px-2 py-1 text-sm"
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
        className="border rounded px-2 py-1 text-sm"
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
