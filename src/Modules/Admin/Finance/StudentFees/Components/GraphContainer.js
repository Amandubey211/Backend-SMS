import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchGraphStudentFee } from "../../../../../Store/Slices/Finance/StudentFees/studentFeesThunks";
import EntityRevenueGraph from "../../entityRevenue/Components/EntityRevenueGraph";

const GraphContainer = () => {
  const [viewMode, setViewMode] = useState("year");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dispatch = useDispatch()

const { graphStudntFees, loading } = useSelector(
    (state) => state.admin.studentFees
  );;
  useEffect(() => {
    dispatch(fetchGraphStudentFee({ view: viewMode, year: selectedYear, month: selectedMonth }))
  }, [viewMode, selectedMonth, selectedYear]);

  const chartData = {
    labels: graphStudntFees?.map((d) => viewMode === "year" ? `Month ${d?.dayOrMonth}` : `Day ${d?.dayOrMonth}`),
    datasets: [
      {
        label: "Total Fees",
        data: graphStudntFees?.map((d) => d?.totalEarnings),
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
      title="Student Fees Earning"
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

export default GraphContainer;
