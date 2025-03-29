import React from 'react'
import Layout from '../../../../Components/Common/Layout'
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import useNavHeading from '../../../../Hooks/CommonHooks/useNavHeading ';
import BudgetMain from './BudgetMain';
export default function BudgetDash() {
    useNavHeading("Finance", "Budget Planner");
  return (
    
    <Layout title="Finance | Budget Planner">
        <AdminDashLayout>
        <BudgetMain/>
        </AdminDashLayout>

    </Layout>
  )
}
