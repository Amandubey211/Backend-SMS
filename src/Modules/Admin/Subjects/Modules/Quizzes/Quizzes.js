import React from "react";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import { useParams } from "react-router-dom";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";

const Quizzes = () => {
  const { cid, sid } = useParams();
  useNavHeading(cid, sid);
  return (
    <Layout title="Quizzes | student diwan">
      <DashLayout children={<MainSection />} hideSearchbar={true} />
    </Layout>
  );
};

export default Quizzes;
