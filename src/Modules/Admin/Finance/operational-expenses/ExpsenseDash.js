import React from 'react'
import Layout from '../../../../Components/Common/Layout'
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import useNavHeading from '../../../../Hooks/CommonHooks/useNavHeading ';
import OperationalExpensesMain from './ExpsenseMain';
export default function OperationalExpensesDash() {
    useNavHeading("Finance", "Expenses");
  return (
    
    <Layout title="Finance | Expenses">
        <AdminDashLayout>
        <OperationalExpensesMain/>
        </AdminDashLayout>

    </Layout>
  )
}
