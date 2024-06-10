import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import MainSection from "../Addmission/MainSection";

const Addmission = () => {
  return (
    <Layout title="Addmission | Student diwan" >
      <DashLayout children={<MainSection />} />
    </Layout>
  );
};

export default Addmission;
