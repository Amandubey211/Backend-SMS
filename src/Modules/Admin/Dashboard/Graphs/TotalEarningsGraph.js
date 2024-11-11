import React, { useRef, useState, useEffect, memo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { FiCalendar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchEarningsData } from "../../../../Store/Slices/Admin/Dashboard/adminDashboard.action"; // Make sure the path is correct
import Spinner from "../../../../Components/Common/Spinner";
import { useTranslation } from "react-i18next";

ChartJS.register(...registerables);

const TotalEarningsGraph = () => {
  const chartRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("currentMonth");

  const { t } = useTranslation("dashboard");

  const dispatch = useDispatch();
  const {
    loadingEarnings: loading,
    errorEarnings: error,
    earningsData,
  } = useSelector((state) => state?.admin?.adminDashboard);

  // Function to dispatch the fetchEarningsData action
  const fetchDashboardData = (option) => {
    const date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let includeUnpaidExpenses = true;

    if (option === "lastMonth") {
      month = month === 1 ? 12 : month - 1;
      year = month === 12 ? year - 1 : year;
    } else if (option === "totalExpensesWithoutPay") {
      includeUnpaidExpenses = false;
    }

    // Dispatch fetchEarningsData with necessary parameters
    dispatch(fetchEarningsData({ month, year, includeUnpaidExpenses }));
  };

  // Fetch data whenever selectedOption changes
  useEffect(() => {
    fetchDashboardData(selectedOption);
  }, [selectedOption]);

  // Handle tooltip outside click
  const handleOutsideClick = (event) => {
    if (chartRef.current && !chartRef.current.canvas.contains(event.target)) {
      setTooltipData(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error || !earningsData) {
    return "No Data";
  }

  if (
    !earningsData ||
    (earningsData?.earningsData?.length === 0 &&
      earningsData?.expensesData?.length === 0)
  ) {
    return (
      <div className="p-4 bg-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Earnings</h2>
          </div>
          <div>
            <select
              className="border rounded p-2"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="currentMonth">This month</option>
              <option value="lastMonth">Last month</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center p-4">
          <FiCalendar size={40} className="mb-4 text-gray-400" />
          <p className="text-gray-500">{t("No Earnings/Expense Data Found")}</p>
        </div>
        <div className="flex justify-around mt-4">
          <div className="flex flex-col items-start">
            <div
              className="w-16 h-1 rounded-full mb-1"
              style={{ backgroundColor: "#7C3AED", alignSelf: "flex-start" }}
            ></div>
            <div className="flex items-center">
              <div className="text-gray-700">Total Collections</div>
              <div className="ml-2 font-bold mr-1">
                {earningsData
                  ? earningsData?.totalEarnings?.toLocaleString()
                  : 0}
              </div>
              <div className="text-gray-700">QR</div>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div
              className="w-16 h-1 rounded-full mb-1"
              style={{ backgroundColor: "#EA580C", alignSelf: "flex-start" }}
            ></div>
            <div className="flex items-center">
              <div className="text-gray-700">{t("Total Expenses")}</div>
              <div className="ml-2 font-bold mr-1">
                {earningsData
                  ? earningsData.totalExpenses?.toLocaleString()
                  : 0}
              </div>
              <div className="text-gray-700">QR</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    earningsData: earnings,
    expensesData: expenses,
    totalEarnings,
    totalExpenses,
  } = earningsData;

  // Function to get the ordinal suffix of a number
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

  const data = {
    labels: earnings?.map((item) => `${item.day}`),
    datasets: [
      {
        label: "Total Collections",
        data: earnings?.map((item) => item.amount),
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
        data: expenses?.map((item) => item.amount),
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
          const day = tooltipModel?.dataPoints[0]?.dataIndex + 1;
          const date = new Date();
          date.setDate(day);
          const formattedDate = `${day}${getOrdinalSuffix(
            day
          )} ${date?.toLocaleString("default", { month: "long" })}`;
          setTooltipData({
            value,
            formattedDate,
            left: tooltipModel.caretX,
            top: tooltipModel.caretY,
          });
        },
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
            return value?.toLocaleString() + " QR";
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
  };

  return (
    <div className="p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">{t("Earnings")}</h2>
        </div>
        <div>
          <select
            className="border rounded p-2"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="currentMonth">{t("This month")}</option>
            <option value="lastMonth">{t("Last month")}</option>
          </select>
        </div>
      </div>
      <div className="relative">
        <Line ref={chartRef} data={data} options={options} />
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
            <div>{tooltipData.value}</div>
            <div>{tooltipData.formattedDate}</div>
          </div>
        )}
      </div>
      <div className="flex justify-around mt-4">
        <div className="flex flex-col items-start">
          <div
            className="w-16 h-1 rounded-full mb-1"
            style={{ backgroundColor: "#7C3AED", alignSelf: "flex-start" }}
          ></div>
          <div className="flex items-center">
            <div className="text-gray-700">{t("Total Collections")}</div>
            <div className="ml-2 font-bold mr-1">
              {totalEarnings?.toLocaleString()}
            </div>
            <div className="text-gray-700">QR</div>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div
            className="w-16 h-1 rounded-full mb-1"
            style={{ backgroundColor: "#EA580C", alignSelf: "flex-start" }}
          ></div>
          <div className="flex items-center">
            <div className="text-gray-700">{t("Total Expenses")}</div>
            <div className="ml-2 font-bold mr-1">
              {totalExpenses?.toLocaleString()}
            </div>
            <div className="text-gray-700">QR</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TotalEarningsGraph);
