import React from "react";
import MainSection from "./MainSection";
import { useParams } from "react-router-dom";
import Layout from "../../../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";

const Grade = () => {
  const { cid, sid } = useParams();
  useNavHeading(cid, sid);
  return (
    <Layout title={`Grade | Student Diwan`}>
      <StudentDashLayout children={<MainSection />} hideSearchbar={true} />
    </Layout>
  );
};

export default Grade;
