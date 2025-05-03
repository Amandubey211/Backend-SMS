import React from "react";
import Layout from "../../../../../../Components/Common/Layout";
import DashLayout from "../../../../../../Components/Admin/AdminDashLayout";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import { t } from "i18next";

const ViewTrip = () => {
  useNavHeading(t("Transportation"), t("View Trip"));
  return (
    <Layout title={t("View Trip") + " | Student diwan"}>
      <DashLayout>
        <div className="p-2">sdf</div>
      </DashLayout>
    </Layout>
  );
};

export default ViewTrip;
