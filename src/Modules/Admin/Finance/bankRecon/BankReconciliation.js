import React from 'react'
import useNavHeading from '../../../../Hooks/CommonHooks/useNavHeading ';
import Layout from '../../../../Components/Common/Layout'
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import BankReconciliationMain from './BankReconciliationMain';
export default function BankReconsilation() {
  useNavHeading("Finance", "Bank Reconciliation");
  return (
    
    <Layout title="Finance | Bank Reconciliationr">
        <AdminDashLayout>
        <BankReconciliationMain/>
        </AdminDashLayout>

    </Layout>
  )
}
