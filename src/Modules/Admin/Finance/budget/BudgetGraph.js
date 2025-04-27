import React, { useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { FiCalendar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Skeleton } from "antd";
ChartJS.register(...registerables);
const BarGraphSkeleton = () => {
  const bars = Array.from({ length: 10 });

  return (
    <div className="flex items-end space-x-2 h-72">
      {bars.map((_, index) => (
        <div
          key={index}
          className="w-6 bg-gray-300 rounded animate-pulse"
          style={{ height: `${Math.floor(Math.random() * 60) + 40}%` }}
        ></div>
      ))}
    </div>
  );
};

const BudgetGraph = () => {
  const chartRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);
  const { t } = useTranslation("dashboard");

  const { data, loading, error } = useSelector((store) => store.admin.budget?.graphData);
  const schoolCurrency = useSelector((store) => store.common.user.userDetails?.currency);
  // Extract labels and datasets dynamically
  const labels = data?.map(item => item.subCategory) || [];

  const totalBudgetData = data?.map(item => item.totalBudget) || [];
  const spendAmountData = data?.map(item => item.spendAmount) || [];

  const chartData = {
    labels,
    datasets: [
      {
        label: t("Budget"),
        data: totalBudgetData,
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
        data: spendAmountData,
        borderColor: "#EA580C",
        backgroundColor: "rgba(234, 88, 12, 0.2)",
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
          const dataPoint = tooltipModel.dataPoints[0];
          setTooltipData({
            value: dataPoint.raw?.toLocaleString(),
            label: dataPoint.label,
            left: tooltipModel.caretX,
            top: tooltipModel.caretY,
          });
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
          callback: (value) => value?.toLocaleString(),
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


  if (loading) {
    return (
      <div className="p-4 bg-white flex flex-col min-h-[400px]">
        <div className="flex justify-between items-center mb-4">
          <Skeleton.Input active style={{ width: 150, height: 24 }} />
          <Skeleton.Input active style={{ width: 100, height: 32 }} />
        </div>
        <div className="relative flex-1 flex items-center justify-center">
          <BarGraphSkeleton />
        </div>
        <div className="flex items-center justify-around flex-row mt-4 pt-4 w-full">
          <Skeleton.Input active style={{ width: 100, height: 20 }} />
          <Skeleton.Input active style={{ width: 100, height: 20 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border-2 border-gray-300 rounded-lg flex flex-col w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("Budget Vs Actual Spending")}</h2>
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
            <div>{tooltipData.value} {schoolCurrency}</div>
            <div>{tooltipData.label}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetGraph;
