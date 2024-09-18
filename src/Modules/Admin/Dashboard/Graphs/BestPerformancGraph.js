import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { weekData, monthData, yearData } from "./GraphData/BestPerformanceData";

const BestPerformanceChart = () => {
  const [data, setData] = useState(weekData);

  const handleTimeFrameChange = (e) => {
    const timeFrame = e.target.value;
    if (timeFrame === "Week") {
      setData(weekData);
    } else if (timeFrame === "Month") {
      setData(monthData);
    } else if (timeFrame === "Year") {
      setData(yearData);
    }
  };

  return (
    <div className="h-full py-3 ">
      <div className="flex justify-between px-4 items-center">
        <h1 className="text-2xl font-semibold  ">Best Performers</h1>

        <div className="flex justify-center ">
          <select
            className="p-2 border rounded"
            onChange={handleTimeFrameChange}
          >
            <option>Week</option>
            <option>Month</option>
            <option>Year</option>
          </select>
        </div>
      </div>

      <div className="w-full p-3">
        <div className="h-70">
          <Bar
            data={data}
            options={{
              indexAxis: "y",
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Percentage",
                  },
                  ticks: {
                    callback: function (value) {
                      return value + "%";
                    },
                  },
                },
                y: {
                  title: {
                    display: true,
                  },
                  stacked: true,
                },
              },
              categoryPercentage: 0.9, // Adjusts the width of the category
              barPercentage: 0.8, // Adjusts the width of the bars
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BestPerformanceChart;
