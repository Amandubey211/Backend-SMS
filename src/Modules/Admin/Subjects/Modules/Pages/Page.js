import React from "react";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import Layout from "../../../../../Components/Common/Layout";
import MainSection from "./MainSection";
import { useParams } from "react-router-dom";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";

const Page = () => {
  const { cid, sid } = useParams();
  useNavHeading(cid, sid);
  return (
    <div>
      <Layout title={`Pages | Student Diwan`}>
        <DashLayout children={<MainSection />} hideSearchbar={true} />
      </Layout>
    </div>
  );
};

export default Page;

