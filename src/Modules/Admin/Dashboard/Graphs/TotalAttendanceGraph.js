import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import useGetAdminDashboardData from "../../../../Hooks/AuthHooks/Staff/Admin/Dashboard/useGetAdminDashboardData";
import Fallback from "../../../../Components/Common/Fallback";

const TotalAttendanceGraph = () => {
  const { loading, error, dashboardData, fetchAdminDashboardData } = useGetAdminDashboardData();
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    fetchAdminDashboardData();
  }, [fetchAdminDashboardData]);

  useEffect(() => {
    console.log("Dashboard Data: ", dashboardData);
    if (dashboardData && dashboardData.attendance && dashboardData.attendance.attendanceData) {
      const attendanceData = dashboardData.attendance.attendanceData;
      console.log("Attendance Data: ", attendanceData);

      const labels = ["One", "Two", "Three", "Four", "Five", "Six"];
      const femaleAttendance = new Array(labels.length).fill(0);
      const maleAttendance = new Array(labels.length).fill(0);

      attendanceData.forEach((item, index) => {
        if (index < labels.length) {
          femaleAttendance[index] = item.femaleAttendance;
          maleAttendance[index] = item.maleAttendance;
        }
      });

      console.log("Female Attendance: ", femaleAttendance);
      console.log("Male Attendance: ", maleAttendance);

      const data = {
        labels: labels,
        datasets: [
          {
            label: "Female",
            data: femaleAttendance,
            backgroundColor: "#8F77F3",
            borderRadius: 10,
            borderWidth: 1,
            stack: 'combined',
            barThickness: 30,
          },
          {
            label: "Male",
            data: maleAttendance,
            backgroundColor: "#23C55E",
            borderRadius: 10,
            borderWidth: 1,
            stack: 'combined',
            barThickness: 30,
          },
        ],
      };

      setGraphData(data);
    }
  }, [dashboardData]);

  if (loading) {
    return <Fallback />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!graphData) {
    return <p>No attendance data available.</p>;
  }

  const options = {
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
  };

  return (
    <div className="bg-white p-4 ">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Today's Attendance</h2>
          <div className="text-3xl font-bold">
            {dashboardData && dashboardData.attendance 
              ? dashboardData.attendance.totalMaleAttendance + dashboardData.attendance.totalFemaleAttendance 
              : 0}
          </div>
        </div>
        <div>
          <select className="border rounded p-2">
            <option>This month</option>
            <option>Last month</option>
          </select>
        </div>
      </div>
      <div style={{ height: '300px' }}>
        <Bar data={graphData} options={options} />
      </div>
      <div className="flex justify-around mt-4">
        <div className="flex flex-col items-start">
          <div className="w-16 h-1 bg-[#8F77F3] rounded-full mb-1" style={{ alignSelf: 'flex-start' }}></div>
          <div className="flex items-center">
            <div className="text-gray-700">Total Female</div>
            <div className="ml-2 font-bold">
              {dashboardData && dashboardData.attendance 
                ? dashboardData.attendance.totalFemaleAttendance 
                : 0}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="w-16 h-1 bg-[#23C55E] rounded-full mb-1" style={{ alignSelf: 'flex-start' }}></div>
          <div className="flex items-center">
            <div className="text-gray-700">Total Male</div>
            <div className="ml-2 font-bold">
              {dashboardData && dashboardData.attendance 
                ? dashboardData.attendance.totalMaleAttendance 
                : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalAttendanceGraph;
