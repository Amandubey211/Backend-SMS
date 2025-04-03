import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  Select,
  Row,
  Col,
  message,
} from "antd";
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
  CalendarOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { BsPatchCheckFill } from "react-icons/bs";
import { MdOutlineBlock } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { format, isWithinInterval, parseISO } from "date-fns";
import debounce from "lodash/debounce";

// Child components
import DayView from "./Views/DayView";
import WeekView from "./Views/WeekView";
import MonthView from "./Views/MonthView";
import StatsSection from "./Components/StatsSection";
import TimetableDetailsDrawer from "./Components/TimetableDetailsDrawer";
import NavigationControls from "./Components/NavigationControls";
import TimeTableForm from "./Components/TimeTableForm";
import { Doughnut } from "react-chartjs-2";
import FilterDrawer from "./Components/FilterDrawer";

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
import toast from "react-hot-toast";
import { SearchComponent } from "./Components/SearchComponent";

export default function TimeTableDash() {
  const dispatch = useDispatch();
  const {
    timetables = [],
    loadingFetch,
    pagination = {},
  } = useSelector((store) => store?.admin?.timetable || {});

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
    status: null,
    type: null,
  });
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationConfig, setPaginationConfig] = useState({
    current: 1,
    pageSize: 10,
  });

  // Export functions instance
  const exportFunctions = useMemo(
    () =>
      new ExportFunctions({
        viewMode,
        selectedDate,
        filteredTimetables: timetables, // Use the full list from backend
        format,
        dayjs,
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

  // Popover content for export
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

  // Memoized filtered timetables (client-side for calendar view)
  const filteredTimetables = useMemo(() => {
    let result = [...timetables];

    // Filter for calendar view
    if (activeTab === "calendar") {
      result = result.filter((t) => t.showCalendar === true);
    }

    // Apply type filter if set
    if (filters.type) {
      result = result.filter((t) => t.type === filters.type);
    }

    return result;
  }, [timetables, activeTab, filters.type]);

  // Fetch all initial data
  useEffect(() => {
    dispatch(fetchAllClasses());
    fetchTimetables();
  }, [dispatch]);

  // Fetch timetables with current filters
  const fetchTimetables = useCallback(
    (params = {}) => {
      const queryParams = {
        page: paginationConfig.current,
        limit: paginationConfig.pageSize,
        ...filters,
        ...params,
      };

      if (searchTerm) {
        queryParams.search = searchTerm; // Changed from 'name' to 'search' for backend
      }

      if (activeTab === "calendar") {
        queryParams.showCalendar = true;
      }

      dispatch(fetchTimetableList(queryParams));
    },
    [dispatch, filters, searchTerm, activeTab, paginationConfig]
  );

  // Create a debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setPaginationConfig((prev) => ({ ...prev, current: 1 }));
        fetchTimetables({ name: value, page: 1 });
      }, 500),
    [fetchTimetables]
  );
  // Handle search term change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      fetchTimetables({ search: "", page: 1 });
    } else {
      debouncedSearch(value);
    }
  };

  // Clear search and refetch
  const handleClearSearch = () => {
    setSearchTerm("");
    setPaginationConfig((prev) => ({ ...prev, current: 1 }));
    fetchTimetables({ search: "", page: 1 });
    debouncedSearch.cancel();
  };

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

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

  // Apply filters and refetch data
  const applyFilters = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      setPaginationConfig((prev) => ({ ...prev, current: 1 }));
      fetchTimetables({ ...newFilters, page: 1 });
    },
    [fetchTimetables]
  );

  // Handlers
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
    setSearchTerm("");
    applyFilters(newFilters);
  }, [applyFilters]);

  const removeFilter = useCallback(
    (filterName) => {
      const newFilters = {
        ...filters,
        [filterName]: Array.isArray(filters[filterName]) ? [] : null,
      };
      applyFilters(newFilters);
    },
    [applyFilters, filters]
  );

  // Handle table pagination/sorting changes
  const handleTableChange = (pagination, filters, sorter) => {
    setPaginationConfig(pagination);
    fetchTimetables({
      page: pagination.current,
      limit: pagination.pageSize,
      ...filters,
      ...(sorter.field && {
        sortField: sorter.field,
        sortOrder: sorter.order,
      }),
    });
  };

  // Handle type filter from StatsSection
  const handleTypeFilter = useCallback(
    (type) => {
      const newFilters = {
        ...filters,
        type: filters.type === type ? null : type,
      };
      applyFilters(newFilters);
    },
    [applyFilters, filters]
  );

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
          fetchTimetables();
        })
        .catch((error) => {
          message.error("Failed to delete timetable");
          console.error("Failed to delete timetable:", error);
        });
    }
  };

  const handleFormSubmit = (values, isEdit) => {
    const action = isEdit
      ? dispatch(updateTT({ id: editingTimetable?._id, data: values }))
      : dispatch(createTT(values));

    action
      .then(() => {
        closeDrawer();
        fetchTimetables();
      })
      .catch((error) => {
        message.error(
          isEdit ? "Failed to update timetable" : "Failed to create timetable"
        );
        console.error("Form submission error:", error);
      });
  };

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

  // Columns for the list tab
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

  // Filter tags for display
  const filterTags = Object.entries(filters)
    .filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined;
    })
    .map(([key, value]) => ({
      key,
      value,
      display:
        key === "class"
          ? classList.find((c) => c._id === value)?.className
          : key === "sections"
          ? sectionList
              .filter((s) => value.includes(s._id))
              .map((s) => s.sectionName)
              .join(", ")
          : key === "groups"
          ? groupsList
              .filter((g) => value.includes(g._id))
              .map((g) => g.groupName)
              .join(", ")
          : key === "subject"
          ? allSubjects.find((s) => s._id === value)?.subjectName
          : key === "semester"
          ? reduxSemesters.find((s) => s._id === value)?.title
          : value,
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
        <div className="flex flex-col gap-4 ">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* Tabs with Icons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <Tabs.TabPane key="list" tab={<span>List View</span>} />
                <Tabs.TabPane key="calendar" tab={<span>Calendar View</span>} />
              </Tabs>
            </div>

            {/* Right side: filters, export, add */}
            <div className="flex items-center gap-2">
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

        {/* Filters and Search */}
        <SearchComponent
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleClearSearch={handleClearSearch}
          filters={filters}
          handleFilterChange={handleFilterChange}
          setShowFilterDrawer={setShowFilterDrawer}
          filterTags={filterTags}
          clearAllFilters={clearAllFilters}
          fetchTimetables={fetchTimetables}
        />

        {/* Conditionally Render List or Calendar View */}
        {activeTab === "list" && (
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
                dataSource={timetables} // Use the full list from backend
                columns={listColumns}
                rowKey="_id"
                pagination={{
                  ...paginationConfig,
                  total: pagination.total,
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

      {/* Sidebar Stats */}
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
              <h3 className="text-lg font-semibold mb-3">Stats Overview</h3>
              <StatsSection
                filteredTimetables={filteredTimetables}
                onTypeClick={handleTypeFilter}
                activeType={filters.type}
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

      {/* Filter Drawer */}
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
