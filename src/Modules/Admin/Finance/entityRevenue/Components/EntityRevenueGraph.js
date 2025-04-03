import React from "react";
import { Line } from "react-chartjs-2";
import { Select, Spin } from "antd";

const EntityRevenueGraph = ({
  title,
  year,
  viewMode,
  selectedMonth,
  selectedYear,
  loading,
  chartData,
  chartOptions,
  onChangeViewMode,
  onChangeMonth,
  onChangeYear,
}) => {
  return (
    <div className=" p-6 rounded-lg border border-gray-300 w-full relative ">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium text-gray-700 mb-6">
          {title} {selectedYear}
        </h3>

        <div className="flex items-center gap-4 mb-6">
          <Select
            value={viewMode}
            onChange={onChangeViewMode}
            style={{ width: 120 }}
            placeholder="Select View"
          >
            <Select.Option value="year">Year</Select.Option>
            <Select.Option value="month">Month</Select.Option>
          </Select>

          {viewMode === "month" && (
            <Select
              value={selectedMonth}
              onChange={onChangeMonth}
              style={{ width: 120 }}
              placeholder="Select Month"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Select.Option key={i + 1} value={i + 1}>
                  {new Date(2024, i, 1).toLocaleString("default", {
                    month: "long",
                  })}
                </Select.Option>
              ))}
            </Select>
          )}

          <Select
            value={selectedYear}
            onChange={onChangeYear}
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
        ) : (
          <Line data={chartData} options={{...chartOptions,maintainAspectRatio:false}} />
        )}
      </div>
    </div>
  );
};

export default EntityRevenueGraph;
