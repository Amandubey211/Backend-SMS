// src/Modules/Admin/Finance/StudentFees/Components/StudentFeesGraph.js
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const StudentFeesGraph = () => {
  const [graphData, setGraphData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("By Month");

  // Fetch graph data
  useEffect(() => {
    const fetchGraphData = async () => {
      const fetchedData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Total Fees Collected",
            data: [5000, 10000, 15000, 12000, 17000, 20000, 25000],
            borderColor: "#06A72E", // Green line
            backgroundColor: "rgba(6, 167, 46, 0.2)",
            tension: 0.4,
          },
          {
            label: "Total Due Fees",
            data: [4000, 8000, 10000, 9000, 14000, 15000, 17000],
            borderColor: "#E70F00", // Red line
            backgroundColor: "rgba(231, 15, 0, 0.2)",
            tension: 0.4,
          },
        ],
      };

      setGraphData(fetchedData);
    };

    fetchGraphData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) =>
            `${tooltipItem.dataset.label}: ${tooltipItem.raw.toLocaleString()} QAR`,
        },
      },
      legend: {
        position: "bottom",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: (value) => `${value.toLocaleString()} QAR`,
        },
      },
    },
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-gray-300 w-full relative">
      {/* Dropdown at the top-right */}
      <div className="absolute top-4 right-4">
        <select
          value={selectedOption}
          onChange={handleOptionChange}
          className="bg-white text-gray-700 py-2 px-4 rounded-lg outline-none border-2 border-transparent"
          style={{
            borderImage: "linear-gradient(90deg, #C83B62, #46138A) 1",
          }}
        >
          <option value="By Month">By Month</option>
          {[
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
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <h3 className="text-lg font-medium text-gray-700 mb-6">
        Monthly Fee Collection 2024
      </h3>
      <div className="h-[400px]">
        {graphData?.labels ? (
          <Line data={graphData} options={options} />
        ) : (
          <p className="text-center text-gray-500">Loading graph data...</p>
        )}
      </div>
    </div>
  );
};

export default StudentFeesGraph;
