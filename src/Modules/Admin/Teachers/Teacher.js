import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { useParams } from "react-router-dom";

const Teacher = () => {
  const { cid } = useParams();
  useNavHeading(cid, "Teachers");
  return (
    <Layout>
      <DashLayout children={<MainSection />} />
    </Layout>
  );
};

export default Teacher;
