import React from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskCompletionChart = () => {
  const data = {
    labels: ["Completed Task", "Incomplete Task"],
    datasets: [
      {
        data: [67,21], // Percentage or total points for each subject
        backgroundColor: [
          
          "#7B61FF",
          "#FFD700",
        ],
        hoverBackgroundColor: [
          
          "#7B61FF",
          "#FFD700",
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
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 20,
          padding: 8,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + tooltipItem.raw + "%";
          },
        },
      },
    },
  };

  return (
    <div className="flex-1 flex justify-center items-center h-full">
      <div style={{ width: "290px", height: "290px" , marginTop:"10px"}}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default TaskCompletionChart;
