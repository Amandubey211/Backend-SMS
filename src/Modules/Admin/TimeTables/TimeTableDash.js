import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Radio,
  Button,
  Drawer,
  Modal,
  Skeleton,
  Divider,
  Popover,
  Tabs,
  Table,
  Space,
  Tag,
  Input,
  Tooltip,
} from "antd";
import {
  AiOutlineFilter,
  AiOutlineFilePdf,
  AiOutlinePrinter,
} from "react-icons/ai";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  CloseOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { format } from "date-fns";

// Child components
import DayView from "./Views/DayView";
import WeekView from "./Views/WeekView";
import MonthView from "./Views/MonthView";
import StatsSection from "./Components/StatsSection";
import TimetableDetailsDrawer from "./Components/TimetableDetailsDrawer";
import NavigationControls from "./Components/NavigationControls";
import TimeTableForm from "./Components/TimeTableForm";
import { Doughnut } from "react-chartjs-2";

// Thunks
import {
  fetchTimetableList,
  createTimetable as createTT,
  updateTimetable as updateTT,
  deleteTimetable as deleteTT,
} from "../../../Store/Slices/Admin/TimeTable/timetable.action";
import { fetchAllClasses } from "../../../Store/Slices/Admin/Class/actions/classThunk";
import {
  fetchSectionsNamesByClass,
  fetchGroupsByClass,
  fetchGroupsByClassAndSection,
} from "../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchSubjects } from "../../../Store/Slices/Admin/Class/Subject/subjectThunks";
import { fetchSemestersByClass } from "../../../Store/Slices/Admin/Class/Semester/semesterThunks";

// Utils
import ExportFunctions from "../../../Utils/timetableUtils";
import FilterDrawer from "./Components/FilterDrawer";

