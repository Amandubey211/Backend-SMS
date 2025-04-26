// Maintenance.js
import React, { useState } from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import { useTranslation } from "react-i18next";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";

const Maintenance = () => {
  const { t } = useTranslation("transportation");
  
  // Set navigation heading
  useNavHeading(t("Transportation"), t("Maintenance"));

  return (
    <Layout title={t("Transportation Maintenance") + " | Student diwan"}>
      <DashLayout>
        <div className="p-5">
          <h1 className="text-2xl font-bold mb-4">Transportation Maintenance</h1>
          <p>Manage maintenance schedules and records for transportation vehicles.</p>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default Maintenance;