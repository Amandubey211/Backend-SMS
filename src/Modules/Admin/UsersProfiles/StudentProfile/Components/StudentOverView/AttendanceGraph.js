import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { TbBorderRadius } from "react-icons/tb";
Chart.register(...registerables);

const AttendanceGraph = () => {
  const data = {
    labels: [
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
        data: [20, 22, 25, 28, 26, 25, 29, 28, 27, 25, 26, 27],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Absent",
        data: [15, 3, 2, 3, 2, 3, 2, 3, 2, 4, 3, 2],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Leave",
        data: [5, 5, 3, 2, 2, 4, 2, 1, 2, 2, 1, 2],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw.toLocaleString()} QR`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false, // This will hide the grid lines for the y-axis
        },
        ticks: {
          callback: function (value) {
            return value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          display: false, // This will hide the grid lines for the x-axis
        },
      },
    },
  };
  
  return (
       
        
          <Line data={data} options={options}  className=" " />
  );
};

export default AttendanceGraph;
