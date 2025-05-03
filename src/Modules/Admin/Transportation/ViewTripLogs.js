import React from "react";
import { useTranslation } from "react-i18next";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import ViewTripList from "../../../Components/Transportation/ViewTripList";
import { HiOutlineClipboardList } from "react-icons/hi";

const ViewTripsLogs = () => {
  const { t } = useTranslation();

  useNavHeading(t("Transportation"), t("Trip Execution Logs"));
  return (
    <Layout title={t("Trip Execution Logs") + " | Student diwan"}>
      <DashLayout>
        <div className="p-5">
          {/* Header section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <HiOutlineClipboardList className="text-xl text-primary" />
              <h1 className="text-lg font-medium">Trip Execution Logs</h1>
            </div>
          </div>
          <ViewTripList />
        </div>
      </DashLayout>
    </Layout>
  );
};

export default ViewTripsLogs;
