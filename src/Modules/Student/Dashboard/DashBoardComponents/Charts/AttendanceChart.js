import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler, // ✅ Import Filler for smooth curves with background fill
} from "chart.js";

// ✅ Register required Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Helper function to get the number of days in a month dynamically
const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

const AttendanceChart = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const months = [
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
  ];

  // Calculate days in each month dynamically
  const daysInMonths = months.map((_, index) =>
    getDaysInMonth(index, currentYear)
  );

  // Determine max attendance dynamically
  const maxAttendance = Math.max(
    ...data.flatMap((month) => [
      month.present || 0,
      month.absent || 0,
      month.leave || 0,
    ])
  );

  // Set suggested max based on attendance
  const suggestedMax = maxAttendance <= 5 ? 5 : maxAttendance + 2;

  // Prepare chart data
  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Present",
        data: data.map((month) => month.present || 0),
        backgroundColor: "rgba(75, 192, 75, 0.2)", // ✅ Light green fill
        borderColor: "rgba(75, 192, 75, 1)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "rgba(75, 192, 75, 1)",
        tension: 0.4, // ✅ Smooth curve
        fill: true,
      },
      {
        label: "Absent",
        data: data.map((month) => month.absent || 0),
        backgroundColor: "rgba(255, 99, 132, 0.2)", // ✅ Light red fill
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Leave",
        data: data.map((month) => month.leave || 0),
        backgroundColor: "rgba(255, 159, 64, 0.2)", // ✅ Light orange fill
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "rgba(255, 159, 64, 1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Attendance",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: suggestedMax, // ✅ Set max dynamically
        ticks: {
          stepSize: 1,
          callback: (value) => `${value} Days`, // ✅ Show "Days" label
        },
      },
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AttendanceChart;
