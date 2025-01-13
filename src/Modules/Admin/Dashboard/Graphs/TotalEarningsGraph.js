import React, { useRef, useState, useEffect, memo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { FiCalendar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../../Components/Common/Spinner";
import { useTranslation } from "react-i18next";
import { fetchIncomesGraph } from "../../../../Store/Slices/Finance/Earnings/earningsThunks";

ChartJS.register(...registerables);

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

  // Group data by month and category
  const groupedData = incomeGraphData.reduce((acc, { time, totalRevenue, category }) => {
    if (!acc[time]) {
      acc[time] = { Earning: 0, Expense: 0 };
    }
    acc[time][category] += totalRevenue;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: t("Earnings"),
        data: Object.values(groupedData).map((data) => data.Earning),
        borderColor: "#7C3AED",
        backgroundColor: "rgba(124, 58, 237, 0.2)", // Light purple fill
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
        data: Object.values(groupedData).map((data) => data.Expense),
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

  const totalEarnings = Object.values(groupedData).reduce((sum, data) => sum + data.Earning, 0);
  const totalExpenses = Object.values(groupedData).reduce((sum, data) => sum + data.Expense, 0);

  if (loading) return <Spinner />;
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
      <div className="relative flex-1">
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
            }}
          >
            <div>{tooltipData.value} QR</div>
            <div>{tooltipData.label}</div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-around flex-row mt-16 pt-4 w-full">
        <div className="flex items-center">
          <div className="text-gray-700">{t("Total Earnings")}</div>
          <div className="ml-2 font-bold mr-1">{totalEarnings?.toLocaleString()}</div>
          <div className="text-gray-700">QR</div>
        </div>
        <div className="flex items-center">
          <div className="text-gray-700">{t("Total Expenses")}</div>
          <div className="ml-2 font-bold mr-1">{totalExpenses?.toLocaleString()}</div>
          <div className="text-gray-700">QR</div>
        </div>
      </div>
    </div>
  );
};

export default memo(TotalEarningsGraph);
