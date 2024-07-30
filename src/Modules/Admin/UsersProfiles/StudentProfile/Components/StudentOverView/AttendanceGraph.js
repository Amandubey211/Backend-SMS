import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../../config/Common";
import { useParams } from "react-router-dom";
Chart.register(...registerables);

const AttendanceGraph = () => {
  const { cid } = useParams();
  const role = useSelector((store) => store.Auth.role);

  const [chartData, setChartData] = useState({
    labels: [
      "months",
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
        data: Array(13).fill(0),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Absent",
        data: Array(13).fill(0),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Leave",
        data: Array(13).fill(0),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.4,
        fill: false,
      },
    ],
  });

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem(`${role}:token`);
      if (!token) {
        throw new Error("Authentication not found");
      }

      const response = await axios.get(
        `${baseUrl}/api/teacher/attendance/studentAttendance?startDate=2000-05-10&endDate=2024-06-10&studentId=${cid}`,
        {
          headers: {
            Authentication: token,
          }
        }
      );

      const updatedData = { ...chartData };
      response?.data.report.report.forEach((e) => {
        let a = e.date.slice(5, 7);
        if (a.slice(0, 1)[0] === "0") {
          a = a.slice(1, 2);
        }
        if (e.status === "absent") {
          updatedData.datasets[1].data[a] += 1;
        }
        if (e.status === "present") {
          updatedData.datasets[0].data[a] += 1;
        }
        if (e.status === "leave") {
          updatedData.datasets[2].data[a] += 1;
        }
      });
      setChartData(updatedData);

    } catch (error) {
      console.error("Failed to fetch Attendance:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,

        grid: {
          display: false,
        },
        ticks: {
          precision: 0,
          stepSize: 1,

          callback: function (value) {
            return value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default AttendanceGraph;
