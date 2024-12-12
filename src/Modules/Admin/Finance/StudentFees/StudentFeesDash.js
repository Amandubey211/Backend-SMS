// src/Modules/Admin/Finance/StudentFees/StudentFeesDashboard.js
import React from "react";
import Layout from "../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import StudentFeesMain from "./StudentFeesMain";

const StudentFeesDashboard = () => {
  return (
    <Layout title="Admin | Student Fees">
      <AdminDashLayout>
        <StudentFeesMain />
      </AdminDashLayout>
    </Layout>
  );
};

export default StudentFeesDashboard;
