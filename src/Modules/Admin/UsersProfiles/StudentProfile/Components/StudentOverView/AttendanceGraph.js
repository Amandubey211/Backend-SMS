import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAttendanceData } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";

Chart.register(...registerables);

const AttendanceGraph = () => {
  const { cid } = useParams();
  const attendanceData = useSelector((store) => store.admin.all_students.attendanceData);
  const dispatch = useDispatch();

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
      { label: "Present", data: Array(13).fill(0), borderColor: "rgba(75, 192, 192, 1)", backgroundColor: "rgba(75, 192, 192, 0.2)", tension: 0.4, fill: false },
      { label: "Absent", data: Array(13).fill(0), borderColor: "rgba(255, 99, 132, 1)", backgroundColor: "rgba(255, 99, 132, 0.2)", tension: 0.4, fill: false },
      { label: "Leave", data: Array(13).fill(0), borderColor: "rgba(153, 102, 255, 1)", backgroundColor: "rgba(153, 102, 255, 0.2)", tension: 0.4, fill: false },
    ],
  });

  useEffect(() => {
    dispatch(fetchAttendanceData(cid));
  }, [dispatch, cid]);

  useEffect(() => {
    if (attendanceData) {
      const updatedData = { ...chartData };
      
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      months.forEach((month, index) => {
        updatedData.datasets[0].data[index + 1] = attendanceData[month]?.presentCount || 0;
        updatedData.datasets[1].data[index + 1] = attendanceData[month]?.absentCount || 0;
        updatedData.datasets[2].data[index + 1] = attendanceData[month]?.leaveCount || 0;
      });
      
      setChartData(updatedData);
    }
  }, [attendanceData]);

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
      y: { beginAtZero: true, grid: { display: false }, ticks: { precision: 0, stepSize: 1 } },
      x: { grid: { display: false } },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default AttendanceGraph;
