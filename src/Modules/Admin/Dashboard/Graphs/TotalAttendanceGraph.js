import React, { useEffect, useState, memo } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendanceData } from "../../../../Store/Slices/Admin/Dashboard/adminDashboard.action"; // Adjust path if needed
import Spinner from "../../../../Components/Common/Spinner";

const TotalAttendanceGraph = () => {
  const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [gender, setGender] = useState("Both"); // New state for gender filter

  const dispatch = useDispatch();
  const { attendanceData, loading } = useSelector(
    (state) => state?.admin?.adminDashboard
  );

  useEffect(() => {
    dispatch(fetchAttendanceData({ month, year }));
  }, [month, year, dispatch]);

  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    const attendance = attendanceData?.attendanceData || [];

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
      (item) => item.femaleAttendance || 0
    );
    const maleAttendance = sortedAttendance.map(
      (item) => item.maleAttendance || 0
    );

    const filteredData = {
      labels: labels,
      datasets: [
        gender === "Female" || gender === "Both"
          ? {
              label: "Female",
              data: femaleAttendance,
              backgroundColor: "#8F77F3",
              borderRadius: 10,
              borderWidth: 1,
              stack: "combined",
              barThickness: 30,
            }
          : null,
        gender === "Male" || gender === "Both"
          ? {
              label: "Male",
              data: maleAttendance,
              backgroundColor: "#23C55E",
              borderRadius: 10,
              borderWidth: 1,
              stack: "combined",
              barThickness: 30,
            }
          : null,
      ].filter(Boolean),
    };

    setGraphData(filteredData);
  }, [attendanceData, gender]);

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(e.target.value === "Current Year" ? currentYear : currentYear - 1);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const availableYears = [
    { label: "Current Year", value: "Current Year" },
    { label: "Past Year", value: "Past Year" },
  ];

  const yearLabel = year === currentYear ? "Current Year" : "Past Year";

  return (
    <div className="bg-white p-4 h-[100%] border border-red">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Today's Attendance</h2>
          <div className="text-3xl font-bold">
            {attendanceData
              ? attendanceData.totalMaleAttendance +
                attendanceData.totalFemaleAttendance
              : 0}
          </div>
        </div>
        <div className="flex space-x-2">
          <select
            className="border rounded p-2"
            onChange={handleMonthChange}
            value={month}
          >
            {[...Array(12).keys()].map((i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            className="border rounded p-2"
            onChange={handleYearChange}
            value={yearLabel}
          >
            {availableYears.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="border rounded p-2"
            onChange={handleGenderChange}
            value={gender}
          >
            <option value="Both">Both</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <Spinner />
        </div>

      ) : error ? (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <FiAlertCircle className="w-12 h-12 mb-2" />
          <p>{`Error: ${error}`}</p>
        </div>
      ) : !attendanceData || attendanceData?.attendanceData?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-400 h-full">
          <FiCalendar className="w-12 h-12 mb-2" />
          <p>No Attendance Data Found</p>
        </div>
      ) : graphData ? (

        <>
          <div style={{ height: "300px" }}>
            <Bar
              data={graphData || { datasets: [], labels: [] }} // Show empty graph if no data
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
                    titleFont: { size: 14, weight: "bold" },
                    bodyFont: { size: 14 },
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
                  legend: { display: false },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>

          <div className="flex justify-around mt-4">
            <div className="flex flex-col items-start">
              <div className="w-16 h-1 bg-[#8F77F3] rounded-full mb-1"></div>
              <div className="flex items-center">
                <div className="text-gray-700">Total Female Att.</div>
                <div className="ml-2 font-bold">
                  {attendanceData ? attendanceData.totalFemaleAttendance : 0}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="w-16 h-1 bg-[#23C55E] rounded-full mb-1"></div>
              <div className="flex items-center">
                <div className="text-gray-700">Total Male Att.</div>
                <div className="ml-2 font-bold">
                  {attendanceData ? attendanceData.totalMaleAttendance : 0}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(TotalAttendanceGraph);
