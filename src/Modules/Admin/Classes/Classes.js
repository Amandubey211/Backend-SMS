import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import ClassesMainSection from "./MainSection/ClassesMainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";

const Classes = () => {
  useNavHeading("Classes");
  return (
    <Layout title="All Classes">
      <DashLayout children={<ClassesMainSection />} />;
    </Layout>
  );
};

export default Classes;
