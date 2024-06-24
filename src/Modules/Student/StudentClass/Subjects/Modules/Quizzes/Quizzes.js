import React from "react";
import MainSection from "./MainSection";
import { useParams } from "react-router-dom";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import Layout from "../../../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";

const Quizzes = () => {
  const { cid, sid } = useParams();
  useNavHeading(cid, sid);
  return (
    <Layout title="Quizzes | student diwan">
      <StudentDashLayout children={<MainSection />} hideSearchbar={true} />
    </Layout>
  );
};

export default Quizzes;
