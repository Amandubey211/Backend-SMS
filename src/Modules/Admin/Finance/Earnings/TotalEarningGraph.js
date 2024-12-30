import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";
import { Spin, Alert } from "antd";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

/**
 * Helper function to generate month labels for a specific year in "YYYY-MM" format
 * @param {number} year - The year for which to generate month labels
 * @returns {Array<string>} - Array of month labels in "YYYY-MM" format
 */
const getYearMonths = (year) => {
  const months = [];
  for (let month = 1; month <= 12; month++) {
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    months.push(`${year}-${formattedMonth}`);
  }
  return months;
};

/**
 * Helper function to format "YYYY-MM" to "Mon YYYY" (e.g., "2024-01" -> "Jan 2024")
 * @param {string} label - The label in "YYYY-MM" format
 * @returns {string} - Formatted label in "Mon YYYY" format
 */
const formatLabel = (label) => {
  if (typeof label !== "string") return "";
  const [year, month] = label.split("-");
  if (!year || !month) return label;
  const date = new Date(year, month - 1);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
};

const TotalEarningGraph = () => {
  const { earningGraph, graphLoading, error } = useSelector(
    (state) => state.admin.earnings
  );

  // Determine the year to display. Here, we'll use the current year.
  const currentYear = new Date().getFullYear();
  const labels = useMemo(() => getYearMonths(currentYear), [currentYear]);

  // Process earningGraph data to structure suitable for Chart.js
  const data = useMemo(() => {
    if (!earningGraph || earningGraph.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Extract unique categories
    const categories = Array.from(
      new Set(earningGraph.map((entry) => entry.category))
    ).sort();

    // Define a more sophisticated color palette
    const colorPalette = [
      "#1f2937", // Gray-800
      "#9333ea", // Purple-600
      "#3b82f6", // Blue-500
      "#10b981", // Green-500
      "#f97316", // Orange-500
      "#ef4444", // Red-500
      "#6366f1", // Indigo-500
      "#14b8a6", // Teal-500
      "#f59e0b", // Amber-500
      "#84cc16", // Lime-500
    ];

    const getColorForCategory = (index) =>
      colorPalette[index % colorPalette.length];

    // Create datasets for each category
    const datasets = categories.map((category, index) => {
      // Filter graph data for the current category
      const categoryData = earningGraph.filter(
        (entry) => entry.category === category
      );

      // Aggregate totalExpense for each time period
      const dataPoints = labels.map((label) => {
        const entry = categoryData.find((e) => e.time === label);
        return entry ? entry.totalRevenue : 0;
      });

      return {
        label: category,
        data: dataPoints,
        backgroundColor: getColorForCategory(index),
        borderWidth: 1,
      };
    });

    return {
      labels: labels.map(formatLabel),
      datasets,
    };
  }, [earningGraph, labels]);

  // Define chart options
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: "#ffffff",
          titleColor: "#111827",
          bodyColor: "#111827",
          borderColor: "#4f46e5", // Indigo-600
          borderWidth: 1,
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || "";
              const value = context.parsed.y || 0;
              return `${label}: ${value.toLocaleString("en-US", {
                style: "currency",
                currency: "QAR",
              })}`;
            },
            title: function (context) {
              const label = context[0].label || "";
              return label;
            },
          },
        },
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            pointStyle: "rect",
            boxWidth: 12,
            padding: 10,
            font: {
              size: 12,
            },
          },
          onClick: (e, legendItem, legend) => {
            const index = legendItem.datasetIndex;
            const ci = legend.chart;
            const meta = ci.getDatasetMeta(index);
            meta.hidden =
              meta.hidden === null ? !ci.data.datasets[index].hidden : null;
            ci.update();
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: true,
            drawBorder: false,
            color: "rgba(156, 163, 175, 0.2)", // Gray-400
            borderDash: [5, 5],
          },
          ticks: {
            color: "#4B5563", // Gray-700
            font: {
              size: 12,
            },
          },
        },
        y: {
          stacked: true,
          grid: {
            color: "rgba(156, 163, 175, 0.2)", // Gray-400
          },
          ticks: {
            color: "#4B5563", // Gray-700
            font: {
              size: 12,
            },
            callback: function (value) {
              return value.toLocaleString("en-US", {
                style: "currency",
                currency: "QAR",
              }); // Add thousand separators and currency
            },
          },
        },
      },
    }),
    []
  );

  // Handle loading state
  if (graphLoading) {
    return (
      <div className="relative w-full h-[400px] bg-white rounded-lg shadow flex justify-center items-center">
        <Spin
          size="large"
          tip="Loading graph..."
          className="animate-pulse"
          indicator={
            <svg
              className="animate-spin h-10 w-10 text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          }
        />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full bg-white p-4 rounded-lg shadow flex justify-center items-center">
        <Alert message="Error loading graph." type="error" showIcon />
      </div>
    );
  }

  // Handle case when there's no data
  if (earningGraph.length === 0) {
    return (
      <div className="w-full bg-white p-4 rounded-lg shadow flex justify-center items-center">
        <Alert
          message="No expense data available."
          type="info"
          showIcon
          description="Please add some expenses to view the graph."
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-[98%]  h-96 bg-white p-4 rounded-lg shadow">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default TotalEarningGraph;
