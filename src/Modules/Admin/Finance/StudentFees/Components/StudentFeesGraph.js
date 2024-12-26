import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";

const StudentFeesGraph = () => {
  const [graphData, setGraphData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Simulate API call for graph data
    const fetchGraphData = async () => {
      const fetchedData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Total Fees Collected",
            data: [5000, 10000, 15000, 12000, 17000, 20000, 25000],
            borderColor: "#06A72E",
            backgroundColor: "rgba(6, 167, 46, 0.2)",
            tension: 0.4,
          },
          {
            label: "Total Due Fees",
            data: [4000, 8000, 10000, 9000, 14000, 15000, 17000],
            borderColor: "#E70F00",
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

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-300 w-full relative">
      <h3 className="text-lg font-medium text-gray-700 mb-6">
        Monthly Fee Collection 2024
      </h3>
      <div className="h-96 w-full">
        {graphData ? (
          <Line data={graphData} options={options} ref={chartRef} />
        ) : (
          <p className="text-center text-gray-500">Loading graph data...</p>
        )}
      </div>
    </div>
  );
};

export default StudentFeesGraph;
