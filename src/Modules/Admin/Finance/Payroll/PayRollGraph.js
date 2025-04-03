import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EntityRevenueGraph from "../entityRevenue/Components/EntityRevenueGraph";
import { fetchPayrollGraph } from "../../../../Store/Slices/Finance/payroll/payroll.thunk";


const PayRollGraph = () => {
  const [viewMode, setViewMode] = useState("year");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dispatch = useDispatch()

  const { PayrollGraphData, loading } = useSelector(
     (store) => store.admin.payroll
   );
 
  useEffect(() => {
    dispatch(fetchPayrollGraph({ view: viewMode, year: selectedYear, month: selectedMonth })).then(()=>{
      console.log(PayrollGraphData);
      
    })
  }, [viewMode, selectedMonth, selectedYear]);

  const chartData = {
    labels:  PayrollGraphData?.map((d) => viewMode === "year" ? `Month ${d?.dayOrMonth}` : `Day ${d?.dayOrMonth}`),
    datasets: [
      {
        label: "Total Payroll",
        data:  PayrollGraphData?.map((d) => d?.totalExpense),
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
      title="Payroll"
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

export default PayRollGraph;
