import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Radio,
  Button,
  Drawer,
  Modal,
  Skeleton,
  Divider,
  Badge,
  Popover,
} from "antd";
import {
  AiOutlineFilter,
  AiOutlineFilePdf,
  AiOutlinePrinter,
  AiOutlineDown,
} from "react-icons/ai";
import { CloseOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
// Components
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
import { format } from "date-fns";
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

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [filterType, setFilterType] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [detailsTimetable, setDetailsTimetable] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    class: null,
    sections: [],
    groups: [],
    subject: null,
    semester: null,
  });
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

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
          // Fetch all dependent data in parallel
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
        // Clear dependent data when no class is selected
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

  // Fetch groups when sections change (only if sections are selected)
  useEffect(() => {
    if (filters.class && filters.sections.length > 0) {
      dispatch(
        fetchGroupsByClassAndSection({
          classId: filters.class,
          sectionIds: filters.sections,
        })
      );
    } else if (filters.class) {
      // If sections are cleared but class is still selected, fetch all groups for the class
      dispatch(fetchGroupsByClass(filters.class));
    }
  }, [dispatch, filters.class, filters.sections]);

  const filteredTimetables = useMemo(() => {
    let result = timetables;
    if (filterType) result = result.filter((tt) => tt.type === filterType);
    if (filters.class)
      result = result.filter((tt) => tt.classId?._id === filters.class);
    if (filters.sections.length > 0)
      result = result.filter((tt) =>
        tt.sectionId?.some((section) => filters.sections.includes(section._id))
      );
    if (filters.groups.length > 0)
      result = result.filter((tt) =>
        tt.groupId?.some((group) => filters.groups.includes(group._id))
      );
    if (filters.subject)
      result = result.filter((tt) =>
        tt.days?.some((day) =>
          day.slots?.some((slot) => slot.subjectId?._id === filters.subject)
        )
      );
    if (filters.semester)
      result = result.filter((tt) => tt.semesterId?._id === filters.semester);
    return result;
  }, [timetables, filterType, filters]);

  const handleFilterChange = (filterName, value) => {
    // When class changes, reset dependent filters
    if (filterName === "class") {
      setFilters({
        class: value,
        sections: [],
        groups: [],
        subject: null,
        semester: null,
      });
    }
    // When sections change, reset groups if sections are empty
    else if (filterName === "sections") {
      setFilters((prev) => ({
        ...prev,
        sections: value,
        groups: value.length > 0 ? prev.groups : [],
      }));
    }
    // Normal filter update
    else {
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
  };

  const removeFilter = (filterName) => {
    if (filterName === "class") {
      // Clearing class should clear all dependent filters
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

  // Other helper functions remain the same...
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
    // Store just the ID in state
    setEditingTimetable({ _id: timetableId });
  };

  // Update the confirmDelete function:
  const confirmDelete = () => {
    console.log(editingTimetable, "editingTimetableeditingTimetable");
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
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                type="default"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                // className="md:hidden"
                icon={<AiOutlineFilter />}
              >
                {sidebarCollapsed ? "Show Stats" : "Hide Stats"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Radio.Group
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="day">Day</Radio.Button>
                <Radio.Button value="week">Week</Radio.Button>
                <Radio.Button value="month">Month</Radio.Button>
              </Radio.Group>
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

        <NavigationControls
          selectedDate={selectedDate}
          viewMode={viewMode}
          setSelectedDate={setSelectedDate}
        />

        {/* Loading State */}
        {loadingFetch ? (
          <div className="space-y-4">
            {/* Skeleton Loaders */}
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
      </div>

      {/* Sidebar */}
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

      {/* Drawers and Modals */}
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

      <TimetableDetailsDrawer
        visible={detailsDrawerVisible}
        onClose={closeDetailsDrawer}
        timetable={detailsTimetable}
        onEdit={() => {
          closeDetailsDrawer();
          openDrawer(detailsTimetable);
        }}
        onDelete={(id) => onDeleteClick(id)} // Pass just the ID
      />

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
