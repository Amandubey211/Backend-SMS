import React from "react";

import MainSection from "./MainSection";
import { useParams } from "react-router-dom";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import Layout from "../../../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";
import { useSelector } from "react-redux";

const Page = () => {
  const { cid, sid } = useParams();
  const subjectName = useSelector((store) => store.Common.selectedSubjectName);
  const className = useSelector((store) => store.Common.selectedClassName);

  // useNavHeading(cid, sid);
  useNavHeading(className, subjectName);

  return (
    <div>
      <Layout title={`Pages | Student Diwan`}>
        <StudentDashLayout children={<MainSection />} hideSearchbar={true} />
      </Layout>
    </div>
  );
};

export default Page;
