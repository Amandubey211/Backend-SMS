import Layout from "../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import React, { useState } from "react";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import EntityRevenueForm from "./EntityRevenueForm.js";

export default function AddEntityRevenue() {

  
   
  useNavHeading("Finance", "Entity Revenue");
  return (
    <Layout title="Finance | Add New Invoice">
      <AdminDashLayout>
      <ProtectedSection requiredPermission={PERMISSIONS.ADD_NEW_FEES} title={'Add New Invoice'}>
      <EntityRevenueForm/>
        </ProtectedSection>
      </AdminDashLayout>
    </Layout>
  );
}
