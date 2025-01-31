// src/Modules/Admin/Finance/StudentFees/StudentFeesDashboard.js
import React from "react";
import Layout from "../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import StudentFeesMain from "./StudentFeesMain";
import { Toaster } from "react-hot-toast";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";

const StudentFeesDashboard = () => {
  useNavHeading("Finance","Student Fees")
  return (
    <Layout title="Finance | Student Fees">
      <AdminDashLayout>
        <div className="w-full max-w-screen-xl mx-auto overflow-x-hidden">
          <StudentFeesMain />
        </div>
      </AdminDashLayout>
    </Layout>
  );
};

export default StudentFeesDashboard;
