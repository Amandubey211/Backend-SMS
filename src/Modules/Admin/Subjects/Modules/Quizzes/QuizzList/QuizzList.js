import React from "react";
import Layout from "../../../../../../Components/Common/Layout";
import DashLayout from "../../../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";

const QuizzList = () => {
  return (
    <Layout>
      <DashLayout children={<MainSection />} hideSearchbar={true} />
    </Layout>
  );
};

export default QuizzList;
