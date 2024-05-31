import React from "react";
import Layout from "../../Components/Layout";
// import "chart.js/auto";
import DashLayout from "../../Components/DashLayout.js";
import MainSection from "./MainSection.js";
const Dash = () => {
  return (
    <Layout title="DashBoard">
      <DashLayout children={<MainSection />} />
    </Layout>
  );
};

export default Dash;
