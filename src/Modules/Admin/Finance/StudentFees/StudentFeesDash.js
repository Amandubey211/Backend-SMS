// src/Modules/Admin/Finance/StudentFees/StudentFeesDashboard.js
import React from "react";
import Layout from "../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import StudentFeesMain from "./StudentFeesMain";

const StudentFeesDashboard = () => {
  return (
    <Layout title="Admin | Student Fees">
      <AdminDashLayout>
        <div className="w-full max-w-screen-xl mx-auto overflow-x-hidden p-4 md:p-6">
          <StudentFeesMain />
        </div>
      </AdminDashLayout>
    </Layout>
  );
};

export default StudentFeesDashboard;
