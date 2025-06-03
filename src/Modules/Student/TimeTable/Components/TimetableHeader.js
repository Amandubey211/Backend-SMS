import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Radio, Button, Popover, Tabs, message } from "antd";
import {
  AiOutlineFilter,
  AiOutlineFilePdf,
  AiOutlinePrinter,
} from "react-icons/ai";
import { format, isWithinInterval, parseISO } from "date-fns";
import NavigationControls from "../../../Admin/TimeTables/Components/NavigationControls";
import MainSection from "./MainSection";
import { fetchStudentTimetable } from "../../../../Store/Slices/Student/TimeTable/studentTimeTable.action";
import ExportFunctions from "../../../../Utils/timetableUtils";
import DayView from "../../../Admin/TimeTables/Views/DayView";
import WeekView from "../../../Admin/TimeTables/Views/WeekView";
import MonthView from "../../../Admin/TimeTables/Views/MonthView";
import { AnimatePresence } from "framer-motion";

// Header component for timetable with view controls and export options
const TimetableHeader = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  exportFunctions,
  t,
  activeTab,
  setActiveTab,
}) => {
  // const exportContent = (
  //   <div className="flex flex-col gap-2 p-2">
  //     <Button
  //       icon={<AiOutlineFilePdf />}
  //       onClick={exportFunctions.handleExportPDF}
  //       className="flex items-center"
  //     >
  //       {t("Export as PDF")}
  //     </Button>
  //     <Button
  //       icon={<AiOutlinePrinter />}
  //       onClick={exportFunctions.handlePrint}
  //       className="flex items-center"
  //     >
  //       {t("Print")}
  //     </Button>
  //   </div>
  // );

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center justify-between w-full">
          <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ margin: 0 }}>
            <Tabs.TabPane key="classTimetable" tab="Class TimeTable" />
            <Tabs.TabPane key="otherTimetable" tab="Other TimeTable" />
          </Tabs>
          <div className="flex items-center gap-2">
            <Button
              type="default"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              icon={<AiOutlineFilter />}
            >
              {sidebarCollapsed ? t("Show Stats") : t("Hide Stats")}
            </Button>

            {/* {activeTab === "otherTimetable" && (
              <div className="flex items-center gap-2">
                <Popover
                  content={exportContent}
                  trigger="click"
                  placement="bottomRight"
                >
                  <Button>{t("Export")}</Button>
                </Popover>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Parent component to manage timetable display
const TimetableContainer = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state?.common?.user);
  // console.log("User Details:", userDetails);
  const studentTimetableData = useSelector(
    (state) => state.student?.studentTimetable
  );
  const { timetables = [], loading: loadingFetch } = studentTimetableData || {};

  // Local States
  const [activeTab, setActiveTab] = useState("classTimetable");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Translation function (mocked for simplicity)
  const t = (text) => text;

  // Fetch timetable data for the logged-in student on component mount
  useEffect(() => {
    const fetchTimetable = async () => {

      if (!userDetails?.userId) {
        message.error("User ID not found");
        return;
      }
      // console.log("Fetching student timetable for user ID:", userDetails.userId);
      const response = await dispatch(fetchStudentTimetable())
      console.log("Timetable fetch response:", response);
    }
    fetchTimetable();
  }, [dispatch, userDetails]);

  // Export Handler Setup
  const exportFunctions = useMemo(
    () =>
      new ExportFunctions({
        viewMode,
        selectedDate,
        filteredTimetables: timetables, // Use raw timetables
        format,
        dayjs: require("dayjs"),
        isWithinValidity: (timetable, date) => {
          if (!timetable.validity) return true;
          const { startDate, endDate } = timetable.validity;
          return (
            !startDate ||
            !endDate ||
            isWithinInterval(date, {
              start: parseISO(startDate),
              end: parseISO(endDate),
            })
          );
        },
      }),
    [viewMode, selectedDate, timetables]
  );

  // Handle event click (placeholder for viewing timetable details)
  const onEventClick = (timetable) => {
    console.log("Event clicked:", timetable);
  };

  // Render
  return (
    <div className="w-full p-4">
      <TimetableHeader
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        exportFunctions={exportFunctions}
        t={t}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="mt-4">
        {activeTab === "classTimetable" && <MainSection />}
        {activeTab === "otherTimetable" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <NavigationControls
                selectedDate={selectedDate}
                viewMode={viewMode}
                setSelectedDate={setSelectedDate}
              />
              <Radio.Group
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="day">{t("Day")}</Radio.Button>
                <Radio.Button value="week">{t("Week")}</Radio.Button>
                <Radio.Button value="month">{t("Month")}</Radio.Button>
              </Radio.Group>
            </div>
            <AnimatePresence mode="wait">
              {viewMode === "day" && (
                <DayView
                  selectedDate={selectedDate}
                  filteredTimetables={timetables} // Use raw timetables
                  onEventClick={onEventClick}
                />
              )}
              {viewMode === "week" && (
                <WeekView
                  selectedDate={selectedDate}
                  filteredTimetables={timetables} // Use raw timetables
                  onEventClick={onEventClick}
                  onDateChange={setSelectedDate}
                />
              )}
              {viewMode === "month" && (
                <MonthView
                  selectedDate={selectedDate}
                  filteredTimetables={timetables} // Use raw timetables
                  onEventClick={onEventClick}
                  setSelectedDate={setSelectedDate}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default TimetableContainer;