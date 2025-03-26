import React, { useEffect, useState, useMemo } from "react";
import StudentDashLayout from "../../../Components/Student/StudentDashLayout";
import Layout from "../../../Components/Common/Layout";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudentTimetable } from "../../../Store/Slices/Student/TimeTable/studentTimeTable.action";
import { fetchParentTimetable } from "../../../Store/Slices/Parent/TimeTable/parentTimeTable.action";
import {
  Radio,
  Button,
  Skeleton,
  Divider,
  Popover,
  Card,
  Tag,
  Drawer,
  Table,
  Avatar,
} from "antd";
import {
  AiOutlineFilePdf,
  AiOutlinePrinter,
  AiOutlineFilter,
  AiOutlineClear,
} from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { Doughnut } from "react-chartjs-2";
import {
  CalendarOutlined,
  BookOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import NavigationControls from "../../Admin/TimeTables/Components/NavigationControls";
import DayView from "../../Admin/TimeTables/Views/DayView";
import WeekView from "../../Admin/TimeTables/Views/WeekView";
import MonthView from "../../Admin/TimeTables/Views/MonthView";
import { format } from "date-fns";
import ExportFunctions from "../../../Utils/timetableUtils";
import ParentDashLayout from "../../../Components/Parents/ParentDashLayout";
import { fetchChildren } from "../../../Store/Slices/Parent/Children/children.action";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";

const StudentTimetablePage = () => {
  const { t } = useTranslation("admTimeTable");
  const dispatch = useDispatch();
  const role = useSelector((store) => store.common.auth.role);
  const { userDetails } = useSelector((store) => store.common.user);

  // For parent role - children data
  const { children = [], loading: loadingChildren } = useSelector(
    (state) => state.Parent.children
  );
  const [selectedChildId, setSelectedChildId] = useState(null);

  // Select timetable data based on role
  const studentTimetableData = useSelector(
    (state) => state.student?.studentTimetable
  );
  const parentTimetableData = useSelector(
    (state) => state.Parent?.parentTimetable.timetables
  );
  console.log(parentTimetableData.timetables, "parentTimetableData");
  const { timetables = [], loading: loadingFetch } =
    role === "student"
      ? studentTimetableData
      : role === "parent"
      ? parentTimetableData
      : { timetables: [], loading: false };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [filterType, setFilterType] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [detailsTimetable, setDetailsTimetable] = useState(null);

  // Set navigation heading
  useNavHeading(role, t("TimeTable"));

  useEffect(() => {
    if (role === "student") {
      dispatch(fetchStudentTimetable());
    } else if (role === "parent") {
      dispatch(fetchChildren(userDetails.userId));
    }
  }, [dispatch, role, userDetails.userId]);

  // When children data is loaded for parent, select first child by default
  useEffect(() => {
    if (role === "parent" && children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, role, selectedChildId]);

  // Fetch timetable for selected child when it changes
  useEffect(() => {
    if (role === "parent" && selectedChildId) {
      dispatch(fetchParentTimetable(selectedChildId));
    }
  }, [dispatch, role, selectedChildId]);

  // Get student's/parent's class and sections for filtering
  const getFilterInfo = () => {
    if (role === "student") {
      return {
        classId: userDetails.classId,
        sections: [], // Student may not have section info in userDetails
      };
    } else if (role === "parent" && selectedChildId) {
      const selectedChild = children.find(
        (child) => child.id === selectedChildId
      );
      return {
        classId: selectedChild?.presentClassId,
        sections: selectedChild?.section ? [selectedChild.section] : [],
      };
    }
    return { classId: null, sections: [] };
  };
  console.log(selectedChildId, "selectedChildId");

  const { classId, sections } = getFilterInfo();

  const filteredTimetables = useMemo(() => {
    let result = timetables || [];

    // Filter by type if selected
    if (filterType) result = result?.filter((tt) => tt.type === filterType);

    // Filter by class
    console.log(classId, "sdfsdfsdfsdfsdfsdfsdfsdf");
    if (classId) {
      result = result.filter((tt) => tt.classId?._id === classId);
    }
    console.log(result, "result");
    // Filter by sections if available
    // if (sections.length > 0) {
    //   result = result.filter((tt) =>
    //     tt.sectionId?.some((section) => sections.includes(section._id))
    //   );
    // }

    return result;
  }, [timetables, filterType, classId, sections]);

  console.log(filteredTimetables, "sdfsdf");

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

  const exportContent = (
    <div className="flex flex-col gap-2 p-2">
      <Button
        icon={<AiOutlineFilePdf />}
        onClick={exportFunctions.handleExportPDF}
        className="flex items-center"
      >
        {t("Export as PDF")}
      </Button>
      <Button
        icon={<AiOutlinePrinter />}
        onClick={exportFunctions.handlePrint}
        className="flex items-center"
      >
        {t("Print")}
      </Button>
    </div>
  );

  const TIMETABLE_TYPES = [
    {
      type: "weekly",
      label: t("Weekly"),
      color: "#FF99CC",
      bgColor: "rgba(255,153,204,0.2)",
      icon: <CalendarOutlined className="text-lg" />,
    },
    {
      type: "exam",
      label: t("Exams"),
      color: "#29ABE2",
      bgColor: "rgba(41,171,226,0.2)",
      icon: <BookOutlined className="text-lg" />,
    },
    {
      type: "event",
      label: t("Events"),
      color: "#77DD77",
      bgColor: "rgba(119,221,119,0.2)",
      icon: <CalendarOutlined className="text-lg" />,
    },
    {
      type: "others",
      label: t("Others"),
      color: "#FFD700",
      bgColor: "rgba(255,215,0,0.2)",
      icon: <TeamOutlined className="text-lg" />,
    },
  ];

  // Get the appropriate dashboard layout based on role
  const DashboardLayout =
    role === "student" ? StudentDashLayout : ParentDashLayout;

  return (
    <Layout title="TimeTable | Student Diwan">
      <DashboardLayout>
        <div className="w-full min-h-screen flex">
          {/* Main Content */}
          <div
            className={`flex-1 p-4 transition-all ${
              sidebarCollapsed ? "mr-0" : "mr-72"
            }`}
          >
            {/* Children selector for parent role */}
            {role === "parent" && children.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  {t("Select Child")}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {children.map((child) => (
                    <Card
                      key={child.id}
                      onClick={() => setSelectedChildId(child.id)}
                      className={`cursor-pointer transition-all ${
                        selectedChildId === child.id
                          ? "border-blue-500 border-2"
                          : "border-gray-200"
                      }`}
                      bodyStyle={{ padding: "12px" }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={child.profile}
                          icon={<UserOutlined />}
                          size="large"
                        />
                        <div>
                          <div className="font-medium">{child.name}</div>
                          <div className="text-xs text-gray-600">
                            {child.class} • {child.section}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Header and Controls */}
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="default"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    icon={<AiOutlineFilter />}
                  >
                    {sidebarCollapsed ? t("Show Stats") : t("Hide Stats")}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Radio.Group
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="day">{t("Day")}</Radio.Button>
                    <Radio.Button value="week">{t("Week")}</Radio.Button>
                    <Radio.Button value="month">{t("Month")}</Radio.Button>
                  </Radio.Group>
                  <Popover
                    content={exportContent}
                    trigger="click"
                    placement="bottomRight"
                  >
                    <Button>{t("Export")}</Button>
                  </Popover>
                </div>
              </div>
            </div>

            <NavigationControls
              selectedDate={selectedDate}
              viewMode={viewMode}
              setSelectedDate={setSelectedDate}
            />

            {/* Loading State */}
            {loadingFetch || (role === "parent" && loadingChildren) ? (
              <div className="space-y-4">
                <Skeleton active paragraph={{ rows: 10 }} />
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

          {/* Stats Sidebar */}
          {!sidebarCollapsed && (
            <div className="w-72 border-l p-4 bg-white flex flex-col justify-between fixed right-0 h-full overflow-y-auto">
              {loadingFetch || (role === "parent" && loadingChildren) ? (
                <div className="space-y-4">
                  <Skeleton.Input
                    active
                    size="default"
                    style={{ width: 150 }}
                  />
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
                        <Skeleton.Input
                          active
                          size="small"
                          style={{ width: 30 }}
                        />
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
                  <div className="flex justify-between items-center px-1 mb-4">
                    <h3 className="text-lg font-semibold">
                      {t("Stats & Filters")}
                    </h3>
                    {filterType && (
                      <Button
                        type="default"
                        onClick={clearAllFilters}
                        icon={<AiOutlineClear />}
                        danger
                      >
                        {t("Clear")}
                      </Button>
                    )}
                  </div>

                  {/* Timetable Type Stats */}
                  <div className="space-y-2 mb-4">
                    {TIMETABLE_TYPES.map((stat) => {
                      const count = filteredTimetables.filter(
                        (t) => t.type === stat.type
                      ).length;
                      return (
                        <Card
                          key={stat.type}
                          className={`cursor-pointer transition-all ${
                            filterType === stat.type
                              ? "ring-2 ring-offset-4"
                              : ""
                          }`}
                          style={{
                            borderLeft: `4px solid ${stat.color}`,
                            transform:
                              filterType === stat.type
                                ? "scale(1.02)"
                                : "scale(1)",
                            height: "60px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                          onClick={() =>
                            setFilterType(
                              filterType === stat.type ? null : stat.type
                            )
                          }
                          bodyStyle={{ padding: "8px" }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className="w-8 h-8 flex items-center justify-center rounded mr-2"
                                style={{ backgroundColor: stat.bgColor }}
                              >
                                {stat.icon}
                              </div>
                              <span className="text-xs">{stat.label}</span>
                            </div>
                            <span
                              className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full"
                              style={{ backgroundColor: stat.color }}
                            >
                              {count}
                            </span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  <Divider />

                  {/* Doughnut Chart */}
                  <div className="border rounded p-4 mb-4">
                    <h4 className="font-semibold mb-2 text-center">
                      {t("Timetable Types")}
                    </h4>
                    {filteredTimetables.length > 0 ? (
                      <Doughnut
                        data={exportFunctions.getChartData()}
                        options={exportFunctions.getChartOptions()}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64">
                        <p className="text-gray-500">
                          {t("No timetable data available")}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="border rounded p-4">
                    <h4 className="font-semibold mb-2">
                      {role === "student"
                        ? t("Your Schedule Info")
                        : selectedChildId
                        ? t("Child's Schedule Info")
                        : t("Schedule Info")}
                    </h4>
                    <div className="space-y-2">
                      {role === "student" ? (
                        <>
                          <div>
                            <span className="text-gray-600 text-sm">
                              {t("Class:")}
                            </span>
                            <Tag color="blue" className="ml-2">
                              {userDetails.className || t("No Class")}
                            </Tag>
                          </div>
                        </>
                      ) : selectedChildId ? (
                        <>
                          <div>
                            <span className="text-gray-600 text-sm">
                              {t("Child:")}
                            </span>
                            <Tag color="blue" className="ml-2">
                              {children.find((c) => c.id === selectedChildId)
                                ?.name || t("No Child Selected")}
                            </Tag>
                          </div>
                          <div>
                            <span className="text-gray-600 text-sm">
                              {t("Class:")}
                            </span>
                            <Tag color="blue" className="ml-2">
                              {children.find((c) => c.id === selectedChildId)
                                ?.class || t("No Class")}
                            </Tag>
                          </div>
                          <div>
                            <span className="text-gray-600 text-sm">
                              {t("Section:")}
                            </span>
                            <Tag color="purple" className="ml-2">
                              {children.find((c) => c.id === selectedChildId)
                                ?.section || t("No Section")}
                            </Tag>
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-500 text-sm">
                          {t("No child selected")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timetable Details Drawer */}
        {detailsTimetable && (
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
                  <motion.div
                    key="detailsDrawer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-2xl text-gray-900">
                        {detailsTimetable?.name || "Untitled Timetable"}
                      </h4>
                      <div className="flex flex-col items-center">
                        <div
                          className="w-16 h-16 flex items-center justify-center rounded mb-1"
                          style={{
                            backgroundColor:
                              TIMETABLE_TYPES.find(
                                (t) => t.type === detailsTimetable?.type
                              )?.bgColor || "#f0f0f0",
                          }}
                        >
                          <div className="text-4xl text-gray-800">
                            {TIMETABLE_TYPES.find(
                              (t) => t.type === detailsTimetable?.type
                            )?.icon || null}
                          </div>
                        </div>
                        <span className="text-sm text-gray-700">
                          {detailsTimetable?.type?.toUpperCase() || "UNKNOWN"}
                        </span>
                      </div>
                    </div>

                    {/* Basic Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-gray-600 text-sm">Class:</h5>
                        <div className="mt-1">
                          {detailsTimetable?.classId ? (
                            <Tag color="blue">
                              {detailsTimetable?.classId?.className ||
                                "No Class Name"}
                            </Tag>
                          ) : (
                            <Tag color="blue">No Class</Tag>
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-gray-600 text-sm">Status:</h5>
                        <Tag
                          color={
                            detailsTimetable?.status === "active"
                              ? "green"
                              : "red"
                          }
                          className="mt-1"
                        >
                          {detailsTimetable?.status || "inactive"}
                        </Tag>
                      </div>

                      <div>
                        <h5 className="text-gray-600 text-sm">Sections:</h5>
                        <div className="mt-1 flex flex-wrap gap-1">
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
                      </div>

                      <div>
                        <h5 className="text-gray-600 text-sm">Groups:</h5>
                        <div className="mt-1 flex flex-wrap gap-1">
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

                      <div>
                        <h5 className="text-gray-600 text-sm">Semester:</h5>
                        <p className="text-sm text-gray-800">
                          {detailsTimetable?.semesterId?.title || "No Semester"}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Card
                          className="flex-1 border p-2 rounded"
                          style={{ backgroundColor: "#f7f7f7" }}
                        >
                          <p className="text-sm text-gray-500">
                            Available From:
                          </p>
                          <p className="text-sm text-gray-800 font-semibold">
                            {detailsTimetable?.validity?.startDate
                              ? format(
                                  new Date(
                                    detailsTimetable?.validity?.startDate
                                  ),
                                  "M/d/yyyy"
                                )
                              : "N/A"}
                          </p>
                        </Card>
                        <Card
                          className="flex-1 border p-2 rounded"
                          style={{ backgroundColor: "#f7f7f7" }}
                        >
                          <p className="text-sm text-gray-500">Due Date:</p>
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
                    </div>

                    <Divider />

                    {/* Schedule Table */}
                    <h5 className="font-medium text-gray-800">Schedule:</h5>
                    <Table
                      columns={[
                        {
                          title: "Day/Date",
                          dataIndex: "dayDate",
                          key: "dayDate",
                          render: (_, record) =>
                            record.date
                              ? format(new Date(record.date), "dd MMM yyyy")
                              : record.day || "Weekly",
                        },
                        {
                          title: "Time",
                          dataIndex: "time",
                          key: "time",
                          render: (_, record) =>
                            `${dayjs(record.startTime).format(
                              "HH:mm"
                            )} - ${dayjs(record.endTime).format("HH:mm")}`,
                        },
                        {
                          title: "Subject/Event",
                          dataIndex: "subject",
                          key: "subject",
                          render: (_, record) =>
                            record.subjectId?.name || record.eventName || "N/A",
                        },
                        {
                          title: "Teacher",
                          dataIndex: "teacher",
                          key: "teacher",
                          render: (_, record) =>
                            record.teacherId?.name || "N/A",
                        },
                      ]}
                      dataSource={detailsTimetable.days?.flatMap(
                        (day) =>
                          day.slots?.map((slot) => ({
                            key: `${day.day || day.date}-${slot.startTime}-${
                              slot.endTime
                            }`,
                            ...day,
                            ...slot,
                          })) || []
                      )}
                      pagination={false}
                      size="small"
                      scroll={{ x: true }}
                      className="mt-2"
                      locale={{
                        emptyText: "No schedule data available",
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Drawer>
        )}
      </DashboardLayout>
    </Layout>
  );
};

export default StudentTimetablePage;
