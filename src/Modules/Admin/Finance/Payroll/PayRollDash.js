import React from 'react'
import Layout from '../../../../Components/Common/Layout'
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import useNavHeading from '../../../../Hooks/CommonHooks/useNavHeading ';
import PayRollMain from './PayRollMain';
export default function PayRollDash() {
    useNavHeading("Finance", "PayRoll");
  return (
    
    <Layout title="Finance | PayRoll">
        <AdminDashLayout>
        <PayRollMain/>
        </AdminDashLayout>

    </Layout>
  )
}
