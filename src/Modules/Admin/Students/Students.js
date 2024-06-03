import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";

const Students = () => {
  return (
    <Layout>
      <DashLayout children={<MainSection />} />
    </Layout>
  );
};

export default Students;
