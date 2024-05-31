import React from "react";
import Layout from "../../Components/Layout";
import DashLayout from "../../Components/DashLayout";
import MainSection from "./MainSection";

const Teacher = () => {
  return (
    <Layout>
      <DashLayout children={<MainSection />} />
    </Layout>
  );
};

export default Teacher;
