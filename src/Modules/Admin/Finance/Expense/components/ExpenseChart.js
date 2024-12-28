// // src/Modules/Admin/Finance/Components/ExpenseChart.js

// import React, { useMemo } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { useSelector } from "react-redux";
// import { Spin, Alert } from "antd";

// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// const ExpenseChart = () => {
//   const { expenseGraph, loading, error } = useSelector(
//     (state) => state.admin.expenses
//   );
//   console.log(expenseGraph, "dddd");
//   const data = useMemo(() => {
//     if (!expenseGraph || expenseGraph.length === 0) {
//       return {
//         labels: [],
//         datasets: [],
//       };
//     }
//     // Extract unique categories
//     const categories = Array.from(
//       new Set(expenseGraph.map((entry) => entry.category))
//     );

//     // Extract unique time labels sorted
//     const labels = Array.from(
//       new Set(expenseGraph.map((entry) => entry.time))
//     ).sort();

//     // Assign distinct colors for each category
//     const colorPalette = [
//       "#6366F1", // Indigo
//       "#FBBF24", // Yellow
//       "#34D399", // Green
//       "#F87171", // Red
//       "#60A5FA", // Blue
//       "#A78BFA", // Purple
//       "#EF4444", // Bright Red
//       "#10B981", // Emerald
//       "#F59E0B", // Amber
//       "#3B82F6", // Sky Blue
//       "#FF69B4", // Hot Pink
//     ];

//     const getColorForCategory = (index) =>
//       colorPalette[index % colorPalette.length];

//     // Create datasets for each category
//     const datasets = categories.map((category, index) => {
//       // Filter graph data for the current category
//       const categoryData = expenseGraph.filter(
//         (entry) => entry.category === category
//       );

//       // Aggregate totalExpense for each time period
//       const dataPoints = labels.map((label) => {
//         const entry = categoryData.find((e) => e.time === label);
//         return entry ? entry.totalExpense : 0;
//       });

//       return {
//         label: category,
//         data: dataPoints,
//         backgroundColor: getColorForCategory(index),
//         borderRadius: 100, // Rounded bars
//       };
//     });

//     return {
//       labels,
//       datasets,
//     };
//   }, [expenseGraph]);

//   // Define chart options
//   const options = useMemo(
//     () => ({
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           position: "top",
//           labels: {
//             usePointStyle: true,
//             pointStyle: "circle",
//             boxWidth: 10,
//             padding: 15,
//             font: {
//               size: 10,
//             },
//           },
//           // Enable toggling datasets by clicking on legend items
//           onClick: (e, legendItem, legend) => {
//             const index = legendItem.datasetIndex;
//             const ci = legend.chart;
//             const meta = ci.getDatasetMeta(index);
//             meta.hidden =
//               meta.hidden === null ? !ci.data.datasets[index].hidden : null;
//             ci.update();
//           },
//         },
//         tooltip: {
//           enabled: true,
//           backgroundColor: "#ffffff",
//           titleColor: "#333",
//           bodyColor: "#333",
//           borderColor: "#FF69B4", // Hot Pink border for tooltip
//           borderWidth: 1,
//         },
//       },
//       scales: {
//         x: {
//           grid: {
//             display: true,
//             drawBorder: false,
//             color: "rgba(255, 105, 180, 0.1)", // Pinkish dashed vertical grid lines
//             borderDash: [5, 5],
//           },
//           ticks: {
//             color: "#FF69B4", // Hot Pink Time label color
//             font: {
//               size: 10,
//             },
//           },
//         },
//         y: {
//           grid: {
//             color: "#ffe6f0", // Light Pink horizontal grid lines
//           },
//           ticks: {
//             color: "#FF69B4", // Hot Pink Y-axis label color
//             font: {
//               size: 10,
//             },
//             callback: function (value) {
//               return value.toLocaleString(); // Add thousand separators
//             },
//           },
//         },
//       },
//     }),
//     []
//   );

//   // Handle loading state
//   if (loading) {
//     return (
//       <div className="relative w-full h-[300px] bg-white rounded-lg shadow flex justify-center items-center">
//         <Spin
//           size="large"
//           tip="Loading graph..."
//           className="animate-pulse"
//           indicator={
//             <svg
//               className="animate-spin h-10 w-10 text-pink-500"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8v8H4z"
//               ></path>
//             </svg>
//           }
//         />
//       </div>
//     );
//   }

//   // Handle error state
//   if (error) {
//     return (
//       <div className="w-full bg-white p-4 rounded-lg shadow flex justify-center items-center">
//         <Alert message="Error loading graph." type="error" showIcon />
//       </div>
//     );
//   }

//   // Handle case when there's no data
//   if (expenseGraph.length === 0) {
//     return (
//       <div className="w-full bg-white p-4 rounded-lg shadow flex justify-center items-center">
//         <Alert
//           message="No expense data available."
//           type="info"
//           showIcon
//           description="Please add some expenses to view the graph."
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-96 bg-white p-4 rounded-lg shadow">
//       <Bar data={data} options={options} />
//     </div>
//   );
// };

// export default ExpenseChart;

// src/Modules/Admin/Finance/Components/ExpenseChartDoughnut.js
// src/Modules/Admin/Finance/Components/ExpenseChart.js

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

const ExpenseChart = () => {
  const { expenseGraph, loading, error } = useSelector(
    (state) => state.admin.expenses
  );

  // Determine the year to display. Here, we'll use the current year.
  const currentYear = new Date().getFullYear();
  const labels = useMemo(() => getYearMonths(currentYear), [currentYear]);

  // Process expenseGraph data to structure suitable for Chart.js
  const data = useMemo(() => {
    if (!expenseGraph || expenseGraph.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Extract unique categories
    const categories = Array.from(
      new Set(expenseGraph.map((entry) => entry.category))
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
      const categoryData = expenseGraph.filter(
        (entry) => entry.category === category
      );

      // Aggregate totalExpense for each time period
      const dataPoints = labels.map((label) => {
        const entry = categoryData.find((e) => e.time === label);
        return entry ? entry.totalExpense : 0;
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
  }, [expenseGraph, labels]);

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
  if (loading) {
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
  if (expenseGraph.length === 0) {
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
    <div className="w-full h-96 bg-white p-4 rounded-lg shadow">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ExpenseChart;
