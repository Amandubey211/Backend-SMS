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
  message,
  Tooltip,
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
} from "@ant-design/icons";
import { BsPatchCheckFill } from "react-icons/bs";
import { MdOutlineBlock } from "react-icons/md";
import { AnimatePresence } from "framer-motion";
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
import { SearchComponent } from "./Components/SearchComponent";

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
import MainSection from "./AutomaticTimeTable/MainSection";
import TeacherTimeTable from "./AutomaticTimeTable/components/TeacherTimeTable";

export default function TimeTableDash() {
  const dispatch = useDispatch();

  // --------------------------
  // Redux State
  // --------------------------
  const {
    timetables = [],
    counts,
    loadingFetch,
    pagination = {}, // We'll store total, page, limit in here
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
    const role = useSelector((store) => store.common.auth.role);
 const { userDetails } = useSelector((store) => store.common.user);
  // --------------------------
  // Local States
  // --------------------------
  const [activeTab, setActiveTab] = useState("autoCalendar");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Drawer & Modal
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [detailsTimetable, setDetailsTimetable] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    class: null,
    sections: [],
    groups: [],
    subject: null,
    semester: null,
    status: null,
    type: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Client-side pagination config
  const [paginationConfig, setPaginationConfig] = useState({
    current: 1,
    pageSize: 10,
  });

  // --------------------------
  // Export Handler Setup
  // --------------------------
  const exportFunctions = useMemo(
    () =>
      new ExportFunctions({
        viewMode,
        selectedDate,
        filteredTimetables: timetables,
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

  // --------------------------
  // Memo: Calendar-View Filtering (Client-Side)
  // --------------------------
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

  // --------------------------
  // Fetch Data
  // --------------------------
  // 1) Fetch initial data
  useEffect(() => {
    dispatch(fetchAllClasses());
    fetchTimetables();
    // eslint-disable-next-line
  }, []);

  // 2) Reusable function to fetch from the server
  const fetchTimetables = useCallback(
    (params = {}) => {
      const queryParams = {
        page: paginationConfig.current,
        limit: paginationConfig.pageSize,
        ...filters,
        ...params,
      };

      // Only include search if not empty
      if (searchTerm.trim()) {
        queryParams.search = searchTerm;
      } else {
        delete queryParams.search;
      }

      if (activeTab === "calendar") {
        queryParams.showCalendar = true;
      }

      dispatch(fetchTimetableList(queryParams))
        .unwrap()
        .then((res) => {
          // If the server returns pagination, update our local state
          if (res.pagination) {
            setPaginationConfig((prev) => ({
              ...prev,
              current: res.pagination.page,
              pageSize: res.pagination.limit,
            }));
          }
        })
        .catch((error) => {
          console.error("Fetch Timetables Error:", error);
        });
    },
    [dispatch, filters, searchTerm, activeTab, paginationConfig]
  );

  // --------------------------
  // Search: Debounced on typing, immediate on Enter
  // --------------------------
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setPaginationConfig((prev) => ({ ...prev, current: 1 }));
        fetchTimetables({ search: value.trim() || undefined, page: 1 });
      }, 500),
    [fetchTimetables]
  );

  /**
   * Called on input changes. Debounced fetch for "live" searching.
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // If cleared, reset
    if (!value.trim()) {
      setPaginationConfig((prev) => ({ ...prev, current: 1 }));
      fetchTimetables({ search: undefined, page: 1 });
      debouncedSearch.cancel();
    } else {
      // Debounce on typing
      debouncedSearch(value);
    }
  };

  /**
   * This is optionally used if you have a "Clear" button outside the input
   */
  const handleClearSearch = () => {
    setSearchTerm("");
    setPaginationConfig((prev) => ({ ...prev, current: 1 }));
    fetchTimetables({ search: undefined, page: 1 });
    debouncedSearch.cancel();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // --------------------------
  // Dependent Data (Class => Sections, Groups, Semesters, etc.)
  // --------------------------
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

  // --------------------------
  // Filters
  // --------------------------
  const applyFilters = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      setPaginationConfig((prev) => ({ ...prev, current: 1 }));
      fetchTimetables({ ...newFilters, page: 1 });
    },
    [fetchTimetables]
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
    setSearchTerm("");
    setPaginationConfig((prev) => ({ ...prev, current: 1 }));
    fetchTimetables({ ...newFilters, search: undefined, page: 1 });
  }, [fetchTimetables]);

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

  // --------------------------
  // Table pagination / sorting
  // --------------------------
  const handleTableChange = (pagination, filterObj, sorter) => {
    setPaginationConfig((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));

    fetchTimetables({
      page: pagination.current,
      limit: pagination.pageSize,
      ...filterObj,
      ...(sorter.field && {
        sortField: sorter.field,
        sortOrder: sorter.order,
      }),
    });
  };

  // --------------------------
  // StatsSection: Type Filter
  // --------------------------
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

  // --------------------------
  // UI Helpers
  // --------------------------
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
  //  console.log("TimeTable", timetables);
  // When loading, show skeleton with matching columns
  const skeletonColumns = listColumns.map((col) => ({
    ...col,
    render: () => <Skeleton active paragraph={{ rows: 1 }} title={false} />,
  }));

  // --------------
  // Filter Tags
  // --------------
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

  // --------------------------
  // Render
  // --------------------------
  return (
    <div className="w-full min-h-screen flex">
      {/* Main Content */}
      <div
        className={`flex-1 p-4 transition-all ${sidebarCollapsed ? "mr-0" : "mr-72"
          }`}
      >
        {/* Header & Top Controls */}
        <div className="flex flex-col gap-4 ">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <Tabs.TabPane key="autoCalendar" tab="ASC TimeTable" />
                <Tabs.TabPane key="list" tab={<span>Other TimeTables</span>} />
                {/* <Tabs.TabPane key="calendar" tab={<span>Calendar View</span>} /> */}
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

        {/* Filters & Search */}
        <SearchComponent
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleClearSearch={() => {
            setSearchTerm(""); // Clear the search term state
            fetchTimetables({ search: undefined, page: 1 }); // Fetch without search query
          }}
          filters={filters}
          handleFilterChange={handleFilterChange}
          setShowFilterDrawer={setShowFilterDrawer}
          filterTags={filterTags}
          clearAllFilters={clearAllFilters}
        />

        {/* Conditionally Render List /Automatic / Calendar */}
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
        {activeTab === "autoCalendar" && (
          <>
          {
            role === 'teacher' && <TeacherTimeTable selectedTeacher={userDetails.userId} /> 
          }
            
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
                    {[...Array(35)].map((_, i) => (
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
        <div className="w-64 border-l p-4 bg-white flex flex-col justify-between fixed right-0 h-full overflow-y-auto">
          {loadingFetch ? (
            <div className="space-y-4">
              <Skeleton.Input active size="default" style={{ width: 150 }} />
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
                counts={counts}
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
          Type={"normal"}
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
