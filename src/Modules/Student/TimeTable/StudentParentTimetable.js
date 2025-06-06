import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudentTimetable } from "../../../Store/Slices/Student/TimeTable/studentTimeTable.action";
import { fetchParentTimetable } from "../../../Store/Slices/Parent/TimeTable/parentTimeTable.action";
import { fetchChildren } from "../../../Store/Slices/Parent/Children/children.action";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { format } from "date-fns";
// Layout Components
import Layout from "../../../Components/Common/Layout";
import StudentDashLayout from "../../../Components/Student/StudentDashLayout";
import ParentDashLayout from "../../../Components/Parents/ParentDashLayout";

// Sub-components
import ChildrenSelector from "./Components/ChildrenSelector";
import TimetableHeader from "./Components/TimetableHeader";
import TimetableViews from "./Components/TimetableViews";
import StatsSidebar from "./Components/StatsSidebar";
import TimetableDetailsDrawer from "./Components/TimetableDetailsDrawer";

// Constants and Utilities
import ExportFunctions from "../../../Utils/timetableUtils";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { TIMETABLE_TYPES } from "./Components/constants";
import { Select } from 'antd';
import AscTimeTableView from "./Components/AscTimeTableView";
import { fetchGroupsByClassAndSection, fetchGroupsByStudent } from "../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchTimetableList } from "../../../Store/Slices/Admin/TimeTable/timetable.action";
const { Option } = Select;

