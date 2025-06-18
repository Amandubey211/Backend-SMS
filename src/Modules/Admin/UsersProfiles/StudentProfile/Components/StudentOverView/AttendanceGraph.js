import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendanceData } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";

Chart.register(...registerables);

const AttendanceGraph = ({ cid }) => {
  const attendanceData = useSelector(
    (s) => s.admin.all_students.attendanceData
  );
  const dispatch = useDispatch();

  /* ── Local state skeleton ─────────────────────────────── */
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

  /* ── Data fetch ───────────────────────────────────────── */
  useEffect(() => {
    dispatch(fetchAttendanceData(cid));
  }, [dispatch, cid]);

  useEffect(() => {
    if (!attendanceData) return;

    const monthsFull = [
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

    const present = [],
      absent = [],
      leave = [];
    monthsFull.forEach((m) => {
      present.push(attendanceData[m]?.presentCount || 0);
      absent.push(attendanceData[m]?.absentCount || 0);
      leave.push(attendanceData[m]?.leaveCount || 0);
    });

    setChartData((prev) => ({
      ...prev,
      datasets: [
        { ...prev.datasets[0], data: present },
        { ...prev.datasets[1], data: absent },
        { ...prev.datasets[2], data: leave },
      ],
    }));
  }, [attendanceData]);

  /* ── Chart options ────────────────────────────────────── */
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#6B7280",
          font: { size: 12, weight: "600" },
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
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}`,
          title: (ctx) => `Month: ${ctx[0].label}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#E5E7EB", drawBorder: false },
        ticks: { color: "#6B7280", precision: 0, stepSize: 1 },
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: "#6B7280" },
      },
    },
    interaction: { intersect: false, mode: "index" },
  };

  /* ── Markup ───────────────────────────────────────────── */
  return (
    <div
      className="w-full bg-white rounded-xl p-6 overflow-x-auto no-scrollbar"
      /* flex: let canvas shrink; min-w stops jitter on tiny screens  */
      style={{ minWidth: "0" }}
    >
      <div className="min-w-[640px] h-[340px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AttendanceGraph;
