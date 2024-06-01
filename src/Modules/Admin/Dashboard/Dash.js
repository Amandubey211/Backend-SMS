import React from "react";
import MainSection from "./MainSection.js";
import Layout from "../../../Components/Common/Layout.js";
import DashLayout from "../../../Components/Admin/AdminDashLayout.js";
const Dash = () => {
  return (
    <Layout title="DashBoard">
      <DashLayout children={<MainSection />} />
    </Layout>
  );
};

export default Dash;
