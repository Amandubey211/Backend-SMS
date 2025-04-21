import React, { useRef, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { FiCalendar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchReconciliationGraph } from "../../../../Store/Slices/Finance/Receipts/receiptsThunks";

ChartJS.register(...registerables);

export default function BankReconciliationGraph() {
  const chartRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const { t } = useTranslation("dashboard");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchReconciliationGraph()).then((action) => {
      setGraphData(action.payload.data || []);
    });
  }, [dispatch]);

  const labels = graphData?.map((_, index) => `Month ${index + 1}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: t("Verified"),
        data: graphData?.map(item => item.verified),
        borderColor: "#22C55E",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#22C55E",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: t("Resolved"),
        data: graphData?.map(item => item.resolved),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#3B82F6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: t("Reject"),
        data: graphData?.map(item => item.reject),
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#EF4444",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: t("Pending"),
        data: graphData?.map(item => item.pending),
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#F59E0B",
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

  return (
    <div className="p-4 bg-white flex flex-col w-full border-2 border-gray-300 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("Reconciliation")}</h2>
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
            <div>{tooltipData?.value}</div>
            <div>{tooltipData?.label}</div>
          </div>
        )}
      </div>
    </div>
  );
}
