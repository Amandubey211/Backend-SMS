import React from "react";
import DashLayout from "../../Components/DashLayout";
import ClassesMainSection from "./MainSection/ClassesMainSection";
import Layout from "../../Components/Layout";

const Classes = () => {
  return (
    <Layout title="All Classes">
      <DashLayout children={<ClassesMainSection />} />;
    </Layout>
  );
};

export default Classes;
