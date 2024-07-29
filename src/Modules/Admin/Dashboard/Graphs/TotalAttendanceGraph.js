import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import useGetAttendanceData from "../../../../Hooks/AuthHooks/Staff/Admin/Dashboard/useGetAttendanceData";
import { FiCalendar } from "react-icons/fi";
import Fallback from "../../../../Components/Common/Fallback";

const TotalAttendanceGraph = () => {
  const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [gender, setGender] = useState("Both"); // New state for gender filter

  const { attendanceData, loading, error, fetchAttendanceData } = useGetAttendanceData();

  useEffect(() => {
    fetchAttendanceData(month, year);
  }, [month, year, fetchAttendanceData]);

  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    if (attendanceData && attendanceData.attendanceData) {
      const attendance = attendanceData.attendanceData;

      // Sort classes numerically and place unnamed classes at the end
      const sortedAttendance = attendance.sort((a, b) => {
        const extractNumber = str => {
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

      const labels = sortedAttendance.map(item => item.className);

      const femaleAttendance = sortedAttendance.map(item => item.femaleAttendance);
      const maleAttendance = sortedAttendance.map(item => item.maleAttendance);

      const filteredData = {
        labels: labels,
        datasets: [
          gender === "Female" || gender === "Both" ? {
            label: "Female",
            data: femaleAttendance,
            backgroundColor: "#8F77F3",
            borderRadius: 10,
            borderWidth: 1,
            stack: 'combined',
            barThickness: 30,
          } : null,
          gender === "Male" || gender === "Both" ? {
            label: "Male",
            data: maleAttendance,
            backgroundColor: "#23C55E",
            borderRadius: 10,
            borderWidth: 1,
            stack: 'combined',
            barThickness: 30,
          } : null,
        ].filter(Boolean),
      };

      setGraphData(filteredData);
    } else {
      setGraphData(null);
    }
  }, [attendanceData, gender]);

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  if (loading) {
    return <Fallback />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Today's Attendance</h2>
          <div className="text-3xl font-bold">
            {attendanceData ? attendanceData.totalMaleAttendance + attendanceData.totalFemaleAttendance : 0}
          </div>
        </div>
        <div className="flex space-x-2">
          <select className="border rounded p-2" onChange={handleMonthChange} value={month}>
            {[...Array(12).keys()].map(i => (
              <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <select className="border rounded p-2" onChange={handleYearChange} value={year}>
            {[2024, 2023, 2022, 2021].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select className="border rounded p-2" onChange={handleGenderChange} value={gender}>
            <option value="Both">Both</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>
      {graphData ? (
        <>
          <div style={{ height: '300px' }}>
            <Bar data={graphData} options={{
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
            }} />
          </div>
          <div className="flex justify-around mt-4">
            <div className="flex flex-col items-start">
              <div className="w-16 h-1 bg-[#8F77F3] rounded-full mb-1" style={{ alignSelf: 'flex-start' }}></div>
              <div className="flex items-center">
                <div className="text-gray-700">Total Female</div>
                <div className="ml-2 font-bold">
                  {attendanceData ? attendanceData.totalFemaleAttendance : 0}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="w-16 h-1 bg-[#23C55E] rounded-full mb-1" style={{ alignSelf: 'flex-start' }}></div>
              <div className="flex items-center">
                <div className="text-gray-700">Total Male</div>
                <div className="ml-2 font-bold">
                  {attendanceData ? attendanceData.totalMaleAttendance : 0}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <FiCalendar className="w-12 h-12 text-gray-400" />
          <p className="text-gray-400">No Attendance Data Found</p>
        </div>
      )}
    </div>
  );
};

export default TotalAttendanceGraph;
