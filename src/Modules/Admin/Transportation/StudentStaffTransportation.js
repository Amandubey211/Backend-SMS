// StudentStaffTransportation.js
import React, { useState } from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import { useTranslation } from "react-i18next";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";

const StudentStaffTransportation = () => {
  const { t } = useTranslation("transportation");
  
  // Set navigation heading
  useNavHeading(t("Transportation"), t("Student & Staff Transportation"));

  return (
    <Layout title={t("Student & Staff Transportation") + " | Student diwan"}>
      <DashLayout>
        <div className="p-5">
          <h1 className="text-2xl font-bold mb-4">Student & Staff Transportation</h1>
          <p>Manage transportation services for students and staff members.</p>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default StudentStaffTransportation;