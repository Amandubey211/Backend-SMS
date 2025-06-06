import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Radio, Button, Drawer, Modal, Skeleton, Divider, Popover, Tabs, Table, Space, Tag, message, Tooltip, } from "antd";
import {
  AiOutlineFilter,
  AiOutlineFilePdf,
  AiOutlinePrinter,
} from "react-icons/ai";
import {
  CloseOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { BsPatchCheckFill } from "react-icons/bs";
import { MdOutlineBlock } from "react-icons/md";
import { format, isWithinInterval, parseISO } from "date-fns";
import NavigationControls from "../../../Admin/TimeTables/Components/NavigationControls";
import MainSection from "./MainSection";
import { fetchStudentTimetable } from "../../../../Store/Slices/Student/TimeTable/studentTimeTable.action";
import ExportFunctions from "../../../../Utils/timetableUtils";
import TimetableDetailsDrawer from "../../../Admin/TimeTables/Components/TimetableDetailsDrawer";
import StatsSection from "../../../Admin/TimeTables/Components/StatsSection";
import DayView from "../../../Admin/TimeTables/Views/DayView";
import WeekView from "../../../Admin/TimeTables/Views/WeekView";
import MonthView from "../../../Admin/TimeTables/Views/MonthView";
import { AnimatePresence } from "framer-motion";
import { Doughnut } from "react-chartjs-2";

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
const TimetableContainer = ({ timetables, counts, loadingFetch, pagination, sidebarCollapsed, setSidebarCollapsed }) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state?.common?.user);
  // console.log("User Details:", userDetails);
  const studentTimetableData = useSelector(
    (state) => state.student?.studentTimetable
  );
  // const { timetables = [], loading: loadingFetch } = studentTimetableData || {};

  // Local States
  const [activeTab, setActiveTab] = useState("classTimetable");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [detailsTimetable, setDetailsTimetable] = useState(null);
  const [viewMode, setViewMode] = useState("month");
  // const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [paginationConfig, setPaginationConfig] = useState({
    current: 1,
    pageSize: 10,
  });

  const [filters, setFilters] = useState({
    class: null,
    sections: [],
    groups: [],
    subject: null,
    semester: null,
    status: null,
    type: null,
  });

  // Translation function (mocked for simplicity)
  const t = (text) => text;

  const applyFilters = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      setPaginationConfig((prev) => ({ ...prev, current: 1 }));
    },
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      applyFilters({ ...filters, ...newFilters });
    },
    [applyFilters, filters]
  );

  const clearAllFilters = useCallback(() => {
    const newFilters = {
      class: null,
      sections: [],
      groups: [],
      subject: null,
      semester: null,
      status: null,
      type: null,
    };
    setFilters(newFilters);
    // setSearchTerm("");
    setPaginationConfig((prev) => ({ ...prev, current: 1 }));
    // fetchTimetables({ ...newFilters, search: undefined, page: 1 });
  }, []);

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
    setDetailsTimetable(timetable);
    setDetailsDrawerVisible(true);
  };
  
  const handleTableChange = (pagination, filterObj, sorter) => {
    setPaginationConfig((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  function getTypeTag(type) {
    switch (type) {
      // case "weekly":
      //   return <Tag color="pink">Weekly</Tag>;
      case "exam":
        return <Tag color="blue">Exams</Tag>;
      case "event":
        return <Tag color="green">Events</Tag>;
      case "others":
        return <Tag color="yellow">Others</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  }

  const filteredTimetables = useMemo(() => {
    let result = [...timetables];

    // If in calendar view, only show those with showCalendar = true
    if (activeTab === "calendar") {
      result = result.filter((t) => t.showCalendar === true);
    }
    // Additionally filter by type if selected via StatsSection
    if (filters.type) {
      result = result.filter((t) => t.type === filters.type);
    }

    return result;
  }, [timetables, activeTab, filters.type]);

  const handleTypeFilter = useCallback(
    (type) => {
      const newFilters = {
        ...filters,
        type: filters.type === type ? null : type, // toggle
      };
      applyFilters(newFilters);
    },
    [applyFilters, filters]
  );

  // --------------------------
  // Drawers & Modals
  // --------------------------


  const closeDetailsDrawer = () => {
    setDetailsDrawerVisible(false);
    setDetailsTimetable(null);
  };


  function renderClassSemester(record) {
    const className =
      record.classId?.className || record.classId?.name || "No Class";
    const semesterTitle = record.semesterId?.title
      ? ` - ${record.semesterId.title}`
      : "";

    const sections = record.sectionId?.length
      ? record.sectionId.map((sec) => (
        <Tag key={sec._id} color="purple" style={{ marginBottom: 4 }}>
          {sec.sectionName}
        </Tag>
      ))
      : [<Tag key="no-sections">No Sections</Tag>];

    const groups = record.groupId?.length
      ? record.groupId.map((g) => (
        <Tag key={g._id} color="cyan" style={{ marginBottom: 4 }}>
          {g.groupName}
        </Tag>
      ))
      : [<Tag key="no-groups">No Groups</Tag>];

    const popContent = (
      <div style={{ minWidth: "150px" }}>
        <div className="mb-2">
          <strong>Sections:</strong>
          <div className="mt-1 flex flex-wrap gap-1">{sections}</div>
        </div>
        <div>
          <strong>Groups:</strong>
          <div className="mt-1 flex flex-wrap gap-1">{groups}</div>
        </div>
      </div>
    );

    return (
      <Popover content={popContent} placement="topLeft">
        <span className="cursor-pointer hover:underline">
          {className}
          {semesterTitle}
        </span>
      </Popover>
    );
  }

  function renderNameWithStatus(text, record) {
    const isActive = record.status === "active";
    return (
      <div className="flex items-center gap-2 w-full">
        <Tooltip title={isActive ? "Published" : "Unpublished"}>
          {isActive ? (
            <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-7 w-7" />
          ) : (
            <MdOutlineBlock className="text-gray-600 p-1 h-7 w-7" />
          )}
        </Tooltip>
        <div className="font-semibold truncate max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">
          {text}
        </div>
      </div>
    );
  }
  // Table Columns
  const listColumns = [
    {
      title: "Status / Timetable Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) =>
        renderNameWithStatus(text || record.title || "Untitled", record),
    },
    {
      title: "On Calendar",
      dataIndex: "showCalendar",
      key: "showCalendar",
      render: (show) => (
        <Tag color={show ? "green" : "orange"}>
          {show ? "Visible" : "Hidden"}
        </Tag>
      ),
    },
    {
      title: "Class / Semester",
      key: "classSemester",
      render: (_, record) => renderClassSemester(record),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => getTypeTag(type),
    },
    {
      title: "Date Range",
      key: "dateRange",
      render: (_, record) => {
        let start = "N/A";
        let end = "N/A";
        if (record?.validity?.startDate) {
          const parsedStart = new Date(record.validity.startDate);
          if (!isNaN(parsedStart)) {
            start = format(parsedStart, "dd-MM-yyyy");
          }
        }
        if (record?.validity?.endDate) {
          const parsedEnd = new Date(record.validity.endDate);
          if (!isNaN(parsedEnd)) {
            end = format(parsedEnd, "dd-MM-yyyy");
          }
        }
        return `${start} - ${end}`;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button
              icon={<EyeOutlined />}
              onClick={() => onEventClick(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  //  console.log("TimeTable", timetables);
  // When loading, show skeleton with matching columns
  const skeletonColumns = listColumns.map((col) => ({
    ...col,
    render: () => <Skeleton active paragraph={{ rows: 1 }} title={false} />,
  }));

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
            {loadingFetch ? (
              <Table
                dataSource={[...Array(5)].map((_, i) => ({ _id: i }))}
                columns={skeletonColumns}
                pagination={false}
                rowKey="_id"
              />
            ) : (
              <Table
                dataSource={timetables}
                columns={listColumns}
                rowKey="_id"
                pagination={{
                  current: paginationConfig.current,
                  pageSize: paginationConfig.pageSize,
                  total: pagination.total || 0,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} items`,
                }}
                onChange={handleTableChange}
                loading={loadingFetch}
              />
            )}
          </>

        )}
      </div>
      <TimetableDetailsDrawer
        visible={detailsDrawerVisible}
        onClose={closeDetailsDrawer}
        timetable={detailsTimetable}

      />
    </div>
  );
};

export default TimetableContainer;