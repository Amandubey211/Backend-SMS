import React, { useEffect, useState, useMemo } from "react";
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
const { Option } = Select;

const StudentTimetablePage = () => {
  const { t } = useTranslation("admTimeTable");
  const dispatch = useDispatch();

  // Get user role and details from Redux store
  const role = useSelector((store) => store.common.auth.role);
  const { userDetails } = useSelector((store) => store.common.user);

  // State management
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [filterType, setFilterType] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [detailsTimetable, setDetailsTimetable] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [selectedTimeTable, setSelectedTimeTable] = useState("classTimeTable")

  // Redux selectors for data
  const { children = [], loading: loadingChildren } = useSelector(
    (state) => state.Parent.children
  );
  const studentTimetableData = useSelector(
    (state) => state.student?.studentTimetable
  );
  const parentTimetableData = useSelector(
    (state) => state.Parent?.parentTimetable.timetables
  );

  // Combined timetable data based on role
  const { timetables = [], loading: loadingFetch } =
    role === "student"
      ? studentTimetableData
      : role === "parent"
        ? parentTimetableData
        : { timetables: [], loading: false };

  // Set navigation heading
  useNavHeading(role, t("TimeTable"));

  // Fetch initial data based on role
  useEffect(() => {
    if (role === "student") {
      dispatch(fetchStudentTimetable());
    } else if (role === "parent") {
      dispatch(fetchChildren(userDetails.userId));
    }
  }, [dispatch, role, userDetails.userId]);

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

  const filteredTimetables = useMemo(() => {
    let result = timetables || [];

    // Filter by type if selected
    if (filterType) result = result?.filter((tt) => tt.type === filterType);

    // Filter by class
    if (classId) {
      result = result.filter((tt) => tt.classId?._id === classId);
    }

    // Filter by section if available
    if (sectionId) {
      result = result.filter((tt) => {
        if (!tt.sectionId || tt.sectionId.length === 0) return true;
        return tt.sectionId.some((section) =>
          typeof section === "object"
            ? section._id === sectionId
            : section === sectionId
        );
      });
    }

    return result;
  }, [timetables, filterType, classId, sectionId]);

  // Initialize export utilities
  const exportFunctions = new ExportFunctions({
    viewMode,
    selectedDate,
    timetables,
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
              selectedTimeTable === 'classTimeTable' ?
                <AscTimeTableView selectedClass={classId} selectedSection={sectionId} /> :
                <TimetableViews
                  loadingFetch={loadingFetch}
                  loadingChildren={loadingChildren}
                  role={role}
                  viewMode={viewMode}
                  selectedDate={selectedDate}
                  filteredTimetables={filteredTimetables}
                  onEventClick={onEventClick}
                  setSelectedDate={setSelectedDate}
                  t={t}
                />
            }


          </div>

          {/* Stats Sidebar */}
          {!sidebarCollapsed && (
            <StatsSidebar
              loadingFetch={loadingFetch}
              loadingChildren={loadingChildren}
              role={role}
              filteredTimetables={timetables}
              TIMETABLE_TYPES={TIMETABLE_TYPES}
              filterType={filterType}
              setFilterType={setFilterType}
              clearAllFilters={clearAllFilters}
              exportFunctions={exportFunctions}
              userDetails={userDetails}
              children={children}
              selectedChildId={selectedChildId}
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