import React from "react";
import Layout from "../../Components/Layout";
import DashLayout from "../../Components/DashLayout";
import MainSection from "./MainSection";

const Addmission = () => {
  return (
    <Layout title="Addmission Page">
      <DashLayout children={<MainSection />} />
    </Layout>
  );
};

export default Addmission;
