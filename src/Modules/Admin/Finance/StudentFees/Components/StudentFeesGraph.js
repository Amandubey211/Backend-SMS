import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { studentFeesGraph } from "../../../../../Store/Slices/Finance/StudentFees/studentFeesThunks";
import { Select, Spin, Alert } from "antd";  // Importing Ant Design components

const StudentFeesGraph = () => {
  const { stdFeesGraph, loading, error } = useSelector(
    (state) => state.admin.studentFees
  );
  const chartRef = useRef(null);
  const dispatch = useDispatch();

  const [viewMode, setViewMode] = useState("year");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const params =
      viewMode === "year"
        ? { view: "year", year: selectedYear }
        : { view: "month", year: selectedYear, month: selectedMonth };

    dispatch(studentFeesGraph(params));
  }, [dispatch, viewMode, selectedYear, selectedMonth]);

  const handleViewModeChange = (value) => {
    setViewMode(value);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const generateLabels = () => {
    if (viewMode === "year") {
      return Array.from({ length: 12 }, (_, i) =>
        new Date(2024, i, 1).toLocaleString("default", { month: "short" })
      );
    } else {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    }
  };

  const chartData = {
    labels: generateLabels(),
    datasets: [
      {
        label: "Fees Collected",
        data: stdFeesGraph?.map((item) => item.totalEarnings || 0),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: viewMode === "year" ? "Months" : "Days",
        },
      },
      y: {
        title: {
          display: true,
          text: "Fees Collected",
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-300 w-full relative">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium text-gray-700 mb-6">
           Fees Collection {selectedYear}
        </h3>

        <div className="flex items-center gap-4 mb-6">
          <Select
            value={viewMode}
            onChange={handleViewModeChange}
            style={{ width: 120 }}
            placeholder="Select View"
          >
            <Select.Option value="year">Year</Select.Option>
            <Select.Option value="month">Month</Select.Option>
          </Select>

          {viewMode === "month" && (
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{ width: 120 }}
              placeholder="Select Month"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Select.Option key={i + 1} value={i + 1}>
                  {new Date(2024, i, 1).toLocaleString("default", { month: "long" })}
                </Select.Option>
              ))}
            </Select>
          )}

          <Select
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: 120 }}
            placeholder="Select Year"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <Select.Option key={year} value={year}>
                  {year}
                </Select.Option>
              );
            })}
          </Select>
        </div>
      </div>

      <div className="h-96 w-full">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="mb-4">
            <Alert message="Error loading data" type="error" showIcon />
          </div>
        ) : (
          <Line ref={chartRef} data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default StudentFeesGraph;
