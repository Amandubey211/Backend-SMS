import React from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";

const Class = () => {
  return (
    <Layout title="sub Class">
      <DashLayout children={<MainSection />} />;
    </Layout>
  );
};

export default Class;
