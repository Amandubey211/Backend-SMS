import React, { useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

const TotalEarningsGraph = () => {
  const chartRef = useRef(null);
  const [clickedIndex, setClickedIndex] = useState(null);

  const data = {
    labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Total Collections",
        data: [300000, 250000, 200000, 300000, 250000, 200000, 150000],
        borderColor: "#7C3AED",
        borderWidth: 3,
        fill: true,
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(
            0,
            0,
            0,
            context.chart.height
          );
          gradient.addColorStop(0, "rgba(124, 58, 237, 0.1)");
          gradient.addColorStop(1, "rgba(124, 58, 237, 0)");
          return gradient;
        },
        tension: 0.4,
        pointBackgroundColor: "#7C3AED",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Total Expenses",
        data: [200000, 150000, 51749, 180000, 220000, 170000, 200000],
        borderColor: "#EA580C",
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#EA580C",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const options = {
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
        displayColors: false,
        callbacks: {
          label: function (context) {
            const value = context.raw.toLocaleString();
            const day = context.dataIndex + 1;
            const date = new Date();
            date.setDate(day);
            const formattedDate = `${day}${getOrdinalSuffix(
              day
            )} ${date.toLocaleString("default", { month: "long" })}`;
            return `${value}\n${formattedDate}`;
          },
          title: function () {
            return "";
          },
        },
        titleAlign: "center",
        bodyAlign: "center",
        padding: 10,
        usePointStyle: true,
        caretSize: 10,
        cornerRadius: 4,
        boxWidth: 10,
        boxHeight: 10,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString() + " QR";
          },
        },
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: true,
          drawBorder: false,
          color: "rgba(0, 0, 0, 0.1)",
          borderDash: [5, 5],
        },
      },
    },
    onClick: function (evt, elements) {
      if (elements.length > 0) {
        const chartInstance = chartRef.current;
        const datasetIndex = elements[0].datasetIndex;
        const index = elements[0].index;

        setClickedIndex(index);

        const dataset = chartInstance.data.datasets[datasetIndex];
        const point = dataset.data[index];

        const verticalLinePlugin = {
          id: "verticalLine",
          beforeDraw: (chart) => {
            const ctx = chart.ctx;
            const xAxis = chart.scales.x;
            const yAxis = chart.scales.y;

            // Clear previous line
            ctx.clearRect(0, 0, chart.width, chart.height);

            const x = xAxis.getPixelForValue(chart.data.labels[index]);
            ctx.save();
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.moveTo(x, yAxis.top);
            ctx.lineTo(x, yAxis.bottom);
            ctx.lineWidth = 1; // Adjusted line width
            ctx.strokeStyle = dataset.borderColor;
            ctx.stroke();
            ctx.restore();
          },
        };

        ChartJS.unregister(verticalLinePlugin);
        ChartJS.register(verticalLinePlugin);
        chartInstance.update();
      }
    },
  };

  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Earnings</h2>
          </div>
          <div>
            <select className="border rounded p-2">
              <option>This month</option>
              <option>Last month</option>
            </select>
          </div>
        </div>
        <Line ref={chartRef} data={data} options={options} />

        <div className="flex justify-around mt-4">
          <div className="flex flex-col items-start">
            <div
              className="w-16 h-1 rounded-full mb-1"
              style={{ backgroundColor: "#7C3AED", alignSelf: "flex-start" }}
            ></div>
            <div className="flex items-center">
              <div className="text-gray-700">Total Collections</div>
              <div className="ml-2 font-bold mr-1">2,41,500</div>
              <div className="text-gray-700">QR</div>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div
              className="w-16 h-1 rounded-full mb-1"
              style={{ backgroundColor: "#EA580C", alignSelf: "flex-start" }}
            ></div>
            <div className="flex items-center">
              <div className="text-gray-700">Total Expenses</div>
              <div className="ml-2 font-bold mr-1">41,500</div>
              <div className="text-gray-700">QR</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalEarningsGraph;