const StudentTimetablePage = () => {
  const { t } = useTranslation("admTimeTable");
  const dispatch = useDispatch();

  // State management
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [filterType, setFilterType] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [detailsTimetable, setDetailsTimetable] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [selectedTimeTable, setSelectedTimeTable] = useState("classTimeTable")
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

  // Get user role and details from Redux store
  const role = useSelector((store) => store.common.auth.role);
  const { userDetails } = useSelector((store) => store.common.user);
  // Redux selectors for data
  const { children = [], loading: loadingChildren } = useSelector(
    (state) => state.Parent.children
  );
  const {
    timetables = [],
    counts,
    loadingFetch,
    pagination = {}, // We'll store total, page, limit in here
  } = useSelector(
    (state) => state.student?.studentTimetable
  );
  const parentTimetableData = useSelector(
    (state) => state.Parent?.parentTimetable.timetables
  );
  const studentGroup = useSelector(
    (state) => state.admin.group_section.groupsList
  )

  // Set navigation heading
  useNavHeading(role, t("TimeTable"));

  useEffect(() => {
    if (role === 'student') {
      dispatch(
        fetchGroupsByStudent({
          studentId: userDetails.userId,
        })
      );
    } else if (role === 'teacher') {
      dispatch(
        fetchGroupsByStudent({
          studentId: selectedChildId,
        })
      );
    }

  }, [dispatch, userDetails.userId]);
  // Fetch initial data based on role


  // Set default child for parent role
  useEffect(() => {
    if (role === "parent" && children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, role, selectedChildId]);

  // Fetch timetable for selected child
  useEffect(() => {
    if (role === "parent" && selectedChildId) {
      dispatch(fetchParentTimetable(selectedChildId));
    }
  }, [dispatch, role, selectedChildId]);

  /**
   * Gets filter information (class and section) based on role
   * @returns {Object} Contains classId and sectionId
   */
  const getFilterInfo = () => {
    if (role === "student") {
      return {
        classId: userDetails.classId,
        sectionId: userDetails.sectionId,
      };
    } else if (role === "parent" && selectedChildId) {
      const selectedChild = children.find(
        (child) => child.id === selectedChildId
      );
      return {
        classId: selectedChild?.presentClassId,
        sectionId: selectedChild?.sectionId,
      };
    }
    return { classId: null, sectionId: null };
  };

  const { classId, sectionId } = getFilterInfo();

    const fetchTimetables = useCallback(
    (params = {}) => {
      const queryParams = {
        page: paginationConfig.current,
        limit: paginationConfig.pageSize,
      };
      if (role === 'student') {
        queryParams.classId = userDetails?.classId
          queryParams.sectionId = userDetails?.sectionId
      }
      else if (role === 'teacher') {
        queryParams.classId = classId
          queryParams.sectionId = sectionId 
      }
      if (studentGroup) {
        queryParams.groupId = studentGroup?.id || studentGroup._id
      }

      dispatch(fetchStudentTimetable(queryParams))
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
    [dispatch, filters, paginationConfig]
  );
  useEffect(() => {
    fetchTimetables()
  }, [dispatch, role, userDetails?.userId, classId, sectionId, studentGroup]);
 

    const filteredTimetables = useMemo(() => {
      let result = [...timetables];
  
      // If in calendar view, only show those with showCalendar = true
      // if (activeTab === "calendar") {
      //   result = result.filter((t) => t.showCalendar === true);
      // }
      
      // Additionally filter by type if selected via StatsSection
      if (filters.type) {
        result = result.filter((t) => t.type === filters.type);
      }
  
      return result;
    }, [timetables,  filters.type]);
  // Initialize export utilities
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

  // Event handlers
  const onEventClick = (timetable) => {
    setDetailsTimetable(timetable);
    setDetailsDrawerVisible(true);
  };

  const closeDetailsDrawer = () => {
    setDetailsDrawerVisible(false);
    setDetailsTimetable(null);
  };

  const clearAllFilters = () => {
    setFilterType(null);
  };
  // Get the appropriate dashboard layout based on role
  const DashboardLayout =
    role === "student" ? StudentDashLayout : ParentDashLayout;

  return (
    <Layout title="TimeTable | Student Diwan">
      <DashboardLayout>
        <div className="w-full min-h-screen flex">
          {/* Main Content */}
          <div
            className={`flex-1 p-4 transition-all ${sidebarCollapsed ? "mr-0" : "mr-72"
              }`}
          >
            {/* Children selector for parent role */}
            {role === "parent" && (
              <ChildrenSelector
                children={children}
                selectedChildId={selectedChildId}
                setSelectedChildId={setSelectedChildId}
                t={t}
              />
            )}

            {/* Header and Controls */}
            {
              role === "student" && <TimetableHeader
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                viewMode={viewMode}
                setViewMode={setViewMode}
                exportFunctions={exportFunctions}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                timetables={filteredTimetables}
                counts={counts}
                pagination={pagination}
                loadingFetch={loadingFetch}
                t={t}
              />
            }
            {
              role === "parent" && <div className="my-6 flex justify-end">
                <Select
                  style={{ width: 150 }}
                  onChange={setSelectedTimeTable}
                  placeholder="Select Section"
                  value={selectedTimeTable}
                >
                  <Option value="classTimeTable">
                    Class TimeTable
                  </Option>
                  <Option value="others">
                    Others
                  </Option>
                </Select>
              </div>
            }

            {/* Timetable Views */}
            {
              role === 'parent' && (
                selectedTimeTable === 'classTimeTable' ?
                  <AscTimeTableView selectedClass={classId} selectedSection={sectionId} /> :
                  <TimetableViews
                    loadingFetch={loadingFetch}
                    loadingChildren={loadingChildren}
                    role={role}
                    viewMode={viewMode}
                    selectedDate={selectedDate}
                    timetables={filteredTimetables}
                    pagination={pagination}
                    onEventClick={onEventClick}
                    setSelectedDate={setSelectedDate}
                    t={t}
                  />
              )
            }


          </div>

          {/* Stats Sidebar */}
          {!sidebarCollapsed && (
            <StatsSidebar
              loadingFetch={loadingFetch}
              loadingChildren={loadingChildren}
              role={role}
              filteredTimetables={filteredTimetables}
              TIMETABLE_TYPES={TIMETABLE_TYPES}
              filterType={filterType}
              setFilterType={setFilterType}
              clearAllFilters={clearAllFilters}
              exportFunctions={exportFunctions}
              userDetails={userDetails}
              children={children}
              selectedChildId={selectedChildId}
              sidebarCollapsed={sidebarCollapsed}
              t={t}
            />
          )}
        </div>

        {/* Timetable Details Drawer */}
        {detailsTimetable && (
          <TimetableDetailsDrawer
            visible={detailsDrawerVisible}
            onClose={closeDetailsDrawer}
            timetable={detailsTimetable}
            TIMETABLE_TYPES={TIMETABLE_TYPES}
            t={t}
          />
        )}
      </DashboardLayout>
    </Layout>
  );
};

export default StudentTimetablePage;