import React from 'react'
import Layout from '../../../../Components/Common/Layout'
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import PDFSearchViewer from './PdfReader';
export default function StartReconciliation() {
  return (
    <Layout title="Finance | Bank Reconciliationr">
    <AdminDashLayout>
    <PDFSearchViewer/>
    </AdminDashLayout>

</Layout>
  )
}
