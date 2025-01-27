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
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";

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
          <div>
        <ProtectedSection requiredPermission={PERMISSIONS.VIEW_EXPENSE_CARD_DATA} title={'Cards'}>
            <CardSection />
          </ProtectedSection>
          </div>
          <div>
          <ProtectedSection requiredPermission={PERMISSIONS.VIEW_EXPENSE_GRAPH} title={'Graph'}>
          <ExpenseChart />
          </ProtectedSection>
          </div>
          <div>
          <ProtectedSection requiredPermission={PERMISSIONS.VIEW_SUMMARY_OF_EXPENSES} title={'List'}>
          <ExpenseTable />
          </ProtectedSection>
          </div>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default ExpenseMain;
