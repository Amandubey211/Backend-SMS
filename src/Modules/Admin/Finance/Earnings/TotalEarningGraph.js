// src/Modules/Admin/Finance/Earnings/TotalEarningGraph.jsx

import React, { useMemo, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector, useDispatch } from "react-redux";
import { fetchEarningGraph } from "../../../../Store/Slices/Finance/Earnings/earningsThunks";
import { Spin, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

// Define a color palette with distinct colors
const colorPalette = [
  "rgba(75, 192, 192, 1)", // Teal
  "rgba(255, 99, 132, 1)", // Red
  "rgba(54, 162, 235, 1)", // Blue
  "rgba(255, 206, 86, 1)", // Yellow
  "rgba(153, 102, 255, 1)", // Purple
  "rgba(255, 159, 64, 1)", // Orange
  "rgba(199, 199, 199, 1)", // Grey
  "rgba(83, 102, 255, 1)", // Indigo
  "rgba(255, 102, 255, 1)", // Pink
  "rgba(102, 255, 102, 1)", // Light Green
  // Add more colors as needed
];

// Helper function to assign colors based on category index
const getColorForCategory = (category, index) => {
  const color = colorPalette[index % colorPalette.length];
  return {
    background: `${color}33`, // Adding transparency for fill (~20% opacity)
    border: color,
    point: color,
  };
};

const TotalEarningGraph = () => {
  const dispatch = useDispatch();

  // Access expenseGraph from Redux store
  const { expenseGraph, graphLoading, error } = useSelector(
    (state) => state.admin.earnings
  );
  console.log(expenseGraph);

  // Fetch the earning graph data on component mount
  useEffect(() => {
    dispatch(fetchEarningGraph());
  }, [dispatch]);

  // Process expenseGraph data to structure suitable for Chart.js
  const chartData = useMemo(() => {
    if (!expenseGraph || expenseGraph.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Extract unique time labels sorted (e.g., "2024-12")
    const labels = Array.from(
      new Set(expenseGraph.map((entry) => entry.time))
    ).sort();

    // Extract unique categories
    const categories = Array.from(
      new Set(expenseGraph.map((entry) => entry.category))
    ).sort();

    // Create a mapping of category to its data points
    const datasets = categories.map((category, index) => {
      const data = labels.map((label) => {
        // Find the entry matching the current time and category
        const entry = expenseGraph.find(
          (e) => e.time === label && e.category === category
        );
        return entry ? entry.totalExpense : 0;
      });

      // Assign distinct colors for each category
      const color = getColorForCategory(category, index);

      return {
        label: category,
        data,
        fill: true,
        backgroundColor: color.background,
        borderColor: color.border,
        pointBackgroundColor: color.point,
        pointBorderColor: "#fff",
        tension: 0.4,
      };
    });

    return {
      labels,
      datasets,
    };
  }, [expenseGraph]);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: "#ffffff",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#C83B62",
        borderWidth: 1,
      },
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 10,
          padding: 15,
          font: {
            size: 10,
          },
        },
        // Enable toggling datasets by clicking on legend items
        onClick: (e, legendItem, legend) => {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          const meta = ci.getDatasetMeta(index);
          meta.hidden =
            meta.hidden === null ? !ci.data.datasets[index].hidden : null;
          ci.update();
        },
        // Make legend scrollable if it exceeds a certain height
        afterFit: (chart) => {
          chart.legend.container.style.maxHeight = "150px";
          chart.legend.container.style.overflowY = "auto";
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: false,
          color: "rgba(0,0,0,0.1)", // Dashed vertical grid lines
          borderDash: [5, 5],
        },
        ticks: {
          color: "#666", // Time label color
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: "#eee", // Horizontal grid lines
        },
        ticks: {
          color: "#666", // Y-axis label color
          font: {
            size: 10,
          },
          callback: function (value) {
            return value.toLocaleString(); // Add thousand separators
          },
        },
      },
    },
  };

  // Handle graphLoading and error states gracefully
  if (graphLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" tip="graphLoading graph..." />
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        {/* Custom Legend and Dropdown */}
        <div className="flex items-end gap-6">
          {/* You can add custom legends here if needed */}
        </div>

        {/* Group By Dropdown */}
        <select
          onChange={(e) =>
            dispatch(fetchEarningGraph({ groupBy: e.target.value }))
          }
          defaultValue="month" // Default value; you can manage this with local state if needed
          className="px-4 py-2 bg-white text-gray-700 font-medium text-sm border rounded-md hover:shadow-md transition focus:outline-none"
          style={{
            borderImageSource: "linear-gradient(to right, #C83B62, #46138A)",
            borderImageSlice: 1,
            borderWidth: "2px",
            borderRadius: "8px",
          }}
          aria-label="Group by"
        >
          <option value="month">By Month</option>
          <option value="year">By Year</option>
        </select>
      </div>

      {/* Graph with Fixed Dimensions */}
      <div className="flex justify-center items-center">
        <div
          className="h-[300px] w-[90%]"
          style={{
            maxWidth: "100%",
            height: "300px",
            overflow: "hidden", // Ensure the graph doesn't overflow
          }}
        >
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default TotalEarningGraph;