export default function TimeTableDash() {
  const dispatch = useDispatch();
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

  // Tabs for List/Calendar
  const [activeTab, setActiveTab] = useState("list");

  // Date, view, toggles
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [filterType, setFilterType] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Drawer states
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);

  // Details drawer states
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [detailsTimetable, setDetailsTimetable] = useState(null);

  // Deletion modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Filter data
  const [filters, setFilters] = useState({
    class: null,
    sections: [],
    groups: [],
    subject: null,
    semester: null,
  });
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Basic search input
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all initial data
  useEffect(() => {
    dispatch(fetchTimetableList());
    dispatch(fetchAllClasses());
  }, [dispatch]);

  // Fetch dependent data when class changes
  useEffect(() => {
    const fetchDependentData = async () => {
      if (filters.class) {
        try {
          await Promise.all([
            dispatch(fetchSectionsNamesByClass(filters.class)),
            dispatch(fetchGroupsByClass(filters.class)),
            dispatch(fetchSubjects(filters.class)),
            dispatch(fetchSemestersByClass(filters.class)),
          ]);
        } catch (error) {
          console.error("Error fetching dependent data:", error);
        }
      } else {
        // Clear dependent data
        setFilters((prev) => ({
          ...prev,
          sections: [],
          groups: [],
          subject: null,
          semester: null,
        }));
      }
    };

    fetchDependentData();
  }, [dispatch, filters.class]);

  // Fetch groups when sections change
  useEffect(() => {
    if (filters.class && filters.sections.length > 0) {
      dispatch(
        fetchGroupsByClassAndSection({
          classId: filters.class,
          sectionIds: filters.sections,
        })
      );
    } else if (filters.class) {
      dispatch(fetchGroupsByClass(filters.class));
    }
  }, [dispatch, filters.class, filters.sections]);

  // Filter timetables by user-applied filters & search
  const filteredTimetables = useMemo(() => {
    let result = timetables;

    // Type filter
    if (filterType) {
      result = result.filter((tt) => tt.type === filterType);
    }
    // Class filter
    if (filters.class) {
      result = result.filter((tt) => tt.classId?._id === filters.class);
    }
    // Sections filter
    if (filters.sections.length > 0) {
      result = result.filter((tt) =>
        tt.sectionId?.some((s) => filters.sections.includes(s._id))
      );
    }
    // Groups filter
    if (filters.groups.length > 0) {
      result = result.filter((tt) =>
        tt.groupId?.some((g) => filters.groups.includes(g._id))
      );
    }
    // Subject filter
    if (filters.subject) {
      result = result.filter((tt) =>
        tt.days?.some((day) =>
          day.slots?.some((slot) => slot.subjectId?._id === filters.subject)
        )
      );
    }
    // Semester filter
    if (filters.semester) {
      result = result.filter((tt) => tt.semesterId?._id === filters.semester);
    }

    // Search by timetable name, type, or class name
    if (searchTerm) {
      const normalizedSearch = searchTerm.toLowerCase();
      result = result.filter((tt) => {
        const title = tt.title?.toLowerCase() || tt.name?.toLowerCase() || "";
        const type = tt.type?.toLowerCase() || "";
        const className =
          tt.classId?.className?.toLowerCase() ||
          tt.classId?.name?.toLowerCase() ||
          "";
        return (
          title.includes(normalizedSearch) ||
          type.includes(normalizedSearch) ||
          className.includes(normalizedSearch)
        );
      });
    }

    return result;
  }, [timetables, filterType, filters, searchTerm]);

  // Utility for export, printing, etc.
  const exportFunctions = new ExportFunctions({
    viewMode,
    selectedDate,
    filteredTimetables,
    format,
    dayjs,
    isWithinValidity: (timetable, date) => {
      if (!timetable.validity) return true;
      const { startDate, endDate } = timetable.validity;
      return (
        !startDate ||
        !endDate ||
        (new Date(date) >= new Date(startDate) &&
          new Date(date) <= new Date(endDate))
      );
    },
  });

  // Handlers
  const handleFilterChange = (filterName, value) => {
    if (filterName === "class") {
      setFilters({
        class: value,
        sections: [],
        groups: [],
        subject: null,
        semester: null,
      });
    } else if (filterName === "sections") {
      setFilters((prev) => ({
        ...prev,
        sections: value,
        groups: value.length > 0 ? prev.groups : [],
      }));
    } else {
      setFilters((prev) => ({ ...prev, [filterName]: value }));
    }
  };

  const clearAllFilters = () => {
    setFilters({
      class: null,
      sections: [],
      groups: [],
      subject: null,
      semester: null,
    });
    setFilterType(null);
    setSearchTerm("");
  };

  const removeFilter = (filterName) => {
    if (filterName === "class") {
      setFilters({
        class: null,
        sections: [],
        groups: [],
        subject: null,
        semester: null,
      });
    } else if (filterName === "sections" || filterName === "groups") {
      setFilters((prev) => ({ ...prev, [filterName]: [] }));
    } else {
      setFilters((prev) => ({ ...prev, [filterName]: null }));
    }
  };

  // Drawer/Modal
  const openDrawer = (timetable = null) => {
    setEditingTimetable(timetable);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setEditingTimetable(null);
    setDrawerVisible(false);
  };

  const onEventClick = (timetable) => {
    setDetailsTimetable(timetable);
    setDetailsDrawerVisible(true);
  };

  const closeDetailsDrawer = () => {
    setDetailsDrawerVisible(false);
    setDetailsTimetable(null);
  };

  const onDeleteClick = (timetableId) => {
    setDeleteModalVisible(true);
    setEditingTimetable({ _id: timetableId });
  };

  const confirmDelete = () => {
    if (editingTimetable?._id) {
      dispatch(deleteTT(editingTimetable._id))
        .unwrap()
        .then(() => {
          setDeleteModalVisible(false);
          closeDetailsDrawer();
          setEditingTimetable(null);
          closeDrawer();
        })
        .catch((error) => {
          console.error("Failed to delete timetable:", error);
        });
    }
  };

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

  // Popover for Export
  const exportContent = (
    <div className="flex flex-col gap-2 p-2">
      <Button
        icon={<AiOutlineFilePdf />}
        onClick={exportFunctions.handleExportPDF}
        className="flex items-center"
      >
        Export as PDF
      </Button>
      <Button
        icon={<AiOutlinePrinter />}
        onClick={exportFunctions.handlePrint}
        className="flex items-center"
      >
        Print
      </Button>
    </div>
  );

  // Return a Tag for "Type"
  function getTypeTag(type) {
    switch (type) {
      case "weekly":
        return <Tag color="pink">Weekly</Tag>;
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

  // Return a popover that shows sections/groups if hovered
  function renderClassSemester(record) {
    const className =
      record.classId?.className || record.classId?.name || "No Class";
    const semesterTitle = record.semesterId?.title
      ? ` - ${record.semesterId.title}`
      : "";

    // Build popover content
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
        {/* Status Icon with Tooltip */}
        <Tooltip title={isActive ? "Published" : "Unpublished"}>
          {isActive ? (
            <CheckCircleOutlined className="text-green-500" />
          ) : (
            <CloseCircleOutlined className="text-red-500" />
          )}
        </Tooltip>

        {/* Truncated Title */}
        <div className="font-semibold truncate max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">
          {text}
        </div>
      </div>
    );
  }

  // Columns for the list tab
  const listColumns = [
    {
      title: "Stauts / Timetable Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) =>
        renderNameWithStatus(text || record.title || "Untitled", record),
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
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => openDrawer(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDeleteClick(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Skeleton columns for matching the layout when loading
  const skeletonColumns = listColumns.map((col) => ({
    ...col,
    render: () => <Skeleton active paragraph={{ rows: 1 }} title={false} />,
  }));

  return (
    <div className="w-full min-h-screen flex">
      {/* Main Content */}
      <div
        className={`flex-1 p-4 transition-all ${
          sidebarCollapsed ? "mr-0" : "mr-72"
        }`}
      >
        {/* Header and Controls */}
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* Tabs with Icons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <Tabs.TabPane
                  key="list"
                  tab={
                    <span>
                      {/* <EyeOutlined /> */}
                      List View
                    </span>
                  }
                />
                <Tabs.TabPane
                  key="calendar"
                  tab={
                    <span>
                      {/* <CalendarOutlined /> */}
                      Calendar View
                    </span>
                  }
                />
              </Tabs>
            </div>

            {/* Right side: filters, export, add */}
            <div className="flex items-center gap-2">
              {/* Show Day/Week/Month only in Calendar tab */}
              {activeTab === "calendar" && (
                <Radio.Group
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  buttonStyle="solid"
                >
                  <Radio.Button value="day">Day</Radio.Button>
                  <Radio.Button value="week">Week</Radio.Button>
                  <Radio.Button value="month">Month</Radio.Button>
                </Radio.Group>
              )}

              <Button
                type="default"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                icon={<AiOutlineFilter />}
              >
                {sidebarCollapsed ? "Show Stats" : "Hide Stats"}
              </Button>

              <Popover
                content={exportContent}
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
            </div>
          </div>
        </div>

        {/* Conditionally Render List or Calendar View */}
        {activeTab === "list" && (
          <>
            {/* Simple Search */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-semibold">Search Timetables:</span>
              <Input
                placeholder="By Name, Type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: "300px" }}
              />
            </div>

            {/* Table or skeleton */}
            {loadingFetch ? (
              <Table
                dataSource={[...Array(5)].map((_, i) => ({ _id: i }))}
                columns={skeletonColumns}
                pagination={false}
                rowKey="_id"
              />
            ) : (
              <Table
                dataSource={filteredTimetables}
                columns={listColumns}
                rowKey="_id"
                // pagination={{ pageSize: 10 }}
              />
            )}
          </>
        )}

        {activeTab === "calendar" && (
          <>
            <NavigationControls
              selectedDate={selectedDate}
              viewMode={viewMode}
              setSelectedDate={setSelectedDate}
            />

            {loadingFetch ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton.Button active size="large" shape="round" />
                  <div className="flex gap-2">
                    <Skeleton.Button active size="large" shape="round" />
                    <Skeleton.Button active size="large" shape="round" />
                    <Skeleton.Button active size="large" shape="round" />
                  </div>
                </div>
                {viewMode === "month" && (
                  <div className="grid grid-cols-7 gap-1">
                    {[...Array(35)]?.map((_, i) => (
                      <div key={i} className="border rounded p-2 h-24">
                        <Skeleton active paragraph={{ rows: 2 }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {viewMode === "day" && (
                  <DayView
                    selectedDate={selectedDate}
                    filteredTimetables={filteredTimetables}
                    onEventClick={onEventClick}
                  />
                )}
                {viewMode === "week" && (
                  <WeekView
                    selectedDate={selectedDate}
                    filteredTimetables={filteredTimetables}
                    onEventClick={onEventClick}
                    onDateChange={setSelectedDate}
                  />
                )}
                {viewMode === "month" && (
                  <MonthView
                    selectedDate={selectedDate}
                    filteredTimetables={filteredTimetables}
                    onEventClick={onEventClick}
                    setSelectedDate={setSelectedDate}
                  />
                )}
              </AnimatePresence>
            )}
          </>
        )}
      </div>

      {/* Sidebar Stats & Filters */}
      {!sidebarCollapsed && (
        <div className="w-72 border-l p-4 bg-white flex flex-col justify-between fixed right-0 h-full overflow-y-auto">
          {loadingFetch ? (
            <div className="space-y-4">
              <Skeleton.Input active size="default" style={{ width: 150 }} />
              <div className="flex flex-col gap-2">
                <Skeleton.Button active block size="large" />
                <Skeleton.Button active block size="large" />
              </div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="border-l-4 p-2 h-[60px] flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Skeleton.Avatar
                        active
                        size={32}
                        shape="square"
                        className="mr-2"
                      />
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 80 }}
                      />
                    </div>
                    <Skeleton.Input active size="small" style={{ width: 30 }} />
                  </div>
                ))}
              </div>
              <div className="border rounded p-4">
                <Skeleton.Input
                  active
                  size="default"
                  style={{ width: 150, margin: "0 auto" }}
                />
                <div className="flex justify-center mt-4">
                  <Skeleton.Avatar active size={200} shape="circle" />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-3">Stats & Filters</h3>
              <StatsSection
                filteredTimetables={filteredTimetables}
                filterType={filterType}
                setFilterType={setFilterType}
                onExportPDF={exportFunctions.handleExportPDF}
                onPrint={exportFunctions.handlePrint}
                onAddTimetable={() => openDrawer(null)}
                filters={filters}
                onRemoveFilter={removeFilter}
                onOpenFilterDrawer={() => setShowFilterDrawer(true)}
                onClearFilters={clearAllFilters}
                classList={classList}
                sectionList={sectionList}
                onFilterChange={handleFilterChange}
                groupsList={groupsList}
                allSubjects={allSubjects}
                reduxSemesters={reduxSemesters}
              />
              <Divider />
              <div className="border rounded p-4 mb-4">
                <h4 className="font-semibold mb-2 text-center">
                  Timetable Types
                </h4>
                {filteredTimetables.length > 0 ? (
                  <Doughnut
                    data={exportFunctions.getChartData()}
                    options={exportFunctions.getChartOptions()}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-gray-500">No timetable data available</p>
                    <p className="text-sm text-gray-400">
                      Create a timetable to see statistics
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Drawer for Create/Edit Timetable */}
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
        <TimeTableForm
          editingTimetable={editingTimetable}
          onSubmit={handleFormSubmit}
          onClose={closeDrawer}
          classList={classList}
          sectionList={sectionList}
          groupsList={groupsList}
          allSubjects={allSubjects}
          reduxSemesters={reduxSemesters}
        />
      </Drawer>

      {/* Details Drawer (View Timetable) */}
      <TimetableDetailsDrawer
        visible={detailsDrawerVisible}
        onClose={closeDetailsDrawer}
        timetable={detailsTimetable}
        onEdit={() => {
          closeDetailsDrawer();
          openDrawer(detailsTimetable);
        }}
        onDelete={(id) => onDeleteClick(id)}
      />

      {/* Confirm Deletion Modal */}
      <Modal
        title="Confirm Deletion"
        visible={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okButtonProps={{ danger: true }}
        okText="Delete"
        zIndex={2000}
      >
        <p>Are you sure you want to delete this timetable?</p>
      </Modal>

      {/* Optional Filter Drawer */}
      <FilterDrawer
        visible={showFilterDrawer}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearAllFilters}
        onClose={() => setShowFilterDrawer(false)}
        classList={classList}
        sectionList={sectionList}
        groupsList={groupsList}
        allSubjects={allSubjects}
        reduxSemesters={reduxSemesters}
      />
    </div>
  );
}
