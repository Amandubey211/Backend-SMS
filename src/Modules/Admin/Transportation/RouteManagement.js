// RouteManagement.js
import React, { useState } from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import { useTranslation } from "react-i18next";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import RouteList from "../../../Components/Transportation/routeList";

const RouteManagement = () => {
  const { t } = useTranslation("transportation");

  // Set navigation heading
  useNavHeading(t("Transportation"), t("Route Management"));

  return (
    <Layout title={t("Route Management") + " | Student diwan"}>
      <DashLayout>
        <div className="p-5">
          <h1 className="text-2xl font-bold mb-4">Route Management</h1>
          <RouteList />
        </div>
      </DashLayout>
    </Layout>
  );
};

export default RouteManagement;
