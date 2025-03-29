import React, { useRef, useState, useEffect, memo, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { FiCalendar, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "antd";
import { useTranslation } from "react-i18next";
import { fetchIncomesGraph } from "../../../../Store/Slices/Finance/Earnings/earningsThunks";

ChartJS.register(...registerables);

// Custom BarGraphSkeleton component simulating a bar graph using Tailwind and animate-pulse
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

// Extracted Tooltip component for clarity
const ChartTooltip = ({ tooltipData }) => (
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
    }}
  >
    <div>{tooltipData.value} QR</div>
    <div>{tooltipData.label}</div>
  </div>
);

const TotalEarningsGraph = () => {
  const chartRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("currentMonth");

  const { t } = useTranslation("dashboard");
  const dispatch = useDispatch();
  const { incomeGraphData, loading, error } = useSelector(
    (state) => state.admin.earnings
  );

  useEffect(() => {
    dispatch(fetchIncomesGraph());
  }, [dispatch]);

  // Memoize grouped data for performance
  const groupedData = useMemo(() => {
    return incomeGraphData.reduce((acc, { time, totalRevenue, category }) => {
      if (!acc[time]) {
        acc[time] = { Earning: 0, Expense: 0 };
      }
      acc[time][category] += totalRevenue;
      return acc;
    }, {});
  }, [incomeGraphData]);

  const totalEarnings = useMemo(
    () =>
      Object.values(groupedData).reduce((sum, data) => sum + data.Earning, 0),
    [groupedData]
  );
  const totalExpenses = useMemo(
    () =>
      Object.values(groupedData).reduce((sum, data) => sum + data.Expense, 0),
    [groupedData]
  );

  const chartData = {
    labels: Object.keys(groupedData),
    fill: true,
    datasets: [
      {
        label: t("Earnings"),
        data: Object.values(groupedData).map((data) => data.Earning),
        borderColor: "#7C3AED",
        backgroundColor: "rgba(124, 58, 237, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "#7C3AED",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: t("Expenses"),
        data: Object.values(groupedData).map((data) => data.Expense),
        borderColor: "#EA580C",
        backgroundColor: "rgba(234, 88, 12, 0.2)",
        borderWidth: 2,
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
    maintainAspectRatio: false,
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
          setTooltipData({
            value,
            label,
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
          callback: (value) => value?.toLocaleString() + " QR",
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

  if (error || incomeGraphData.length === 0) {
    return (
      <div className="p-4 bg-white flex flex-col min-h-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t("Earnings")}</h2>
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
    <div className="p-4 bg-white flex flex-col min-h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("Earnings")}</h2>
      </div>
      <div className="relative" style={{ height: "350px" }}>
        <Line ref={chartRef} data={chartData} options={options} />
        {tooltipData && <ChartTooltip tooltipData={tooltipData} />}
      </div>

      {/* Compact bottom stats with icon circle backgrounds */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="bg-green-100 rounded shadow p-2 flex items-center">
          <div className="bg-green-200 rounded-full p-2 mr-2">
            <FiTrendingUp size={24} className="text-green-500" />
          </div>
          <div>
            <div className="text-sm text-gray-700">{t("Total Earnings")}</div>
            <div className="text-lg font-bold text-green-600">
              {totalEarnings?.toLocaleString()} QR
            </div>
          </div>
        </div>
        <div className="bg-red-100 rounded shadow p-2 flex items-center">
          <div className="bg-red-200 rounded-full p-2 mr-2">
            <FiTrendingDown size={24} className="text-red-500" />
          </div>
          <div>
            <div className="text-sm text-gray-700">{t("Total Expenses")}</div>
            <div className="text-lg font-bold text-red-600">
              {totalExpenses?.toLocaleString()} QR
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TotalEarningsGraph);
