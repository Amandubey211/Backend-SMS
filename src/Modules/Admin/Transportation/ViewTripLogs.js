import React from "react";
import { useTranslation } from "react-i18next";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import ViewTripList from "../../../Components/Transportation/ViewTripList";

const ViewTripsLogs = () => {
  const { t } = useTranslation();

  useNavHeading(t("Transportation"), t("Trip  Logs"));
  return (
    <Layout title={t("Trip  Logs") + " | Student diwan"}>
      <DashLayout>
        <div className="p-2">
          <ViewTripList />
        </div>
      </DashLayout>
    </Layout>
  );
};

export default ViewTripsLogs;
