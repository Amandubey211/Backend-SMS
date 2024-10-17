import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskCompletionChart = ({ tasks }) => {
  
  // Ensure incompleteTask is non-negative
  const incompletedTask = Math.max(100 - tasks, 0);
  const data = {
    labels: ["Incomplete Task", "Completed Task"],
    datasets: [
      {
        data: [incompletedTask, tasks], // Ensure correct order: [incompletedTask, completedTask]
        backgroundColor: [
          "#FFD700",  // Yellow for incomplete tasks
          "#7B61FF",  // Blue for completed tasks
        ],
        hoverBackgroundColor: [
          "#FFD700",
          "#7B61FF",
        ],
        borderWidth: 5,
        borderRadius: 10,
        borderColor: "#ffffff", // White borders make segments distinct
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%',
    plugins: {
      legend: {
        display: false, // Disable built-in legend to prevent duplication
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + tooltipItem.raw + "%";
          },
        },
      },
    },
    layout: {
      padding: {
        bottom: 30, // Space below the chart for custom legend
      },
    },
  };

  return (
    <div className="flex flex-col items-center">
      {/* Chart container */}
      <div className="w-[350px] h-[350px] mt-6">
        <Pie data={data} options={options} />
      </div>
      {/* Custom legend container */}
      <div className="flex items-center justify-center mt-6 space-x-8">
        <div className="flex items-center">
          <div
            style={{
              width: '14px',
              height: '14px',
              backgroundColor: "#FFD700", // Yellow for incomplete tasks
              borderRadius: '50%',
              marginRight: '8px',
            }}
          ></div>
          <span className="text-sm text-gray-700">Incomplete Task</span>
        </div>
        <div className="flex items-center">
          <div
            style={{
              width: '14px',
              height: '14px',
              backgroundColor: "#7B61FF", // Blue for completed tasks
              borderRadius: '50%',
              marginRight: '8px',
            }}
          ></div>
          <span className="text-sm text-gray-700">Completed Task</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCompletionChart;
