// src/Modules/Admin/Finance/Earnings/EarningDash.js
import React from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import EarningMainSection from "./EarningMainSection";

const EarningDash = () => {
  return (
    <Layout title="Admin | Earnings">
      <DashLayout>
        <EarningMainSection />
      </DashLayout>
    </Layout>
  );
};

export default EarningDash;
