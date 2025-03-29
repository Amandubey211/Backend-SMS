import React, { useRef, useState, useEffect, memo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { FiCalendar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


ChartJS.register(...registerables);

const PayRollGraph = () => {
  const chartRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("currentMonth");
  const { t } = useTranslation("dashboard");
 


  const chartData = {
    labels: ["jan","feb","mar","apr","may","jun","jul","Aug", "Sep","Oct","Nov","Dec"],
    fill:true,
    datasets: [
      {
        label: t("PayRoll"),
        data: [10, 20,35,30,50,60,79,78,67,80,67,23],
        borderColor: "#7C3AED",
        backgroundColor: "rgba(124, 58, 237, 0.2)", 
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#7C3AED",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: t("Expenses"),
        data: [10, 20,23,25,50,60,80,60,65,60,40,40],
        borderColor: "#EA580C",
        backgroundColor: "rgba(234, 88, 12, 0.2)", // Light orange fill
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#EA580C",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        enabled: false,
        external: (context) => {
          const tooltipModel = context.tooltip;
          if (tooltipModel.opacity === 0) {
            setTooltipData(null);
            return;
          }
          const value = tooltipModel?.dataPoints[0].raw?.toLocaleString();
          const label = tooltipModel?.dataPoints[0]?.label;
          setTooltipData({ value, label, left: tooltipModel.caretX, top: tooltipModel.caretY });
        },
      },
      legend: {
        display: true,
      },
    },
    scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => value?.toLocaleString() + " QR",
          },
          grid: {
            display: true,
            color: "rgba(0,0,0,0.1)",
            drawBorder: false,
            borderDash: [2, 2],
          },
        },
        x: {
          grid: {
            display: true,
            color: "rgba(0,0,0,0.1)",
            drawBorder: false,
            borderDash: [2, 2],
          },
        },
      },
      
  };

  const totalEarnings = 120;
  const totalExpenses = 140;
let error = null;
  //if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="p-4 bg-white flex flex-col ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t("PayRoll Vs Actual Spending")}</h2>
          <select
            className="border rounded p-2"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="currentMonth">{t("This month")}</option>
            <option value="lastMonth">{t("Last month")}</option>
          </select>
        </div>
        <div className="flex flex-col items-center justify-center text-center flex-1">
          <FiCalendar size={40} className="mb-4 text-gray-400" />
          <p className="text-gray-500">{t("No Earnings/Expense Data Found")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white flex flex-col w-full  border-2 border-gray-300 rounded-lg" >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("PayRoll Vs Actual Spending")}</h2>
      </div>
      <div className="relative flex items-center justify-center h-[30rem] w-full">
  <Line ref={chartRef} data={chartData} options={options} />
  {tooltipData && (
    <div
      style={{
        position: "absolute",
        left: tooltipData.left,
        top: tooltipData.top,
        transform: "translate(-50%, -100%)",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "#fff",
        padding: "8px",
        borderRadius: "4px",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <div>{tooltipData.value} QR</div>
      <div>{tooltipData.label}</div>
    </div>
  )}
</div>


    </div>
  );
};

export default PayRollGraph;
