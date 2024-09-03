import React from "react";
import ParentSection from "./MainSection.js";
import Layout from "../../../Components/Common/Layout.js";
import DashLayout from "../../../Components/Parents/ParentDashLayout.js";

import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
const ParentDash = () => {
  useNavHeading("Main Dashboard");
  return (
    <Layout title="Parents | Dashboard">
      <DashLayout children={<ParentSection />} hideAvatarList={true} />
    </Layout>
  );
};

export default ParentDash;
