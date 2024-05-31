import React from "react";
import DashLayout from "../../../Components/DashLayout";
import MainSection from "./MainSection";
import Layout from "../../../Components/Layout";

const Class = () => {
  return (
    <Layout title="sub Class">
      <DashLayout children={<MainSection />} />;
    </Layout>
  );
};

export default Class;
