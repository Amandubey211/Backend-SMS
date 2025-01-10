// src/Modules/Admin/Finance/ExpenseMain.js

import React, { useEffect } from "react";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import CardSection from "./components/CardSection";
import ExpenseChart from "./components/ExpenseChart";
import ExpenseTable from "./components/ExpenseTable";
import Layout from "../../../../Components/Common/Layout";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { useDispatch } from "react-redux";
import {
  fetchCardDataExpense,
  fetchExpenseGraph,
} from "../../../../Store/Slices/Finance/Expenses/expensesThunks";

const ExpenseMain = () => {
  const dispatch = useDispatch();
  useNavHeading("Finance", "Expenses");

  useEffect(() => {
    // Fetch initial data when the component mounts
    dispatch(fetchExpenseGraph({ groupBy: "month" }));
    dispatch(fetchCardDataExpense({ year: new Date().getFullYear() }));
  }, [dispatch]);

  return (
    <Layout title="Expense Dashboard | Student Diwan">
      <DashLayout>
        <div className="p-2 space-y-2 scroll-smooth overflow-y-auto h-full w-full mx-auto">
          <CardSection />
          <ExpenseChart />
          <ExpenseTable />
        </div>
      </DashLayout>
    </Layout>
  );
};

export default ExpenseMain;
