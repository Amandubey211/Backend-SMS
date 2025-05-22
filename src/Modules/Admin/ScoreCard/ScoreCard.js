import React from "react";
import Layout from "../../../Components/Common/Layout.js";
import DashLayout from "../../../Components/Admin/AdminDashLayout.js";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
import { useSelector } from "react-redux";
import MainSection from "./MainSection.js";


const Branch = () => {
  const role = useSelector((store) => store.common.auth.role);
  useNavHeading(role, `Report Card`);
  return (
    <Layout title={`Report Card | Student Diwan`}>
      <DashLayout children={<MainSection/>} />
    </Layout>
  );
};

export default Branch;