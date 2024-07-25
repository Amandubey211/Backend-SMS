import React from "react";
import MainSection from "./MainSection";
import Layout from "../../../../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../../../../Components/Student/StudentDashLayout";
import { useSelector } from "react-redux";
import useNavHeading from "../../../../../../../Hooks/CommonHooks/useNavHeading ";
 
const QuizzList = () => {
  const subjectName = useSelector((store) => store.Common.selectedSubjectName);
  const className = useSelector((store) => store.Common.selectedClassName);

  useNavHeading(className, subjectName);
  return (
    <Layout>
      <StudentDashLayout children={<MainSection />} hideSearchbar={true} />
    </Layout>
  );
};

export default QuizzList;
