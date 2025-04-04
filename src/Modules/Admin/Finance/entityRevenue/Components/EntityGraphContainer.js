import React, { useEffect, useState } from "react";
import axios from "axios";
import EntityRevenueGraph from "./EntityRevenueGraph";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEntityRevenueGraph } from "../../../../../Store/Slices/Finance/EntityRevenue/EntityRevenue.thunk";

const RevenueContainer = () => {
  const [viewMode, setViewMode] = useState("year");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dispatch = useDispatch()

  const { entityRevenueGraph, loading,  } = useSelector(
    (state) => state.admin.entityRevenue
  );
  useEffect(() => {
    dispatch(fetchAllEntityRevenueGraph({ view: viewMode, year: selectedYear, month: selectedMonth }))
  }, [viewMode, selectedMonth, selectedYear]);

  const chartData = {
    labels: entityRevenueGraph?.map((d) => viewMode === "year" ? `Month ${d?.dayOrMonth}` : `Day ${d?.dayOrMonth}`),
    datasets: [
      {
        label: "Total Earnings",
        data: entityRevenueGraph?.map((d) => d?.totalEarnings),
        fill: false,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  return (
    <EntityRevenueGraph
      title="Entity Revenue"
      viewMode={viewMode}
      selectedMonth={selectedMonth}
      selectedYear={selectedYear}
      onChangeViewMode={setViewMode}
      onChangeMonth={setSelectedMonth}
      onChangeYear={setSelectedYear}
      chartData={chartData}
      chartOptions={chartOptions}
      loading={loading}
    />
  );
};

export default RevenueContainer;
