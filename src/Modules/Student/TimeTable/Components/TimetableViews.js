import React, { useCallback, useMemo, useState } from "react";
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
import { AnimatePresence } from "framer-motion";
import ExportFunctions from "../../../../Utils/timetableUtils";
import TimetableDetailsDrawer from "../../../Admin/TimeTables/Components/TimetableDetailsDrawer";
import WeekView from "../../../Admin/TimeTables/Views/WeekView";
import DayView from "../../../Admin/TimeTables/Views/DayView";
import MonthView from "../../../Admin/TimeTables/Views/MonthView";

/**
 * Component that renders the appropriate timetable view based on viewMode
 * @param {Object} props - Component props
 */
const TimetableViews = ({
  loadingFetch,
  loadingChildren,
  role,
  viewMode,
  selectedDate,
  timetables,
  setSelectedDate,
  pagination,
  t,
}) => {
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [detailsTimetable, setDetailsTimetable] = useState(null);
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

  const handleTableChange = (pagination, filterObj, sorter) => {
    setPaginationConfig((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  const applyFilters = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      setPaginationConfig((prev) => ({ ...prev, current: 1 }));
    },
  );

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

  const onEventClick = (timetable) => {
    setDetailsTimetable(timetable);
    setDetailsDrawerVisible(true);
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
  // Loading state
  if (loadingFetch || (role === "parent" && loadingChildren)) {
    return (
      <div className="space-y-4">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  return (
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

      <TimetableDetailsDrawer
        visible={detailsDrawerVisible}
        onClose={closeDetailsDrawer}
        timetable={detailsTimetable}

      />
    </>
  );
};

export default TimetableViews;
