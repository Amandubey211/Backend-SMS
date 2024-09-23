import React from "react";

import MainSection from "./MainSection";
import useNavHeading from "../../../../../../../Hooks/CommonHooks/useNavHeading ";
import StudentDashLayout from "../../../../../../../Components/Student/StudentDashLayout";
import Layout from "../../../../../../../Components/Common/Layout";
import { useSelector } from "react-redux";

const DiscussionView = () => {
  const subjectName = useSelector((store) => store.Common.selectedSubjectName);
  const className = useSelector((store) => store?.Common?.selectedClassName);

  useNavHeading(className, subjectName);

  return (
    <Layout title={`Discussion View | Student Diwan`}>
      <StudentDashLayout children={<MainSection />} hideSearchbar={true} />
    </Layout>
  );
};

export default DiscussionView;
