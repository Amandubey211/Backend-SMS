import React from "react";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import { useParams } from "react-router-dom";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";

const Assignment = () => {
  const { cid, sid } = useParams();
  useNavHeading(cid, sid);
  return (
    <Layout title="Assignment | student diwan">
      <DashLayout hideSearchbar={true} children={<MainSection />}   />
    </Layout>
  );
};

export default Assignment;
