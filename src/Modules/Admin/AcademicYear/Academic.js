import React from "react";
import MainSection from "./MainSection.js";
import Layout from "../../../Components/Common/Layout.js";
import DashLayout from "../../../Components/Admin/AdminDashLayout.js";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
import { useSelector } from "react-redux";

const Academic = () => {
  const role = useSelector((store) => store.common.auth.role);
  useNavHeading(role, `Academic`);
  return (
    <Layout title={` Academics  | Student Diwan`}>
      <DashLayout children={<MainSection />} />
    </Layout>
  );
};

export default Academic;
