// src/Modules/Admin/Finance/EntityRevenue/EntityRevenueDashboard.js
import React from "react";
import Layout from "../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import EntityRevenueMain from "./EntityRevenueMain";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";

const EntityRevenueDash = () => {
  useNavHeading("Finance", "Entity Revenue");
  return (
    <Layout title="Finance | Entity Revenue">
      <AdminDashLayout>
        <div className="w-full max-w-screen-xl mx-auto overflow-x-hidden">
          <EntityRevenueMain />
        </div>
      </AdminDashLayout>
    </Layout>
  );
};

export default EntityRevenueDash;
