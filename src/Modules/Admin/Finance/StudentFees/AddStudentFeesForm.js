import Layout from "../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import React, { useState } from "react";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import StudentFeesForm from "./StudentFeesForm";

export default function AddStudentFeesForm() {

  
   
  useNavHeading("Finance", "Add Student Fees");
  return (
    <Layout title="Finance | Add Student Fees">
      <AdminDashLayout>
      <ProtectedSection requiredPermission={PERMISSIONS.ADD_NEW_FEES} title={'Add Fees'}>
      <StudentFeesForm/>
        </ProtectedSection>
      </AdminDashLayout>
    </Layout>
  );
}
