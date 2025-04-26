// RouteManagement.js
import React, { useEffect, useState } from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import { useTranslation } from "react-i18next";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import RouteList from "../../../Components/Transportation/routeList";
import { useDispatch, useSelector } from "react-redux";
import { getAllRoutes } from "../../../Store/Slices/Transportation/RoutesManagment/routes.action";

const RouteManagement = () => {
  const { t } = useTranslation("transportation");

  // Set navigation heading
  useNavHeading(t("Transportation"), t("Route Management"));

  return (
    <Layout title={t("Route Management") + " | Student diwan"}>
      <DashLayout>
        <div className="p-5">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-4">Route Management</h1>
            <div className="mb-4 flex gap-4">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                Add SubRoute
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Add Route
              </button>
            </div>
          </div>
          <RouteList />
        </div>
      </DashLayout>
    </Layout>
  );
};

export default RouteManagement;
