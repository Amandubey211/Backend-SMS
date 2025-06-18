import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAttendanceData } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";

Chart.register(...registerables);

const AttendanceGraph = ({ cid }) => {
  const attendanceData = useSelector(
    (store) => store.admin.all_students.attendanceData
  );

  const dispatch = useDispatch();

  const [chartData, setChartData] = useState({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Present",
        data: Array(12).fill(0),
        borderColor: "#4ADE80",
        backgroundColor: "rgba(74, 222, 128, 0.1)",
        borderWidth: 3,
        tension: 0.3,
        pointBackgroundColor: "#4ADE80",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Absent",
        data: Array(12).fill(0),
        borderColor: "#F87171",
        backgroundColor: "rgba(248, 113, 113, 0.1)",
        borderWidth: 3,
        tension: 0.3,
        pointBackgroundColor: "#F87171",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Leave",
        data: Array(12).fill(0),
        borderColor: "#60A5FA",
        backgroundColor: "rgba(96, 165, 250, 0.1)",
        borderWidth: 3,
        tension: 0.3,
        pointBackgroundColor: "#60A5FA",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  });

  useEffect(() => {
    dispatch(fetchAttendanceData(cid));
  }, [dispatch, cid]);

  useEffect(() => {
    if (attendanceData) {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const presentData = [];
      const absentData = [];
      const leaveData = [];

      months.forEach((month) => {
        presentData.push(attendanceData[month]?.presentCount || 0);
        absentData.push(attendanceData[month]?.absentCount || 0);
        leaveData.push(attendanceData[month]?.leaveCount || 0);
      });

      setChartData((prev) => ({
        ...prev,
        datasets: [
          { ...prev.datasets[0], data: presentData },
          { ...prev.datasets[1], data: absentData },
          { ...prev.datasets[2], data: leaveData },
        ],
      }));
    }
  }, [attendanceData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#6B7280",
          font: {
            size: 12,
            weight: "600",
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        borderColor: "#374151",
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            return ` ${context.dataset.label}: ${context.raw}`;
          },
          title: function (context) {
            return `Month: ${context[0].label}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#E5E7EB",
          drawBorder: false,
        },
        ticks: {
          color: "#6B7280",
          precision: 0,
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#6B7280",
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <div className="w-full h-[400px] bg-white rounded-xl p-8 ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Monthly Attendance Overview
        </h3>
        {/* <div className="flex gap-2">
          <span className="text-xs text-gray-500">
            Academic Year: {new Date().getFullYear()}
          </span>
        </div> */}
      </div>
      <div className="w-full h-[calc(100%-40px)]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AttendanceGraph;
