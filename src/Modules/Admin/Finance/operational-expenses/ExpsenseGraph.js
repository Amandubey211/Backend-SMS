import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EntityRevenueGraph from "../entityRevenue/Components/EntityRevenueGraph";
import { fetchOperationalExpensesGraph } from "../../../../Store/Slices/Finance/operationalExpenses/operationalExpenses.thunk";


const OperationalExpensesGraph = () => {
  const [viewMode, setViewMode] = useState("year");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dispatch = useDispatch()

  const { OperationalExpenseGraphData, loading } = useSelector(
     (store) => store.admin.operationalExpenses
   );
 
  useEffect(() => {
    dispatch(fetchOperationalExpensesGraph({ view: viewMode, year: selectedYear, month: selectedMonth })).then(()=>{
      console.log(OperationalExpenseGraphData);
      
    })
  }, [viewMode, selectedMonth, selectedYear]);

  const chartData = {
    labels:  OperationalExpenseGraphData?.map((d) => viewMode === "year" ? `Month ${d?.dayOrMonth}` : `Day ${d?.dayOrMonth}`),
    datasets: [
      {
        label: "Total Expense",
        data:  OperationalExpenseGraphData?.map((d) => d?.totalExpense),
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
      title="Operational Expenses"
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

export default OperationalExpensesGraph;
