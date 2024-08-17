import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../../config/Common";
import { useParams } from "react-router-dom";
Chart.register(...registerables);

const AttendanceGraph = ({student}) => {
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
        data: [0,0,0,0,0,0,0,0,0,0,0,0,0],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Absent",
        data: [0,0,0,0,0,0,0,0,0,0,0,0,0],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Leave",
        data: [0,0,0,0,0,0,0,0,0,0,0,0,0],
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
        `${baseUrl}/api/teacher/attendance/getYearlyAttendance/${cid}`,
        {
          headers: {
            Authentication: token,
          }
        }
      );
      const attendanceData = response?.data?.data;
      const updatedData = { ...chartData };
console.log(attendanceData);

updatedData.datasets[0].data[1] = attendanceData?.January.presentCount;
updatedData.datasets[1].data[1] = attendanceData?.January.absentCount;
updatedData.datasets[2].data[1] = attendanceData?.January.leaveCount;

updatedData.datasets[0].data[2] = attendanceData?.February.presentCount;
updatedData.datasets[1].data[2] = attendanceData?.February.absentCount;
updatedData.datasets[2].data[2] = attendanceData?.February.leaveCount;

updatedData.datasets[0].data[3] = attendanceData?.March.presentCount;
updatedData.datasets[1].data[3] = attendanceData?.March.absentCount;
updatedData.datasets[2].data[3] = attendanceData?.March.leaveCount;

updatedData.datasets[0].data[4] = attendanceData?.April.presentCount;
updatedData.datasets[1].data[4] = attendanceData?.April.absentCount;
updatedData.datasets[2].data[4] = attendanceData?.April.leaveCount;

updatedData.datasets[0].data[5] = attendanceData?.May.presentCount;
updatedData.datasets[1].data[5] = attendanceData?.May.absentCount;
updatedData.datasets[2].data[5] = attendanceData?.May.leaveCount;

updatedData.datasets[0].data[6] = attendanceData?.June.presentCount;
updatedData.datasets[1].data[6] = attendanceData?.June.absentCount;
updatedData.datasets[2].data[6] = attendanceData?.June.leaveCount;

updatedData.datasets[0].data[7] = attendanceData?.July.presentCount;
updatedData.datasets[1].data[7] = attendanceData?.July.absentCount;
updatedData.datasets[2].data[7] = attendanceData?.July.leaveCount;

updatedData.datasets[0].data[8] = attendanceData?.August.presentCount;
updatedData.datasets[1].data[8] = attendanceData?.August.absentCount;
updatedData.datasets[2].data[8] = attendanceData?.August.leaveCount;

updatedData.datasets[0].data[9] = attendanceData?.September.presentCount;
updatedData.datasets[1].data[9] = attendanceData?.September.absentCount;
updatedData.datasets[2].data[9] = attendanceData?.September.leaveCount;

updatedData.datasets[0].data[10] = attendanceData?.October.presentCount;
updatedData.datasets[1].data[10] = attendanceData?.October.absentCount;
updatedData.datasets[2].data[10] = attendanceData?.October.leaveCount;

updatedData.datasets[0].data[11] = attendanceData?.November.presentCount;
updatedData.datasets[1].data[11] = attendanceData?.November.absentCount;
updatedData.datasets[2].data[11] = attendanceData?.November.leaveCount;

updatedData.datasets[0].data[12] = attendanceData?.December.presentCount;
updatedData.datasets[1].data[12] = attendanceData?.December.absentCount;
updatedData.datasets[2].data[12] = attendanceData?.December.leaveCount;
   
     
      setChartData(updatedData);
console.log(attendanceData);

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

  return <Line data={chartData} options={options}  />;
};

export default AttendanceGraph;
