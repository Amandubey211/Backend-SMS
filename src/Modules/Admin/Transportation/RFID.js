// RFID.js
import React, { useState } from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import { useTranslation } from "react-i18next";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";

const RFID = () => {
  const { t } = useTranslation("transportation");
  
  // Set navigation heading
  useNavHeading(t("Transportation"), t("RFID"));

  return (
    <Layout title={t("RFID Management") + " | Student diwan"}>
      <DashLayout>
        <div className="p-5">
          <h1 className="text-2xl font-bold mb-4">RFID Management</h1>
          <p>Configure RFID systems for transportation tracking and access.</p>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default RFID;