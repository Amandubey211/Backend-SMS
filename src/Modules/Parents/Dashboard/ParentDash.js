import React from "react";
import ParentSection from "./MainSection.js";
import Layout from "../../../Components/Common/Layout.js";
import DashLayout from "../../../Components/Parents/ParentDashLayout.js";

const ParentDash = () => {
  return (
    <Layout title="Parents | Dashboard">
      <DashLayout children={<ParentSection />} hideAvatarList={true} />
    </Layout>
  );
};

export default ParentDash;
