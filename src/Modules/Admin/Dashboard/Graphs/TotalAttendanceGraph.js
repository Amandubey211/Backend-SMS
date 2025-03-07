import React, { useEffect, useState, memo } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendanceData } from "../../../../Store/Slices/Admin/Dashboard/adminDashboard.action";
import { FiCalendar, FiAlertCircle } from "react-icons/fi";
import { Skeleton, Select } from "antd";
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";

const { Option } = Select;

// Custom skeleton component simulating a bar graph for attendance data
const BarGraphSkeleton = () => {
  const numberOfBars = 10;
  const bars = Array.from({ length: numberOfBars });
  return (
    <div className="flex items-end space-x-6 h-72">
      {bars.map((_, index) => (
        <div
          key={index}
          className="bg-gray-300 rounded animate-pulse"
          style={{
            width: "20px",
            height: `${Math.floor(Math.random() * 60) + 40}%`,
          }}
        ></div>
      ))}
    </div>
  );
};

const TotalAttendanceGraph = () => {
  const { t } = useTranslation("admDashboad");
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [gender, setGender] = useState("Both");

  const dispatch = useDispatch();

  const {
    attendanceData,
    loadingAttendance: loading,
    errorAttendance: error,
  } = useSelector((state) => state?.admin?.adminDashboard);

  useEffect(() => {
    dispatch(fetchAttendanceData({ month, year }));
  }, [month, year, dispatch]);

  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    if (attendanceData && attendanceData.attendanceData) {
      const attendance = attendanceData.attendanceData;

      // Sort classes numerically and place unnamed classes at the end
      const sortedAttendance = [...attendance].sort((a, b) => {
        const extractNumber = (str) => {
          const match = str.match(/\d+/);
          return match ? parseInt(match[0]) : Infinity;
        };

        const numA = extractNumber(a.className);
        const numB = extractNumber(b.className);

        if (numA !== numB) {
          return numA - numB;
        } else {
          return a.className.localeCompare(b.className);
        }
      });

      const labels = sortedAttendance.map((item) => item.className);
      const femaleAttendance = sortedAttendance.map(
        (item) => item.femaleAttendance
      );
      const maleAttendance = sortedAttendance.map(
        (item) => item.maleAttendance
      );

      const filteredData = {
        labels: labels,
        datasets: [
          (gender === "Female" || gender === "Both") && {
            label: t("Female"),
            data: femaleAttendance,
            backgroundColor: "#8F77F3",
            borderRadius: 10,
            borderWidth: 1,
            stack: "combined",
            barThickness: 30,
          },
          (gender === "Male" || gender === "Both") && {
            label: t("Male"),
            data: maleAttendance,
            backgroundColor: "#23C55E",
            borderRadius: 10,
            borderWidth: 1,
            stack: "combined",
            barThickness: 30,
          },
        ].filter(Boolean),
      };

      setGraphData(filteredData);
    } else {
      setGraphData(null);
    }
  }, [attendanceData, gender, t]);

  // Using Ant Design's Select: onChange receives the value directly
  const handleMonthChange = (value) => setMonth(value);

  const handleYearChange = (value) => {
    if (value === "Current Year") {
      setYear(currentYear);
    } else if (value === "Past Year") {
      setYear(currentYear - 1);
    }
  };

  const handleGenderChange = (value) => setGender(value);

  // Generate array of years dynamically
  const availableYears = [
    { label: t("Current Year"), value: "Current Year" },
    { label: t("Past Year"), value: "Past Year" },
  ];

  // Determine the label for the current year state
  const yearLabel = year === currentYear ? t("Current Year") : t("Past Year");

  return (
    <ProtectedSection
      requiredPermission={PERMISSIONS.GET_GRAPH_STUDENT_ATTENDENCE}
      title={t("Attendence")}
    >
      <div className="bg-white p-4 h-[100%]">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2 p-2 rounded-md">
            {/* Icon with circular background */}
            {/* <div className="bg-blue-100 p-1 rounded-full">
              <FiCalendar className="text-blue-500" size={20} />
            </div> */}
            {/* Textual Information in a single row */}
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="text-base font-semibold">
                {t("Total Attendance")} :
              </span>
              <span className="text-lg font-semibold">
                {attendanceData
                  ? attendanceData.totalMaleAttendance +
                    attendanceData.totalFemaleAttendance
                  : 0}
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Select onChange={handleMonthChange} value={month} className="w-28">
              {[...Array(12).keys()].map((i) => (
                <Option key={i} value={i + 1}>
                  {t(
                    new Date(0, i).toLocaleString("default", { month: "short" })
                  )}
                </Option>
              ))}
            </Select>

            <Select
              onChange={handleYearChange}
              value={yearLabel}
              className="w-32"
            >
              {availableYears.map(({ label, value }) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>

            <Select
              onChange={handleGenderChange}
              value={gender}
              className="w-28"
            >
              <Option value="Both">{t("Both")}</Option>
              <Option value="Male">{t("Male")}</Option>
              <Option value="Female">{t("Female")}</Option>
            </Select>
          </div>
        </div>

        {loading ? (
          // Show custom bar graph skeleton UI when loading
          <div className="bg-white p-4 h-[100%]">
            <div
              className="flex justify-center items-center"
              style={{ height: "350px" }}
            >
              <BarGraphSkeleton />
            </div>
            <div className="flex justify-around mt-6">
              <Skeleton.Input style={{ width: 100, height: 20 }} active />
              <Skeleton.Input style={{ width: 100, height: 20 }} active />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <FiAlertCircle className="w-12 h-12 mb-2" />
            <p>{`${t("Error")}: ${error}`}</p>
          </div>
        ) : !attendanceData || attendanceData?.attendanceData?.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 h-full">
            <FiCalendar className="w-12 h-12 mb-2" />
            <p>{t("No Attendance Data Found")}</p>
          </div>
        ) : graphData ? (
          <>
            <div style={{ height: "350px" }}>
              <Bar
                data={graphData}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      stacked: true,
                      ticks: {
                        stepSize: 100,
                        max: 500,
                      },
                    },
                    x: {
                      stacked: true,
                      barPercentage: 0.5,
                    },
                  },
                  plugins: {
                    tooltip: {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      titleFont: {
                        size: 14,
                        weight: "bold",
                      },
                      bodyFont: {
                        size: 14,
                      },
                      displayColors: true,
                      usePointStyle: true,
                      boxWidth: 10,
                      boxHeight: 10,
                      callbacks: {
                        label: function (context) {
                          const value = context.raw.toLocaleString();
                          const label = context.dataset.label;
                          return `${label}: ${value}`;
                        },
                        title: function () {
                          return "";
                        },
                      },
                    },
                    legend: {
                      display: false,
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
            <div className="flex justify-around mt-6">
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <div className="text-gray-700">{t("Total Female Att.")}</div>
                  <div className="ml-2 font-bold">
                    {attendanceData ? attendanceData.totalFemaleAttendance : 0}
                  </div>
                </div>
                <div
                  className="w-16 h-1 mt-2 bg-[#8F77F3] rounded-full mb-1"
                  style={{ alignSelf: "flex-start" }}
                ></div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <div className="text-gray-700">{t("Total Male Att.")}</div>
                  <div className="ml-2 font-bold">
                    {attendanceData ? attendanceData.totalMaleAttendance : 0}
                  </div>
                </div>
                <div
                  className="w-16 h-1 mt-2 bg-[#23C55E] rounded-full mb-1"
                  style={{ alignSelf: "flex-start" }}
                ></div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </ProtectedSection>
  );
};

export default memo(TotalAttendanceGraph);
