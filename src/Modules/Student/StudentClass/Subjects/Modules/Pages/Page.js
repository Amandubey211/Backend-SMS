import React from "react";

import MainSection from "./MainSection";
import { useParams } from "react-router-dom";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import Layout from "../../../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";

const Page = () => {
  const { cid, sid } = useParams();
  useNavHeading(cid, sid);
  return (
    <div>
      <Layout title={`Pages | Student Diwan`}>
        <StudentDashLayout children={<MainSection />} hideSearchbar={true} />
      </Layout>
    </div>
  );
};

export default Page;
